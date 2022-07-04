import axios from 'axios';
import { AdapterMethodSandbox } from '../Models/Classes';
import {
    AzureResourcesData,
    AzureSubscriptionData
} from '../Models/Classes/AdapterDataClasses/AzureManagementData';
import {
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
    IAzureSubscription
} from '../Models/Constants';
import { createGUID } from '../Models/Services/Utils';

const MAX_RESOURCE_TAKE_LIMIT = 1000;
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
        nextLink?: string
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
                { apiVersion: '2020-01-01' }
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
                    apiVersion: '2021-04-01-preview',
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
        accessRolesToCheck: {
            enforcedRoleIds: Array<AzureAccessPermissionRoles>; // means required (and)
            interchangeableRoleIds: Array<AzureAccessPermissionRoles>; // means any of them would be enough (either/or)
        }
    ) {
        const userRoleAssignments = await this.getRoleAssignments(
            resourceId,
            uniqueObjectId
        );
        const resultRoleAssignments = userRoleAssignments?.result?.data;
        const assignedRoleIds = resultRoleAssignments?.map((roleAssignment) => {
            return roleAssignment.properties?.roleDefinitionId.split('/').pop();
        });
        if (assignedRoleIds) {
            return (
                assignedRoleIds.some((assignedRoleId) =>
                    accessRolesToCheck.interchangeableRoleIds.includes(
                        assignedRoleId as AzureAccessPermissionRoles
                    )
                ) &&
                assignedRoleIds.filter((assignedRoleId) =>
                    accessRolesToCheck.enforcedRoleIds.includes(
                        assignedRoleId as AzureAccessPermissionRoles
                    )
                ).length === accessRolesToCheck.enforcedRoleIds.length
            );
        } else {
            return false;
        }
    }

    /** Returns a subset of expected role definition ids which are not present
     * in user's current role assignments for a particular resource */
    async getMissingRoleDefinitions(
        resourceId: string,
        uniqueObjectId: string,
        requiredAccessRoles: {
            enforcedRoleIds: Array<AzureAccessPermissionRoles>;
            interchangeableRoleIds: Array<AzureAccessPermissionRoles>;
        }
    ) {
        try {
            const userRoleAssignments = await this.getRoleAssignments(
                resourceId,
                uniqueObjectId
            );
            const resultRoleAssignments = userRoleAssignments?.result?.data;
            const assignedRoleIds = resultRoleAssignments?.map(
                (roleAssignment) => {
                    return roleAssignment.properties?.roleDefinitionId
                        .split('/')
                        .pop();
                }
            );
            if (assignedRoleIds) {
                let missingRoleDefinitionIds: AzureAccessPermissionRoles[] = [];
                requiredAccessRoles.enforcedRoleIds.forEach(
                    (enforcedRoleId) => {
                        if (!assignedRoleIds.includes(enforcedRoleId)) {
                            missingRoleDefinitionIds.push(enforcedRoleId);
                        }
                    }
                );
                if (
                    !assignedRoleIds.some(
                        (assignedRoleId: AzureAccessPermissionRoles) =>
                            requiredAccessRoles.interchangeableRoleIds.includes(
                                assignedRoleId
                            )
                    )
                ) {
                    missingRoleDefinitionIds = missingRoleDefinitionIds.concat(
                        requiredAccessRoles.interchangeableRoleIds
                    );
                }
                return missingRoleDefinitionIds;
            } else {
                return [
                    ...requiredAccessRoles.enforcedRoleIds,
                    ...requiredAccessRoles.interchangeableRoleIds
                ];
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
                { apiVersion: '2021-09-01' }
            );
            return new AzureResourcesData(storageAccounts);
        }, 'azureManagement');
    }

    /** Returns list of all the storage containers in the provided storage account */
    async getContainersInStorageAccount(storageAccountId: string) {
        const adapterMethodSandbox = new AdapterMethodSandbox(this.authService);
        return await adapterMethodSandbox.safelyFetchData(async (token) => {
            const url = `https://management.azure.com${storageAccountId}/blobServices/default/containers`;
            const containers: Array<IAzureStorageBlobContainer> = await this.fetchAllResources(
                adapterMethodSandbox,
                [],
                token,
                url,
                { apiVersion: '2021-09-01' }
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
    async getResources(
        resourceType: AzureResourceTypes,
        searchParams?: {
            take?: number;
            filter?: string;
            additionalParams?: {
                storageAccountId?: string;
                [key: string]: any;
            };
        },
        resourceProviderEndpoint?: string,
        userData?: {
            tenantId: string; // needed for accessing subscriptions which the logged in user's is in to pull the resources from
            uniqueObjectId: string; // needed for accessing subscriptions which the logged in user's is in to pull the resources from
        }
    ) {
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
                    const subscriptions = await this.getSubscriptions();
                    const userSubscriptions: Array<IAzureSubscription> = subscriptions.getData();

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
                                    ).catch((err) => {
                                        adapterMethodSandbox.pushError({
                                            type:
                                                ComponentErrorType.DataFetchFailed,
                                            isCatastrophic: false,
                                            rawError: err
                                        });
                                        console.log(err.message);
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

                return new AzureResourcesData(resources);
            } catch (error) {
                adapterMethodSandbox.pushError({
                    type: ComponentErrorType.DataFetchFailed,
                    isCatastrophic: false,
                    rawError: error
                });
                console.log(error.message);
                return null;
            }
        }, 'azureManagement');
    }

    /** Returns list of all the resources of the given type and access role ids in all of user's subscriptions */
    async getResourcesByPermissions(
        resourceType: AzureResourceTypes,
        requiredAccessRoles: {
            enforcedRoleIds: Array<AzureAccessPermissionRoles>; // roles that have to exist
            interchangeableRoleIds: Array<AzureAccessPermissionRoles>; // roles that one or the other has to exist
        },
        searchParams?: {
            take?: number;
            filter?: string;
            additionalParams?: {
                storageAccountId?: string;
                [key: string]: any;
            };
        },
        resourceProviderEndpoint?: string,
        userData?: {
            tenantId: string; // needed for accessing subscriptions which the logged in user's is in to pull the resources from
            uniqueObjectId: string; // needed for accessing subscriptions which the logged in user's is in to pull the resources from
        }
    ) {
        const adapterMethodSandbox = new AdapterMethodSandbox(this.authService);

        return await adapterMethodSandbox.safelyFetchData(async () => {
            try {
                const getResourcesResult = await this.getResources(
                    resourceType,
                    searchParams,
                    resourceProviderEndpoint,
                    userData
                );
                let resources: Array<IAzureResource> = getResourcesResult.getData();
                console.log(
                    'Number of all resources before take: ' + resources.length
                );

                const resourcesWithPermissions: Array<IAzureResource> = [];
                if (resources?.length) {
                    // apply searchParams to the list of resources returned
                    if (searchParams?.filter) {
                        resources = resources.filter((resource) =>
                            Object.keys(AzureResourceDisplayFields).some(
                                (displayField) =>
                                    !!resource[displayField]?.includes(
                                        displayField
                                    )
                            )
                        );
                    }
                    resources = resources.slice(
                        0,
                        searchParams?.take || MAX_RESOURCE_TAKE_LIMIT
                    ); // take the first n number of resources to make sure the browser won't crash with making thousands of requests
                    // to check permissions for each resource, however, this might cause 0 result after checking the permissions for the first taken n resources
                    // it is hard to limit the number of requests being made and make sure to capture the resources that we might have required access permissions

                    const hasRoleDefinitionsResults = await Promise.all(
                        resources.map((resource) =>
                            this.hasRoleDefinitions(
                                resource.id,
                                this.uniqueObjectId,
                                {
                                    enforcedRoleIds:
                                        requiredAccessRoles.enforcedRoleIds,
                                    interchangeableRoleIds:
                                        requiredAccessRoles.interchangeableRoleIds
                                }
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
                }

                console.log(
                    'Number of resources with permission: ' +
                        resourcesWithPermissions.length
                );

                return new AzureResourcesData(resourcesWithPermissions);
            } catch (error) {
                adapterMethodSandbox.pushError({
                    type: ComponentErrorType.DataFetchFailed,
                    isCatastrophic: false,
                    rawError: error
                });
                console.log(error.message);
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
}
