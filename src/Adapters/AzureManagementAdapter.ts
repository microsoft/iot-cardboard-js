import axios from 'axios';
import { AdapterMethodSandbox } from '../Models/Classes';
import ADTInstanceTimeSeriesConnectionData from '../Models/Classes/AdapterDataClasses/ADTInstanceTimeSeriesConnectionData';
import {
    AzureResourceData,
    AzureResourcesData,
    AzureSubscriptionData
} from '../Models/Classes/AdapterDataClasses/AzureManagementData';
import {
    AdapterMethodParamsForGetAzureResources,
    ADTResourceIdentifier,
    ADTResourceIdentifierWithHostname,
    ADTResourceIdentifierWithId,
    AzureAccessPermissionRoleGroups,
    AzureAccessPermissionRoles,
    AzureResourceDisplayFields,
    AzureResourcesAPIVersions,
    AzureResourceTypes,
    ComponentErrorType,
    IAuthService,
    IAzureManagementAdapter,
    IAzureResource,
    IAzureRoleAssignment,
    IAzureStorageAccount,
    IAzureStorageBlobContainer,
    IAzureSubscription,
    IAzureTimeSeriesDatabaseConnection,
    RequiredAccessRoleGroupForADTInstance
} from '../Models/Constants';
import {
    createGUID,
    getDebugLogger,
    getMissingRoleIdsFromRequired,
    getRoleIdsFromRoleAssignments
} from '../Models/Services/Utils';

// const MAX_RESOURCE_TAKE_LIMIT = 1000; // if necessary limit the number of resources to check against permissions

const debugLogging = false;
const logDebugConsole = getDebugLogger('AzureManagementAdapter', debugLogging);
export default class AzureManagementAdapter implements IAzureManagementAdapter {
    public authService: IAuthService;
    public tenantId: string;
    public uniqueObjectId: string;
    constructor(
        authService: IAuthService,
        tenantId?: string,
        uniqueObjectId?: string
    ) {
        this.authService = authService;
        this.authService.login();
        this.tenantId = tenantId;
        this.uniqueObjectId = uniqueObjectId;
    }

    /** Given a url and params, continuously fetch resources if nextLink exist in the request response and append it to the given accumulator array */
    async fetchAllResources<T>(
        adapterMethodSandbox: AdapterMethodSandbox,
        accumulator: Array<T> = [],
        token: string, // TODO: if fetch takes so long, token might expire
        url: string,
        params?: { apiVersion: string; $filter?: string },
        nextLink?: string // this is a full url which includes all the params, so dont include api-version param in the request if there is nextLink
    ) {
        const result = await axios({
            method: 'get',
            url: nextLink || url,
            headers: {
                'Content-Type': 'application/json',
                authorization: 'Bearer ' + token
            },
            params: {
                ...(!nextLink && {
                    'api-version': params?.apiVersion || '2021-09-01'
                }),
                ...(params?.$filter && {
                    $filter: params.$filter
                })
            }
        }).catch((err) => {
            adapterMethodSandbox.pushError({
                type: ComponentErrorType.DataFetchFailed,
                isCatastrophic: false,
                rawError: err
            });
            return null;
        });

        if (result?.data?.value) {
            accumulator = accumulator.concat(result.data.value);
        }

        // If next link present, fetch next chunk
        if (result.data?.nextLink && result.data?.value?.length) {
            accumulator = await this.fetchAllResources(
                adapterMethodSandbox,
                accumulator,
                token,
                url,
                params,
                result.data?.nextLink
            );
        }

        return accumulator;
    }

    async getSubscriptions() {
        const adapterMethodSandbox = new AdapterMethodSandbox(this.authService);
        return await adapterMethodSandbox.safelyFetchData(async (token) => {
            const url = 'https://management.azure.com/subscriptions';
            const subscriptions: Array<IAzureSubscription> = await this.fetchAllResources(
                adapterMethodSandbox,
                [],
                token,
                url,
                {
                    apiVersion:
                        AzureResourcesAPIVersions['Microsoft.Subscription']
                }
            );
            return new AzureSubscriptionData(subscriptions);
        }, 'azureManagement');
    }

