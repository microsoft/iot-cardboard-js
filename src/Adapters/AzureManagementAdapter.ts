import axios from 'axios';
import { AdapterMethodSandbox } from '../Models/Classes';
import {
    AzureResourcesData,
    AzureResourceGroupsData
} from '../Models/Classes/AdapterDataClasses/AzureManagementData';
import {
    AzureRoleAssignmentsData,
    AzureSubscriptionData,
    AzureUserAssignmentsData
} from '../Models/Classes/AdapterDataClasses/AzureManagementData';
import {
    AzureAccessPermissionRoles,
    AzureResourceTypes,
    ComponentErrorType,
    IAuthService,
    IAzureManagementAdapter,
    IAzureResource,
    IAzureResourceGroup,
    IAzureRoleAssignment,
    IAzureUserRoleAssignments,
    IAzureUserSubscriptions
} from '../Models/Constants';
import { createGUID } from '../Models/Services/Utils';

export default class AzureManagementAdapter implements IAzureManagementAdapter {
    public authService: IAuthService;
    public tenantId: string;
    public uniqueObjectId: string;
    public resourceUrlHost: string;
    constructor(
        authService: IAuthService,
        resourceUrlHost?: string,
        tenantId?: string,
        uniqueObjectId?: string
    ) {
        this.resourceUrlHost = resourceUrlHost;
        this.authService = authService;
        this.authService.login();
        this.tenantId = tenantId;
        this.uniqueObjectId = uniqueObjectId;
    }

    async getSubscriptions() {
        const adapterMethodSandbox = new AdapterMethodSandbox(this.authService);
        return await adapterMethodSandbox.safelyFetchData(async (token) => {
            let subscriptions: IAzureUserSubscriptions;
            const UserSubscriptions = await axios({
                method: 'get',
                url: `https://management.azure.com/subscriptions`,
                headers: {
                    'Content-Type': 'application/json',
                    authorization: 'Bearer ' + token
                },
                params: {
                    'api-version': '2020-01-01'
                }
            }).catch((err) => {
                adapterMethodSandbox.pushError({
                    type: ComponentErrorType.DataFetchFailed,
                    isCatastrophic: false,
                    rawError: err
                });
                return null;
            });

            if (UserSubscriptions.data) {
                subscriptions = UserSubscriptions.data;
            }
            return new AzureSubscriptionData(subscriptions);
        }, 'azureManagement');
    }

    /** Given a resource id and user object id, it will return a list of all of the role assignments
     * of the user defined for that resource */
    async getRoleAssignments(resourceId: string, uniqueObjectId: string) {
        const adapterMethodSandbox = new AdapterMethodSandbox(this.authService);
        return await adapterMethodSandbox.safelyFetchData(async (token) => {
            let roleAssignments: IAzureUserRoleAssignments; //an array of role assignments
            const userRoleAssignments = await axios({
                method: 'get',
                url: `https://management.azure.com${resourceId}/providers/Microsoft.Authorization/roleAssignments`,
                headers: {
                    'Content-Type': 'application/json',
                    authorization: 'Bearer ' + token
                },
                params: {
                    'api-version': '2021-04-01-preview',
                    $filter: `atScope() and assignedTo('${uniqueObjectId}')`
                }
            }).catch((err) => {
                adapterMethodSandbox.pushError({
                    type: ComponentErrorType.DataFetchFailed,
                    isCatastrophic: false,
                    rawError: err
                });
                return null;
            });

            if (userRoleAssignments.data) {
                //if there are any user role assignments
                roleAssignments = userRoleAssignments.data;
            }
            return new AzureUserAssignmentsData(roleAssignments);
        }, 'azureManagement');
    }

