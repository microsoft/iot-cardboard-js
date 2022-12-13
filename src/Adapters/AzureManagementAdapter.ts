import axios from 'axios';
import { AdapterMethodSandbox } from '../Models/Classes';
import ADTInstanceTimeSeriesConnectionData from '../Models/Classes/AdapterDataClasses/ADTInstanceTimeSeriesConnectionData';
import {
    AzureResourceData,
    AzureResourcesData
} from '../Models/Classes/AdapterDataClasses/AzureManagementData';
import AdapterEntityCache from '../Models/Classes/AdapterEntityCache';
import {
    AdapterMethodParamsForGetAzureResources,
    timeSeriesConnectionRefreshMaxAge,
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
    IAzureTimeSeriesDatabaseConnection,
    AzureResourceFetchParams,
    AzureResourceFetchParamsForResourceGraph,
    AzureResourceFetchParamsForResourceProvider
} from '../Models/Constants';
import {
    createGUID,
    getDebugLogger,
    getMissingRoleIdsFromRequired,
    getRoleIdsFromRoleAssignments,
    getUrlFromString
} from '../Models/Services/Utils';

const debugLogging = false;
const logDebugConsole = getDebugLogger('AzureManagementAdapter', debugLogging);
export default class AzureManagementAdapter implements IAzureManagementAdapter {
    public authService: IAuthService;
    public tenantId: string;
    public uniqueObjectId: string;
    protected timeSeriesConnectionCache: AdapterEntityCache<ADTInstanceTimeSeriesConnectionData>;

    constructor(
        authService: IAuthService,
        tenantId?: string,
        uniqueObjectId?: string
    ) {
        this.authService = authService;
        this.authService.login();
        this.tenantId = tenantId;
        this.uniqueObjectId = uniqueObjectId;
        this.timeSeriesConnectionCache = new AdapterEntityCache<ADTInstanceTimeSeriesConnectionData>(
            timeSeriesConnectionRefreshMaxAge
        );
    }

    /** Given a url and params, continuously fetch resources if nextLink exist in the request response and append it to the given accumulator array */
    async fetchAllResources<T>(
        adapterMethodSandbox: AdapterMethodSandbox,
        token: string, // TODO: if fetch takes so long, token might expire,
        params: AzureResourceFetchParams,
        accumulator: Array<T> = []
    ) {
        const isResourceGraphCall = (
            params:
                | AzureResourceFetchParamsForResourceGraph
                | AzureResourceFetchParamsForResourceProvider
        ): params is AzureResourceFetchParamsForResourceGraph =>
            (params as AzureResourceFetchParamsForResourceGraph).type !==
            undefined;

        const result = await axios({
            method: !isResourceGraphCall(params) ? 'get' : 'post',
            url: !isResourceGraphCall(params)
                ? params.nextLink || params.url
                : `https://management.azure.com/providers/${AzureResourceTypes.ResourceGraphs}`,
            headers: {
                'Content-Type': 'application/json',
                authorization: 'Bearer ' + token
            },
            params: {
                ...(!isResourceGraphCall(params)
                    ? !params.nextLink && {
                          'api-version': params?.apiVersion || '2021-09-01'
                      }
                    : {
                          'api-version':
                              AzureResourcesAPIVersions[
                                  'Microsoft.ResourceGraph/resources'
                              ]
                      }),
                ...(!isResourceGraphCall(params)
                    ? params?.filter && {
                          $filter: params.filter
                      }
                    : {})
            },
            data: isResourceGraphCall(params)
                ? {
                      query: `Resources | where type =~ '${params.type}'${
                          params.query ? ' | where ' + params.query : ''
                      } | join kind=leftouter (ResourceContainers | where type=='microsoft.resources/subscriptions' | project subscriptionName=name, subscriptionId) on subscriptionId | project id, name, location, type, properties, tenantId, subscriptionId, subscriptionName, resourceGroup${
                          params.limit ? ' | limit ' + params.limit : ''
                      } | order by name asc`,
                      options: {
                          $skipToken: params.skipToken
                      }
                  }
                : undefined
        }).catch((err) => {
            adapterMethodSandbox.pushError({
                type: ComponentErrorType.DataFetchFailed,
                isCatastrophic: false,
                rawError: err
            });
            return null;
        });

        if (isResourceGraphCall(params)) {
            if (result?.data?.data) {
                accumulator = accumulator.concat(result.data.data);
            }

            // If next link present, fetch next chunk
            if (result?.data?.$skipToken && result?.data?.data?.length) {
                accumulator = await this.fetchAllResources(
                    adapterMethodSandbox,
                    token,
                    { ...params, skipToken: result.data?.$skipToken },
                    accumulator
                );
            }
        } else {
            if (result?.data?.value) {
                accumulator = accumulator.concat(result.data.value);
            }

            // If next link present, fetch next chunk
            if (result.data?.nextLink && result.data?.value?.length) {
                accumulator = await this.fetchAllResources(
                    adapterMethodSandbox,
                    token,
                    { ...params, nextLink: result.data?.nextLink },
                    accumulator
                );
            }
        }

        return accumulator;
    }