    /** Given a resource id and user object id, it will return a list of all of the role assignments
     * of the user defined for that resource */
    async getRoleAssignments(resourceId: string, uniqueObjectId: string) {
        const adapterMethodSandbox = new AdapterMethodSandbox(this.authService);
        return await adapterMethodSandbox.safelyFetchData(async (token) => {
            const url = `https://management.azure.com${resourceId}/providers/Microsoft.Authorization/roleAssignments`;
            const roleAssignments: Array<IAzureRoleAssignment> = await this.fetchAllResources(
                adapterMethodSandbox,
                [],
                token,
                url,
                {
                    apiVersion:
                        AzureResourcesAPIVersions[
                            'Microsoft.Authorization/roleAssignments'
                        ],
                    $filter: `atScope() and assignedTo('${uniqueObjectId}')`
                }
            );
            return new AzureResourcesData(roleAssignments);
        }, 'azureManagement');
    }

    /** Checks if a user has a list of certain role defintions like Reader, Writer, Storage Owner, and etc.
     *  in their list of role assignments for a particular resource */
    async hasRoleDefinitions(
        resourceId: string,
        uniqueObjectId: string,
        accessRolesToCheck: AzureAccessPermissionRoleGroups
    ) {
        const userRoleAssignments = await this.getRoleAssignments(
            resourceId,
            uniqueObjectId
        );
        const resultRoleAssignments = userRoleAssignments?.result?.data;
        const assignedRoleIds: Array<AzureAccessPermissionRoles> = getRoleIdsFromRoleAssignments(
            resultRoleAssignments
        );
        const missingRoleIds: AzureAccessPermissionRoleGroups = getMissingRoleIdsFromRequired(
            assignedRoleIds,
            accessRolesToCheck
        );

        if (
            missingRoleIds.enforced.length ||
            missingRoleIds.interchangeables.some(
                (interchangeableGroup) => interchangeableGroup.length > 0
            )
        ) {
            return false;
        }
        return true;
    }

    /** Returns a subset of expected role definition ids which are not present
     * in user's current role assignments for a particular resource */
    async getMissingRoleDefinitions(
        resourceId: string,
        uniqueObjectId: string,
        requiredAccessRoles: AzureAccessPermissionRoleGroups
    ) {
        try {
            const userRoleAssignments = await this.getRoleAssignments(
                resourceId,
                uniqueObjectId
            );
            const resultRoleAssignments = userRoleAssignments?.result?.data;
            const assignedRoleIds = getRoleIdsFromRoleAssignments(
                resultRoleAssignments
            );
            if (assignedRoleIds.length) {
                return getMissingRoleIdsFromRequired(
                    assignedRoleIds,
                    requiredAccessRoles
                );
            } else {
                return requiredAccessRoles;
            }
        } catch (error) {
            return null;
        }
    }

    /** Returns list of all the storage accounts in the provided subscription */
    async getStorageAccountsInSubscription(subscriptionId: string) {
        const adapterMethodSandbox = new AdapterMethodSandbox(this.authService);
        return await adapterMethodSandbox.safelyFetchData(async (token) => {
            const url = `https://management.azure.com/subscriptions/${subscriptionId}/providers/${AzureResourceTypes.StorageAccount}`;
            const storageAccounts: Array<IAzureStorageAccount> = await this.fetchAllResources(
                adapterMethodSandbox,
                [],
                token,
                url,
                {
                    apiVersion:
                        AzureResourcesAPIVersions[
                            'Microsoft.Storage/storageAccounts'
                        ]
                }
            );
            return new AzureResourcesData(storageAccounts);
        }, 'azureManagement');
    }

    /** Returns list of all the storage containers in the provided storage account */
    async getContainersInStorageAccount(storageAccountId: string) {
        // TODO: add id and url of storage account in local storage
        const adapterMethodSandbox = new AdapterMethodSandbox(this.authService);
        return await adapterMethodSandbox.safelyFetchData(async (token) => {
            const url = `https://management.azure.com${storageAccountId}/blobServices/default/containers`;
            const containers: Array<IAzureStorageBlobContainer> = await this.fetchAllResources(
                adapterMethodSandbox,
                [],
                token,
                url,
                {
                    apiVersion:
                        AzureResourcesAPIVersions[
                            'Microsoft.Storage/storageAccounts/blobServices/containers'
                        ]
                }
            );
            return new AzureResourcesData(containers);
        }, 'azureManagement');
    }

    /** All other type of resources including Microsoft.DigitalTwins */
    async getOtherResourceTypesInSubscription(
        subscriptionId: string,
        resourceType: string,
        apiVersion: string,
        resourceProviderEndpoint?: string
    ) {
        const adapterMethodSandbox = new AdapterMethodSandbox(this.authService);
        return await adapterMethodSandbox.safelyFetchData(async (token) => {
            const url = `https://management.azure.com/subscriptions/${subscriptionId}/providers/${
                resourceProviderEndpoint || resourceType
            }`;
            const resources: Array<IAzureResource> = await this.fetchAllResources(
                adapterMethodSandbox,
                [],
                token,
                url,
                { apiVersion: apiVersion }
            );
            return new AzureResourcesData(resources);
        }, 'azureManagement');
    }