    /** Checks if a user has a list of certain role defintions like Reader, Writer, Storage Owner, and etc.
     *  in their list of role assignments for a particular resource */
    async hasRoleDefinitions(
        resourceId: string,
        uniqueObjectId: string,
        enforcedRoleIds: Array<AzureAccessPermissionRoles>, // means required (and)
        alternatedRoleIds: Array<AzureAccessPermissionRoles> // means any of them would be enough (either/or)
    ) {
        const userRoleAssignments = await this.getRoleAssignments(
            resourceId,
            uniqueObjectId
        );
        const resultRoleAssignments = userRoleAssignments.result?.data.value;
        const assignedRoleIds = resultRoleAssignments?.map((roleAssignment) => {
            return roleAssignment.properties?.roleDefinitionId.split('/').pop();
        });
        if (assignedRoleIds) {
            return (
                assignedRoleIds.some((assignedRoleId) =>
                    alternatedRoleIds.includes(
                        assignedRoleId as AzureAccessPermissionRoles
                    )
                ) &&
                assignedRoleIds.filter((assignedRoleId) =>
                    enforcedRoleIds.includes(
                        assignedRoleId as AzureAccessPermissionRoles
                    )
                ).length === enforcedRoleIds.length
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
        enforcedRoleIds: Array<AzureAccessPermissionRoles>,
        alternatedRoleIds: Array<AzureAccessPermissionRoles>
    ) {
        try {
            const userRoleAssignments = await this.getRoleAssignments(
                resourceId,
                uniqueObjectId
            );
            const resultRoleAssignments =
                userRoleAssignments?.result?.data.value;
            const assignedRoleIds = resultRoleAssignments?.map(
                (roleAssignment) => {
                    return roleAssignment.properties?.roleDefinitionId
                        .split('/')
                        .pop();
                }
            );
            if (assignedRoleIds) {
                let missingRoleDefinitionIds = [];
                enforcedRoleIds.forEach(
                    (enforcedRoleId: AzureAccessPermissionRoles) => {
                        if (!assignedRoleIds.includes(enforcedRoleId)) {
                            missingRoleDefinitionIds.push(enforcedRoleId);
                        }
                    }
                );
                if (
                    !assignedRoleIds.some((assignedRoleId) =>
                        alternatedRoleIds.includes(
                            assignedRoleId as AzureAccessPermissionRoles
                        )
                    )
                ) {
                    missingRoleDefinitionIds = missingRoleDefinitionIds.concat(
                        alternatedRoleIds
                    );
                }
                return missingRoleDefinitionIds;
            } else {
                return [...enforcedRoleIds, ...alternatedRoleIds];
            }
        } catch (error) {
            return null;
        }
    }

    /** Returns list of all the resource groups in the provided subscription */
    async getResourceGroupsInSubscription(subscriptionId: string) {
        const adapterMethodSandbox = new AdapterMethodSandbox(this.authService);
        return await adapterMethodSandbox.safelyFetchData(async (token) => {
            let resourceGroups: IAzureResourceGroup[] = [];
            try {
                const appendResourceGroups = async (nextLink?: string) => {
                    const result = await axios({
                        method: 'get',
                        url:
                            nextLink ||
                            `https://management.azure.com/subscriptions/${subscriptionId}/resourcegroups`,
                        headers: {
                            'Content-Type': 'application/json',
                            authorization: 'Bearer ' + token
                        },
                        params: {
                            ...(!nextLink && { 'api-version': '2021-04-01' })
                        }
                    }).catch((err) => {
                        adapterMethodSandbox.pushError({
                            type: ComponentErrorType.DataFetchFailed,
                            isCatastrophic: false,
                            rawError: err
                        });
                        return null;
                    });

                    if (result.data?.value) {
                        resourceGroups = [
                            ...resourceGroups,
                            ...result.data.value
                        ];
                    }

                    // If next link present, fetch next chunk
                    if (result.data?.nextLink && result.data?.value?.length) {
                        await appendResourceGroups(nextLink);
                    }
                };

                await appendResourceGroups();
            } catch (err) {
                adapterMethodSandbox.pushError({
                    type: ComponentErrorType.DataFetchFailed,
                    isCatastrophic: true,
                    rawError: err
                });
                return null;
            }

            return new AzureResourceGroupsData(resourceGroups);
        }, 'azureManagement');
    }

    /** Returns list of all the resources of the given type in all of user's subscriptions */
    async getResources(
        resourceType: AzureResourceTypes,
        providerEndpoint: string,
        tenantId?: string,
        uniqueObjectId?: string
    ) {
        const adapterMethodSandbox = new AdapterMethodSandbox(this.authService);
        if (tenantId) {
            this.tenantId = tenantId;
        }
        if (uniqueObjectId) {
            this.uniqueObjectId = uniqueObjectId;
        }

        return await adapterMethodSandbox.safelyFetchData(async (token) => {
            try {
                const subscriptions = await this.getSubscriptions();
                const userSubscriptions = subscriptions.getData() as IAzureUserSubscriptions;

                const subscriptionIdsByTenantId = userSubscriptions.value
                    .filter((s) => s.tenantId === this.tenantId)
                    .map((s) => s.subscriptionId);

                const resourcesBySubscriptionsResponse = await Promise.all(
                    subscriptionIdsByTenantId.map(async (subscriptionId) => {
                        if (resourceType === AzureResourceTypes.Container) {
                            // if it is container type we need to pull all the resource groups in every subscription
                            const resourceGroupsInSubscription = await this.getResourceGroupsInSubscription(
                                subscriptionId
                            );
                            const resourceGroups: Array<IAzureResourceGroup> = resourceGroupsInSubscription.getData();
                            return Promise.all(
                                resourceGroups?.map((resourceGroup) =>
                                    axios({
                                        method: 'get',
                                        url: `https://management.azure.com/subscriptions/${subscriptionId}/resourceGroups/${resourceGroup.name}/providers/${providerEndpoint}`,
                                        headers: {
                                            'Content-Type': 'application/json',
                                            authorization: 'Bearer ' + token
                                        },
                                        params: {
                                            'api-version': '2021-09-01'
                                        }
                                    }).catch((err) => {
                                        adapterMethodSandbox.pushError({
                                            type:
                                                ComponentErrorType.DataFetchFailed,
                                            isCatastrophic: false,
                                            rawError: err
                                        });
                                        return null;
                                    })
                                )
                            ).catch((err) => {
                                adapterMethodSandbox.pushError({
                                    type: ComponentErrorType.DataFetchFailed,
                                    isCatastrophic: false,
                                    rawError: err
                                });
                                return null;
                            });
                        } else {
                            return axios({
                                method: 'get',
                                url: `https://management.azure.com/subscriptions/${subscriptionId}/providers/${providerEndpoint}`,
                                headers: {
                                    'Content-Type': 'application/json',
                                    authorization: 'Bearer ' + token
                                },
                                params: {
                                    'api-version': '2020-12-01'
                                }
                            }).catch((err) => {
                                adapterMethodSandbox.pushError({
                                    type: ComponentErrorType.DataFetchFailed,
                                    isCatastrophic: false,
                                    rawError: err
                                });
                                return null;
                            });
                        }
                    })
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
                if (resourceType === AzureResourceTypes.Container) {
                    successfulResourcesResponse = resourcesBySubscriptionsResponse.reduce(
                        (acc, resourcesInResourceGroup) =>
                            acc.concat(
                                resourcesInResourceGroup.filter(
                                    (result) => result !== null
                                )
                            ),
                        []
                    );
                } else {
                    successfulResourcesResponse = resourcesBySubscriptionsResponse.filter(
                        (result) => {
                            return result !== null;
                        }
                    );
                }

                const resourceInstancesArray: Array<IAzureResource> = [];
                successfulResourcesResponse.forEach((result) => {
                    const resourcesInSubscription = result.data;
                    if (resourcesInSubscription?.value?.length > 0) {
                        resourceInstancesArray.push(
                            ...resourcesInSubscription.value
                        );
                    }
                });

                return new AzureResourcesData(resourceInstancesArray);
            } catch (error) {
                adapterMethodSandbox.pushError({
                    type: ComponentErrorType.DataFetchFailed,
                    isCatastrophic: false,
                    rawError: error
                });
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
            return new AzureRoleAssignmentsData([newRoleAssignment]);
        }, 'azureManagement');
    }
}
