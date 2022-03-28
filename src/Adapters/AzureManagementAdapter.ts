import axios from 'axios';
import { AdapterMethodSandbox } from '../Models/Classes';
import ADTInstancesData from '../Models/Classes/AdapterDataClasses/ADTInstancesData';
import { IAuthService, IAzureManagementAdapter } from '../Models/Constants';

export default class AzureManagementAdapter implements IAzureManagementAdapter {
    // protected tenantId: string;
    // protected uniqueObjectId: string;
    public authService: IAuthService;
    protected givenResourceType: string; // adt | storage
    protected providerUrl: string;
    constructor(
        authService: IAuthService, //we'll need token,
        resourceType: string //want know what type of resource we're are doing the calls for
    ) {
        this.authService = authService;
        this.givenResourceType = resourceType;
        this.authService.login();

        switch (this.givenResourceType) {
            case 'adt':
                this.providerUrl = 'DigitalTwins/digitalTwinsInstances';
                break;
            default:
                this.providerUrl = 'Storage/digitalTwinsInstances'; // closest api call similar to the list adt instances is List containers and this has a different setup
        }
    }

    //this function is meant to return a map of all the resource instances in which the user has read, or write access
    async getResourceInstances(tenantId?: string, uniqueObjectId?: string) {
        const adapterMethodSandbox = new AdapterMethodSandbox(this.authService);

        return await adapterMethodSandbox.safelyFetchData(async (token) => {
            //get all the subscriptions in your azure account
            const subscriptions = await axios({
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
            //filters out all the subscriptions not associated with your current tenant id (you can have multiple tenants)
            const subscriptionsByTenantId = subscriptions.data.value
                .filter((s) => s.tenantId === tenantId)
                .map((s) => s.subscriptionId);

            //get all the ADT instances found in each of the subscriptions
            const resourceInstancesBySubscriptions = await Promise.all(
                subscriptionsByTenantId.map((subscriptionId) => {
                    return axios({
                        method: 'get',
                        url: `https://management.azure.com/subscriptions/${subscriptionId}/providers/Microsoft.${this.providerUrl}`,
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

            const resourceInstanceDictionary = [];
            for (let i = 0; i < resourceInstancesBySubscriptions.length; i++) {
                const instances: any = resourceInstancesBySubscriptions[i];
                if (instances.data.value.length) {
                    let userRoleAssignments;
                    try {
                        userRoleAssignments = await Promise.all(
                            instances.data.value.map((instance) => {
                                return axios({
                                    method: 'get',
                                    url: `https://management.azure.com${instance.id}/providers/Microsoft.Authorization/roleAssignments`,
                                    headers: {
                                        'Content-Type': 'application/json',
                                        authorization: 'Bearer ' + token
                                    },
                                    params: {
                                        'api-version': '2021-04-01-preview',
                                        $filter: `atScope() and assignedTo('${uniqueObjectId}')`
                                    }
                                });
                            })
                        );
                        instances.data.value.map((instance, idx) => {
                            const assignedUserRoleIds = userRoleAssignments[
                                idx
                            ]?.data?.value?.map((v) => {
                                return v.properties.roleDefinitionId
                                    .split('/')
                                    .pop();
                            });

                            // return the adt instances only if the user has 'Azure Digital Twins Data Reader' or 'Azure Digital Twins Data Owner' permission assigned for it
                            if (
                                assignedUserRoleIds?.includes(
                                    'd57506d4-4c8d-48b1-8587-93c323f6a5a3'
                                ) ||
                                assignedUserRoleIds?.includes(
                                    'bcd981a7-7f74-457b-83e1-cceb9e632ffe'
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
                    } catch (error) {
                        console.log(error);
                    }
                }
            }
            return new ADTInstancesData(resourceInstanceDictionary);
        }, 'azureManagement');
    }
}