    /** Returns list of all the resources of the given type in all of user's subscriptions */
    async getResources({
        resourceType,
        searchParams,
        resourceProviderEndpoint,
        userData
    }: AdapterMethodParamsForGetAzureResources) {
        const adapterMethodSandbox = new AdapterMethodSandbox(this.authService);

        if (userData) {
            if (userData.tenantId) {
                this.tenantId = userData.tenantId;
            }
            if (userData.uniqueObjectId) {
                this.uniqueObjectId = userData.uniqueObjectId;
            }
        }

        return await adapterMethodSandbox.safelyFetchData(async () => {
            let resources: Array<IAzureResource> = [];
            try {
                const subscriptions = await this.getSubscriptions();
                const userSubscriptions: Array<IAzureSubscription> = subscriptions.getData();

                if (
                    resourceType === AzureResourceTypes.StorageBlobContainer &&
                    searchParams?.additionalParams &&
                    'storageAccountId' in searchParams?.additionalParams
                ) {
                    if (searchParams?.additionalParams?.storageAccountId) {
                        const resourcesResponse = await this.getContainersInStorageAccount(
                            searchParams.additionalParams.storageAccountId
                        );
                        resources = resourcesResponse.getData();
                    }
                } else {
                    const subscriptionIdsByTenantId = userSubscriptions
                        .filter((s) => s.tenantId === this.tenantId)
                        .map((s) => s.subscriptionId);

                    const resourcesBySubscriptionsResponse = await Promise.all(
                        subscriptionIdsByTenantId.map(
                            async (subscriptionId) => {
                                if (
                                    // CAUTION: If it is a storage blob container type resource, first we need to fetch the storage accounts in user's every subscriptions
                                    // and then fetch containers in each storage account, so this might take too long for all the requests to be
                                    // completed or even can cause the browser to crash. That is why we limit the number of resources returned
                                    // before making calls to check permissions in getResourcesByPermissions
                                    resourceType ===
                                    AzureResourceTypes.StorageBlobContainer
                                ) {
                                    const storageAccountsInSubscription = await this.getStorageAccountsInSubscription(
                                        subscriptionId
                                    );
                                    const storageAccounts = storageAccountsInSubscription.getData();

                                    return Promise.all(
                                        storageAccounts?.map((storageAccount) =>
                                            this.getContainersInStorageAccount(
                                                storageAccount.id
                                            )
                                        )
                                    ).catch((error) => {
                                        adapterMethodSandbox.pushError({
                                            type:
                                                ComponentErrorType.DataFetchFailed,
                                            isCatastrophic: false,
                                            rawError: error
                                        });
                                        logDebugConsole(
                                            'error',
                                            'Error(s) thrown fetching containers in storage account. {error}',
                                            error
                                        );
                                        return null;
                                    });
                                } else {
                                    const apiVersion =
                                        AzureResourcesAPIVersions[resourceType];
                                    return this.getOtherResourceTypesInSubscription(
                                        subscriptionId,
                                        resourceType,
                                        apiVersion,
                                        resourceProviderEndpoint
                                    );
                                }
                            }
                        )
                    ).catch((err) => {
                        adapterMethodSandbox.pushError({
                            type: ComponentErrorType.DataFetchFailed,
                            isCatastrophic: false,
                            rawError: err
                        });
                        return null;
                    });

                    //filter out nulls, i.e. errors
                    let successfulResourcesResponse;
                    if (
                        resourceType === AzureResourceTypes.StorageBlobContainer
                    ) {
                        successfulResourcesResponse = resourcesBySubscriptionsResponse.reduce(
                            (acc, resourcesInStorageAccounts) => {
                                return resourcesInStorageAccounts
                                    ? acc.concat(
                                          resourcesInStorageAccounts.filter(
                                              (response) => response !== null
                                          )
                                      )
                                    : acc;
                            },
                            []
                        );
                    } else {
                        successfulResourcesResponse = resourcesBySubscriptionsResponse.filter(
                            (result) => {
                                return result !== null;
                            }
                        );
                    }

                    successfulResourcesResponse.forEach((response) => {
                        const resourcesInSubscription = response.result?.data;
                        if (resourcesInSubscription?.length > 0) {
                            resources.push(...resourcesInSubscription);
                        }
                    });
                }

                resources.forEach((r) => {
                    const resourceSubscriptionId = r.id.split('/')[2];
                    const resourceSubscriptionName = userSubscriptions.find(
                        (s) => s.subscriptionId === resourceSubscriptionId
                    ).displayName;
                    r.subscriptionName = resourceSubscriptionName;
                });

                return new AzureResourcesData(resources);
            } catch (error) {
                adapterMethodSandbox.pushError({
                    type: ComponentErrorType.DataFetchFailed,
                    isCatastrophic: false,
                    rawError: error
                });
                logDebugConsole(
                    'error',
                    'Error(s) thrown fetching resources. {error}',
                    error
                );
                return null;
            }
        }, 'azureManagement');
    }

