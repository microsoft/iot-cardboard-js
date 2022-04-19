import axios from 'axios';
import { AdapterMethodSandbox } from '../Models/Classes';
import ADTInstancesData from '../Models/Classes/AdapterDataClasses/ADTInstancesData';
import {
    SubscriptionData,
    UserAssignmentsData
} from '../Models/Classes/AdapterDataClasses/AzureManagementModelData';
import {
    IADTInstance,
    IAuthService,
    IAzureManagementAdapter,
    IUserRoleAssignments,
    IUserSubscriptions
} from '../Models/Constants';

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

    //given a resourceID it will return an object that lists all  of the role assignments for that instance
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

    //this function checks if a user has a certain role defintion like Reader, Writer, Storage Owner, and etc in their list of role assignments
    async hasRoleDefinition(
        resourceID: string,
        uniqueObjectID: string,
        roleDefinitionGuid: string
    ) {
        const userRoleAssignments = await this.getRoleAssignments(
            resourceID,
            uniqueObjectID
        );
        const resultRoleAssignments = userRoleAssignments.getData() as UserAssignmentsData;
        const roleDefinitions = resultRoleAssignments?.data?.value?.map(
            (roleAssignment) => {
                return roleAssignment.properties?.roleDefinitionId
                    .split('/')
                    .pop();
            }
        );
        return roleDefinitions.includes(roleDefinitionGuid);
    }

    async getResourceInstancesWithRoleId(
        //not sure what to name this^^^
        roleDefinitionGuid: Array<string>,
        resourcePath: string,
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
            const userSubscriptions = subscriptions.getData() as SubscriptionData;

            const subscriptionsByTenantId = userSubscriptions.data.value
                .filter((s) => s.tenantId === tenantId) //creates an array of subscriptions that are under the given tenant
                .map((s) => s.subscriptionId); //creates a new array of just subscription GUIDS

            const resourceInstancesBySubscriptions = await Promise.all(
                subscriptionsByTenantId.map((subscriptionId) => {
                    return axios({
                        method: 'get',
                        url: `https://management.azure.com/subscriptions/${subscriptionId}/providers/${resourcePath}`,
                        headers: {
                            'Content-Type': 'application/json',
                            authorization: 'Bearer ' + token
                        },
                        params: {
                            'api-version': '2020-12-01'
                        }
                    });
                })
            );
            const resourceInstanceDictionary: Array<IADTInstance> = [];
            for (let i = 0; i < resourceInstancesBySubscriptions.length; i++) {
                const instances: any = resourceInstancesBySubscriptions[i];
                if (instances.data.value.length) {
                    try {
                        instances.data.value.map((instance) => {
                            roleDefinitionGuid.forEach((role) => {
                                if (
                                    this.hasRoleDefinition(
                                        instance.id,
                                        this.uniqueObjectId,
                                        role
                                    )
                                ) {
                                    resourceInstanceDictionary.push({
                                        name: instance.name,
                                        hostName: instance.properties.hostName,
                                        resourceId: instance.id,
                                        location: instance.location
                                    });
                                }
                            });
                        });
                    } catch (error) {
                        console.log(error);
                    }
                }
            }
            return new ADTInstancesData(resourceInstanceDictionary);
        }, 'azureManagement');
    }
}