    /** Given a resource id and user object id, it will return a list of all of the role assignments
     * of the user defined for that resource */
    async getRoleAssignments(resourceId: string, uniqueObjectId: string) {
        const adapterMethodSandbox = new AdapterMethodSandbox(this.authService);
        return await adapterMethodSandbox.safelyFetchData(async (token) => {
            const url = `https://management.azure.com${resourceId}/providers/Microsoft.Authorization/roleAssignments`;
            const roleAssignments: Array<IAzureRoleAssignment> = await this.fetchAllResources(
                adapterMethodSandbox,
                token,
                {
                    url,
                    apiVersion:
                        AzureResourcesAPIVersions[
                            'Microsoft.Authorization/roleAssignments'
                        ],
                    filter: `atScope() and assignedTo('${uniqueObjectId}')`
                }
            );
            return new AzureResourcesData(roleAssignments);
        }, 'azureManagement');
    }

    /** Checks if a user has a list of certain role defintions like Reader, Writer, Storage Owner, and etc.
     *  in their list of role assignments for a particular resource */
    async hasRoleDefinitions(
        resourceId: string,
        accessRolesToCheck: AzureAccessPermissionRoleGroups,
        uniqueObjectId: string = this.uniqueObjectId
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

    /** Returns list of all the storage containers in the provided storage account */
    async getContainersByStorageAccountId(storageAccountId: string) {
        const adapterMethodSandbox = new AdapterMethodSandbox(this.authService);
        return await adapterMethodSandbox.safelyFetchData(async (token) => {
            const url = `https://management.azure.com${storageAccountId}/blobServices/default/containers`;
            const containers: Array<IAzureStorageBlobContainer> = await this.fetchAllResources(
                adapterMethodSandbox,
                token,
                {
                    url,
                    apiVersion:
                        AzureResourcesAPIVersions[
                            'Microsoft.Storage/storageAccounts/blobServices/containers'
                        ]
                }
            );
            return new AzureResourcesData(containers);
        }, 'azureManagement');
    }

    /** Returns the Azure resource provided by its url string with the help of Resource Graph api calls */
    async getResourceByUrl(urlString: string, type: AzureResourceTypes) {
        const adapterMethodSandbox = new AdapterMethodSandbox(this.authService);

        return await adapterMethodSandbox.safelyFetchData(async (token) => {
            let resource: IAzureResource;
            let query = '';
            try {
                const urlObj = getUrlFromString(urlString);
                switch (type.toLowerCase()) {
                    case AzureResourceTypes.DigitalTwinInstance.toLowerCase(): {
                        query = `properties.hostName == '${urlObj.hostname}'`;
                        break;
                    }
                    case AzureResourceTypes.StorageAccount.toLowerCase():
                        query = `properties.primaryEndpoints.blob == '${urlObj.href}'`;
                        break;
                    case AzureResourceTypes.StorageBlobContainer.toLowerCase(): {
                        /** if it is Storage Container type resource:
                         * (1) fetch the parent storage account using Resource Graph api,
                         * (2) fetch containers using Storage Service provider endpoint
                         * (3) find the container by its name among those containers
                         *  */
                        query = `properties.primaryEndpoints.blob == '${urlObj.origin}/'`;
                        const storageAccounts: Array<IAzureResource> = await this.fetchAllResources(
                            adapterMethodSandbox,
                            token,
                            {
                                type: AzureResourceTypes.StorageAccount,
                                query: query
                            }
                        );
                        const resourcesResponse = await this.getContainersByStorageAccountId(
                            storageAccounts[0].id
                        );
                        const containers: Array<IAzureResource> = resourcesResponse.getData();
                        containers.forEach(
                            (r) =>
                                (r.subscriptionName =
                                    storageAccounts[0].subscriptionName) // add the subscription name from storage account since /containers service call does not include it in response
                        );
                        const container = containers.find(
                            (c) => '/' + c.name === urlObj.pathname
                        );
                        resource = container;
                        break;
                    }
                    default:
                        break;
                }

                if (
                    type.toLowerCase() !==
                        AzureResourceTypes.StorageBlobContainer.toLowerCase() &&
                    query
                ) {
                    // if it other type like Digital Twin Instance or Storage Account type resource, use the Graph api with query parameter
                    const length1Resources: Array<IAzureResource> = await this.fetchAllResources(
                        adapterMethodSandbox,
                        token,
                        {
                            type,
                            query
                        }
                    );
                    resource = length1Resources[0];
                }
            } catch (error) {
                console.error(
                    'getResourceByUrl: Failed to fetch resource by url: ',
                    error
                );
                adapterMethodSandbox.pushError({
                    type: ComponentErrorType.DataFetchFailed,
                    isCatastrophic: true,
                    rawError: error
                });
            }

            return new AzureResourceData(resource);
        }, 'azureManagement');
    }

    /** Returns list of all the resources of the given type and access role ids */
    async getResources(params: AdapterMethodParamsForGetAzureResources) {
        const adapterMethodSandbox = new AdapterMethodSandbox(this.authService);

        return await adapterMethodSandbox.safelyFetchData(async (token) => {
            let resources: Array<IAzureResource> = [];
            try {
                logDebugConsole(
                    'debug',
                    `[START] Fetching ${params.resourceType} type resources`
                );

                if (
                    params.resourceType ===
                    AzureResourceTypes.StorageBlobContainer
                ) {
                    if (
                        params.searchParams?.additionalParams
                            ?.storageAccountId ||
                        params.searchParams?.additionalParams
                            ?.storageAccountBlobUrl
                    ) {
                        const query = params.searchParams?.additionalParams
                            ?.storageAccountId
                            ? `id == '${params.searchParams.additionalParams.storageAccountId}'`
                            : `properties.primaryEndpoints.blob == '${params.searchParams.additionalParams.storageAccountBlobUrl}'`;
                        const storageAccounts: Array<IAzureStorageAccount> = await this.fetchAllResources(
                            adapterMethodSandbox,
                            token,
                            {
                                type: AzureResourceTypes.StorageAccount,
                                query
                            }
                        );

                        const resourcesResponse = await this.getContainersByStorageAccountId(
                            storageAccounts[0].id
                        );
                        resources = resourcesResponse.getData();
                        resources.forEach(
                            (r) =>
                                (r.subscriptionName =
                                    storageAccounts[0].subscriptionName) // add the subscription name from storage account since /containers service call does not include it in response
                        );
                    } else if (
                        !params.searchParams?.isAdditionalParamsRequired
                    ) {
                        const storageAccounts: Array<IAzureStorageAccount> = await this.fetchAllResources(
                            adapterMethodSandbox,
                            token,
                            {
                                type: AzureResourceTypes.StorageAccount,
                                limit: params.searchParams?.take
                            }
                        );

                        const containersInAllStorageAccounts = await Promise.all(
                            storageAccounts?.map((storageAccount) =>
                                this.getContainersByStorageAccountId(
                                    storageAccount.id
                                )
                            )
                        ).catch((error) => {
                            adapterMethodSandbox.pushError({
                                type: ComponentErrorType.DataFetchFailed,
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

                        containersInAllStorageAccounts.forEach(
                            (response, idx) => {
                                const containers = response?.result?.data;
                                if (containers?.length > 0) {
                                    containers.forEach(
                                        (c) =>
                                            (c.subscriptionName =
                                                storageAccounts[
                                                    idx
                                                ].subscriptionName) // add the subscription name from storage account since /containers service call does not include it in response
                                    );
                                    resources.push(...containers);
                                }
                            }
                        );
                    }
                } else {
                    resources = await this.fetchAllResources(
                        adapterMethodSandbox,
                        token,
                        {
                            type: params.resourceType,
                            limit: params.searchParams?.take
                        }
                    );
                }

                // use filter string against all possible display fields/properties in resource if exist in searchParams
                if (params.searchParams?.filter) {
                    resources = resources.filter((resource) => {
                        return Object.keys(AzureResourceDisplayFields)
                            .filter((f) => isNaN(Number(f)))
                            .some((displayField) =>
                                resource[displayField]?.includes(
                                    params.searchParams?.filter
                                )
                            );
                    });
                }

                // use take filter to get the top nth resources
                if (params.searchParams?.take) {
                    resources = resources.slice(0, params.searchParams?.take);
                }
                logDebugConsole(
                    'debug',
                    '[END] Number of all resources fetched: ',
                    resources.length
                );

                return new AzureResourcesData(resources);
            } catch (error) {
                adapterMethodSandbox.pushError({
                    type: ComponentErrorType.DataFetchFailed,
                    isCatastrophic: false,
                    rawError: error
                });
                logDebugConsole(
                    'error',
                    'Error(s) thrown fetching resources: ',
                    error
                );
                return null;
            }
        }, 'azureManagement');
    }

    /** Returns list of all the resources of the given type and access role ids */
    async getResourcesByPermissions(params: {
        getResourcesParams: AdapterMethodParamsForGetAzureResources;
        requiredAccessRoles: AzureAccessPermissionRoleGroups;
    }) {
        const adapterMethodSandbox = new AdapterMethodSandbox(this.authService);

        return await adapterMethodSandbox.safelyFetchData(async () => {
            try {
                const resourcesResponse = await this.getResources(
                    params.getResourcesParams
                );
                const resources = resourcesResponse.getData();

                let resourcesWithPermissions: Array<IAzureResource> = [];
                if (
                    params.requiredAccessRoles.enforced.length ||
                    params.requiredAccessRoles.interchangeables.length
                ) {
                    // if there are role permissions to check against, start to role assignment check flow
                    logDebugConsole(
                        'debug',
                        `[START] Checking role assignments for those resources`
                    );
                    const hasRoleDefinitionsResults = await Promise.all(
                        resources.map((resource) =>
                            this.hasRoleDefinitions(
                                resource.id,
                                params.requiredAccessRoles,
                                params.getResourcesParams.userData
                                    ?.uniqueObjectId
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
                } else {
                    resourcesWithPermissions = resources;
                }

                logDebugConsole(
                    'debug',
                    `[END] Number of resources for which the user has the required access permissions: `,
                    resourcesWithPermissions.length
                );

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
        adtUrl: string,
        useCache = false,
        forceRefresh = false
    ) {
        const adapterMethodSandbox = new AdapterMethodSandbox(this.authService);

        const getDataMethod = () =>
            adapterMethodSandbox.safelyFetchData(async (token) => {
                logDebugConsole(
                    'debug',
                    '[START] Fetching ADT instance resource by host url'
                );
                const adtInstanceResult = await this.getResourceByUrl(
                    adtUrl,
                    AzureResourceTypes.DigitalTwinInstance
                );

                const adtInstance: IAzureResource = adtInstanceResult.getData();
                logDebugConsole(
                    'debug',
                    '[END] Fetching ADT instance resource by hostName. {adtInstance}',
                    adtInstance
                );

                try {
                    logDebugConsole(
                        'debug',
                        '[START] Fetching ADX connection information'
                    );
                    const url = `https://management.azure.com${adtInstance.id}/timeSeriesDatabaseConnections`;
                    const timeSeriesDatabaseConnections: Array<IAzureTimeSeriesDatabaseConnection> = await this.fetchAllResources(
                        adapterMethodSandbox,
                        token,
                        {
                            url,
                            apiVersion:
                                AzureResourcesAPIVersions[
                                    'Microsoft.DigitalTwins/digitalTwinsInstances/timeSeriesDatabaseConnections'
                                ]
                        }
                    );
                    logDebugConsole(
                        'debug',
                        '[END] Fetching ADX connection information {timeSeriesDatabaseConnections}',
                        timeSeriesDatabaseConnections
                    );

                    const connectionData = timeSeriesDatabaseConnections[0]; // TODO: for now get the first connection information
                    const clusterUrl = connectionData.properties.adxEndpointUri;
                    const databaseName =
                        connectionData.properties.adxDatabaseName;
                    const tableName =
                        connectionData.properties.adxTableName ||
                        `adt_dh_${databaseName.replace(/-/g, '_')}_${
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

        if (useCache) {
            return this.timeSeriesConnectionCache.getEntity(
                `${adtUrl}-adt_adx_connection_information`,
                getDataMethod,
                forceRefresh
            );
        } else {
            return getDataMethod();
        }
    }
}