    /** Returns list of all the resources of the given type and access role ids in all of user's subscriptions */
    async getResourcesByPermissions(params: {
        getResourcesParams: AdapterMethodParamsForGetAzureResources;
        requiredAccessRoles: AzureAccessPermissionRoleGroups;
    }) {
        const adapterMethodSandbox = new AdapterMethodSandbox(this.authService);

        return await adapterMethodSandbox.safelyFetchData(async () => {
            try {
                logDebugConsole(
                    'debug',
                    `[START] Fetching ${params.getResourcesParams.resourceType} type resources`
                );
                const getResourcesResult = await this.getResources(
                    params.getResourcesParams
                );
                let resources: Array<IAzureResource> = getResourcesResult.getData();
                logDebugConsole(
                    'debug',
                    '[END] Number of all resources fetched (before filter and take): ',
                    resources.length
                );

                const resourcesWithPermissions: Array<IAzureResource> = [];
                if (resources?.length) {
                    // apply searchParams to the list of resources returned
                    logDebugConsole(
                        'debug',
                        '[START] Applying search params (filter and take)'
                    );
                    // start with filter string to test the passed filter string against all possible display fields/properties in resource
                    if (params.getResourcesParams.searchParams?.filter) {
                        resources = resources.filter((resource) => {
                            return Object.keys(AzureResourceDisplayFields)
                                .filter((f) => isNaN(Number(f)))
                                .some((displayField) =>
                                    resource[displayField]?.includes(
                                        params.getResourcesParams.searchParams
                                            ?.filter
                                    )
                                );
                        });
                    }

                    // if necessary, take the first n number of resources to make sure the browser won't crash with making thousands of requests
                    // to check permissions for each resource, however, this might cause 0 result after checking the permissions for the first taken n resources
                    // it is hard to limit the number of requests being made and make sure to capture the resources that we might have required access permissions
                    // resources = resources.slice(
                    //     0,
                    //     params.getResourcesParams.searchParams?.take ||
                    //         MAX_RESOURCE_TAKE_LIMIT
                    // );

                    logDebugConsole(
                        'debug',
                        '[END] Number of resources after search params (filter and take) applied and before checking assigned permissions for those resources: ',
                        resources.length
                    );

                    logDebugConsole(
                        'debug',
                        `[START] Checking role assignments for those resources`
                    );
                    const hasRoleDefinitionsResults = await Promise.all(
                        resources.map((resource) =>
                            this.hasRoleDefinitions(
                                resource.id,
                                this.uniqueObjectId,
                                params.requiredAccessRoles
                            )
                        )
                    );

                    hasRoleDefinitionsResults.forEach((haveAccess, idx) => {
                        if (haveAccess) {
                            const resourceWithPermission = resources[idx];
                            resourcesWithPermissions.push(
                                resourceWithPermission
                            );
                        }
                    });

                    logDebugConsole(
                        'debug',
                        `[END] Number of resources for which the user has the required access permissions: `,
                        resourcesWithPermissions.length
                    );
                }

                return new AzureResourcesData(resourcesWithPermissions);
            } catch (error) {
                adapterMethodSandbox.pushError({
                    type: ComponentErrorType.DataFetchFailed,
                    isCatastrophic: false,
                    rawError: error
                });
                logDebugConsole(
                    'error',
                    'Error(s) thrown fetching resources. {error}',
                    error
                );
                return null;
            }
        }, 'azureManagement');
    }

