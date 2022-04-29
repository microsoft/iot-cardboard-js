import axios from 'axios';
import { AdapterMethodSandbox } from '../Models/Classes';
import AzureResourcesData from '../Models/Classes/AdapterDataClasses/AzureResourcesData';
import {
    SubscriptionData,
    UserAssignmentsData
} from '../Models/Classes/AdapterDataClasses/AzureManagementModelData';
import {
    AzureAccessPermissionRoles,
    ComponentErrorType,
    IAuthService,
    IAzureManagementAdapter,
    IAzureResource,
    IUserRoleAssignments,
    IUserSubscriptions
} from '../Models/Constants';

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
            let subscriptions: IUserSubscriptions;
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
            });
            if (UserSubscriptions.data) {
                subscriptions = UserSubscriptions.data;
            }
            return new SubscriptionData(subscriptions);
        }, 'azureManagement');
    }

    /** Given a resource it will return a list of all of the role assignments for that instance*/
    async getRoleAssignments(resourceId: string, uniqueObjectId: string) {
        const adapterMethodSandbox = new AdapterMethodSandbox(this.authService);
        return await adapterMethodSandbox.safelyFetchData(async (token) => {
            let roleAssignments: IUserRoleAssignments; //an array of role assignments
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
            });
            if (userRoleAssignments.data) {
                //if there are any user role assignments
                roleAssignments = userRoleAssignments.data;
            }
            return new UserAssignmentsData(roleAssignments);
        }, 'azureManagement');
    }

    /** this function checks if a user has a list of certain role defintions like Reader, Writer, Storage Owner, and etc in their list of role assignments */
    async hasRoleDefinitions(
        resourceID: string,
        uniqueObjectID: string,
        rolesToCheck: Array<AzureAccessPermissionRoles>,
        shouldEnforceAll = false
    ) {
        const userRoleAssignments = await this.getRoleAssignments(
            resourceID,
            uniqueObjectID
        );
        const resultRoleAssignments = userRoleAssignments.result?.data.value;
        const assignedRoleIds = resultRoleAssignments?.map((roleAssignment) => {
            return roleAssignment.properties?.roleDefinitionId.split('/').pop();
        });
        if (assignedRoleIds) {
            if (!shouldEnforceAll) {
                // if not all the roles to check are enforced, check if there is some of them existing in the assigned roles
                return assignedRoleIds.some((assignedRoleId) =>
                    rolesToCheck.includes(
                        assignedRoleId as AzureAccessPermissionRoles
                    )
                );
            } else {
                // if all the roles to check needs to exist in the assigned roles
                return (
                    assignedRoleIds.filter((assignedRoleId) =>
                        rolesToCheck.includes(
                            assignedRoleId as AzureAccessPermissionRoles
                        )
                    ).length === rolesToCheck.length
                );
            }
        } else {
            return false;
        }
    }

    async getResources(
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
            const subscriptions = await this.getSubscriptions();
            const userSubscriptions = subscriptions.getData() as IUserSubscriptions;

            const subscriptionsByTenantId = userSubscriptions.value
                .filter((s) => s.tenantId === this.tenantId) //creates an array of subscriptions that are under the given tenant
                .map((s) => s.subscriptionId); //creates a new array of just subscription GUIDS
            const resourcesBySubscriptionsResponse = await Promise.all(
                subscriptionsByTenantId.map((subscriptionId) => {
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
                })
            );

            //filter out nulls, i.e. errors
            const successfulResourcesResponse = resourcesBySubscriptionsResponse.filter(
                (result) => {
                    return result !== null;
                }
            );

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
        }, 'azureManagement');
    }
}