    /** Given a role id, resource id (scope) and object id it assigns the given role to that resource for that user */
    async assignRole(
        roleDefinitionId: AzureAccessPermissionRoles,
        resourceId: string,
        uniqueObjectId?: string
    ) {
        const adapterMethodSandbox = new AdapterMethodSandbox(this.authService);
        return await adapterMethodSandbox.safelyFetchData(async (token) => {
            const newRoleAssignmentId = createGUID(true);
            const newRoleAssignmentResult = await axios({
                method: 'put',
                url: `https://management.azure.com${resourceId}/providers/Microsoft.Authorization/roleAssignments/${newRoleAssignmentId}`,
                headers: {
                    'Content-Type': 'application/json',
                    authorization: 'Bearer ' + token
                },
                params: {
                    'api-version': '2018-01-01-preview'
                },
                data: {
                    properties: {
                        roleDefinitionId: `${resourceId}/providers/Microsoft.Authorization/roleDefinitions/${roleDefinitionId}`,
                        principalId: uniqueObjectId
                    }
                }
            }).catch((err) => {
                adapterMethodSandbox.pushError({
                    type: ComponentErrorType.DataFetchFailed,
                    isCatastrophic: false,
                    rawError: err
                });
                return null;
            });

            let newRoleAssignment: IAzureRoleAssignment;
            if (newRoleAssignmentResult.data) {
                newRoleAssignment = newRoleAssignmentResult.data;
            }
            return new AzureResourcesData([newRoleAssignment]);
        }, 'azureManagement');
    }

    /** either pass id or hostName as adtInstanceIdentifier */
    async getTimeSeriesConnectionInformation(
        adtInstanceIdentifier: ADTResourceIdentifier
    ) {
        const adapterMethodSandbox = new AdapterMethodSandbox(this.authService);

        return await adapterMethodSandbox.safelyFetchData(async (token) => {
            let adtInstance: IAzureResource;
            if (adtInstanceIdentifier['hostName']) {
                const digitalTwinInstances = await this.getResourcesByPermissions(
                    {
                        getResourcesParams: {
                            resourceType: AzureResourceTypes.DigitalTwinInstance
                        },
                        requiredAccessRoles: RequiredAccessRoleGroupForADTInstance
                    }
                );
                const result = digitalTwinInstances.result.data;
                adtInstance = result.find(
                    (d) =>
                        d.properties.hostName ===
                        (adtInstanceIdentifier as ADTResourceIdentifierWithHostname)
                            .hostName
                );
            } else if (adtInstanceIdentifier['id']) {
                const digitalTwinInstance = await this.getResourceById(
                    (adtInstanceIdentifier as ADTResourceIdentifierWithId).id
                );
                adtInstance = digitalTwinInstance.result.data;
            }

            try {
                const url = `https://management.azure.com${adtInstance.id}/timeSeriesDatabaseConnections`;
                const timeSeriesDatabaseConnections: Array<IAzureTimeSeriesDatabaseConnection> = await this.fetchAllResources(
                    adapterMethodSandbox,
                    [],
                    token,
                    url,
                    {
                        apiVersion:
                            AzureResourcesAPIVersions[
                                'Microsoft.DigitalTwins/digitalTwinsInstances/timeSeriesDatabaseConnections'
                            ]
                    }
                );

                const connectionData = timeSeriesDatabaseConnections[0]; // TODO: for now get the first connection information
                const clusterUrl = connectionData.properties.adxEndpointUri;
                const databaseName = connectionData.properties.adxDatabaseName;
                const tableName =
                    connectionData.properties.adxTableName ||
                    `adt_dh_${databaseName.replace('-', '_')}_${
                        adtInstance.location
                    }`; // there is a default syntax used to construct the table name if not provided
                return new ADTInstanceTimeSeriesConnectionData({
                    kustoClusterUrl: clusterUrl,
                    kustoDatabaseName: databaseName,
                    kustoTableName: tableName
                });
            } catch (error) {
                adapterMethodSandbox.pushError({
                    isCatastrophic: false,
                    rawError: error
                });
                return new ADTInstanceTimeSeriesConnectionData(null);
            }
        }, 'azureManagement');
    }

    async getResourceById(resourceId: string) {
        const adapterMethodSandbox = new AdapterMethodSandbox(this.authService);
        return await adapterMethodSandbox.safelyFetchData(async (token) => {
            const result = await axios({
                method: 'get',
                url: `https://management.azure.com${resourceId}`,
                headers: {
                    'Content-Type': 'application/json',
                    authorization: 'Bearer ' + token
                },
                params: { 'api-version': '2022-05-31' }
            }).catch((err) => {
                adapterMethodSandbox.pushError({
                    type: ComponentErrorType.DataFetchFailed,
                    isCatastrophic: false,
                    rawError: err
                });
                return null;
            });
            return new AzureResourceData(result?.data);
        }, 'azureManagement');
    }
}
