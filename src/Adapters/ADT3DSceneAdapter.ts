import axios from 'axios';
import { ADTTwinData } from '../Models/Classes';
import AdapterEntityCache from '../Models/Classes/AdapterEntityCache';
import ADTInstanceConnectionData from '../Models/Classes/AdapterDataClasses/ADTInstanceConnectionData';
import ADTInstancesData from '../Models/Classes/AdapterDataClasses/ADTInstancesData';
import AdapterMethodSandbox from '../Models/Classes/AdapterMethodSandbox';
import AdapterResult from '../Models/Classes/AdapterResult';
import {
    AzureAccessPermissionRoles,
    AzureResourceProviderEndpoints,
    AzureResourceTypes,
    ComponentErrorType
} from '../Models/Constants/Enums';
import {
    IADTInstance,
    IAuthService,
    IAzureResource
} from '../Models/Constants/Interfaces';
import { applyMixins } from '../Models/Services/Utils';
import ADTAdapter from './ADTAdapter';
import ADXAdapter from './ADXAdapter';
import AzureManagementAdapter from './AzureManagementAdapter';
import BlobAdapter from './BlobAdapter';
import {
    ADTAllModelsData,
    ADTTwinToModelMappingData
} from '../Models/Classes/AdapterDataClasses/ADTModelData';
import {
    IAzureRoleAssignment,
    instancesRefreshMaxAge,
    MissingAzureRoleDefinitionAssignments,
    modelRefreshMaxAge
} from '../Models/Constants';
import {
    AzureMissingRoleDefinitionsData,
    AzureRoleAssignmentsData
} from '../Models/Classes/AdapterDataClasses/AzureManagementData';

const EnforcedStorageContainerAccessRoleIdsToCheck = [
    AzureAccessPermissionRoles.Reader
];
const AlternatedStorageContainerAccessRoleIdsToCheck = [
    AzureAccessPermissionRoles['Storage Blob Data Owner'],
    AzureAccessPermissionRoles['Storage Blob Data Contributor']
];

export default class ADT3DSceneAdapter {
    constructor(
        authService: IAuthService,
        adtHostUrl: string,
        blobContainerUrl?: string,
        tenantId?: string,
        uniqueObjectId?: string,
        adtProxyServerPath = '/proxy/adt',
        blobProxyServerPath = '/proxy/blob'
    ) {
        this.adtHostUrl = adtHostUrl;
        this.authService = this.blobAuthService = authService;
        this.tenantId = tenantId;
        this.uniqueObjectId = uniqueObjectId;
        this.adtTwinCache = new AdapterEntityCache<ADTTwinData>(9000);
        this.adtModelsCache = new AdapterEntityCache<ADTAllModelsData>(
            modelRefreshMaxAge
        );
        this.adtTwinToModelMappingCache = new AdapterEntityCache<ADTTwinToModelMappingData>(
            modelRefreshMaxAge
        );
        this.adtInstancesCache = new AdapterEntityCache<ADTInstancesData>(
            instancesRefreshMaxAge
        );

        if (blobContainerUrl) {
            const containerURL = new URL(blobContainerUrl);
            this.storageAccountHostName = containerURL.hostname;
            this.accountName = containerURL.hostname.split('.')[0];
            this.containerName = containerURL.pathname.split('/')[1];
        }

        this.adtProxyServerPath = adtProxyServerPath;
        this.blobProxyServerPath = blobProxyServerPath;
        this.authService.login();
        // Fetch & cache models on mount (makes first use of models faster as models should already be cached)
        this.getAllAdtModels();
    }
    getConnectionInformation = async () => {
        if (this.clusterUrl && this.databaseName && this.tableName) {
            return new AdapterResult<ADTInstanceConnectionData>({
                result: new ADTInstanceConnectionData({
                    kustoClusterUrl: this.clusterUrl,
                    kustoDatabaseName: this.databaseName,
                    kustoTableName: this.tableName
                }),
                errorInfo: null
            });
        }

        const adapterMethodSandbox = new AdapterMethodSandbox(this.authService);
        return await adapterMethodSandbox.safelyFetchData(async (token) => {
            const digitalTwinInstances = await this.getADTInstances();
            const result = digitalTwinInstances.result.data;
            const instance = result.find((d) => d.hostName === this.adtHostUrl);

            try {
                // use the below azure management call to get adt-adx connection information including Kusto cluster url, database name and table name to retrieve the data history from
                const connectionsData = await axios({
                    method: 'get',
                    url: `https://management.azure.com${instance.id}/timeSeriesDatabaseConnections`,
                    headers: {
                        Authorization: 'Bearer ' + token,
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    },
                    params: {
                        'api-version': '2021-06-30-preview'
                    }
                });
                this.clusterUrl =
                    connectionsData.data.value[0].properties.adxEndpointUri;
                this.databaseName =
                    connectionsData.data.value[0].properties.adxDatabaseName;
                this.tableName = `adt_dh_${connectionsData.data.value[0].properties.adxDatabaseName.replaceAll(
                    '-',
                    '_'
                )}_${instance?.location}`;
            } catch (error) {
                adapterMethodSandbox.pushError({
                    isCatastrophic: false,
                    rawError: error
                });
            }
            return new ADTInstanceConnectionData({
                kustoClusterUrl: this.clusterUrl,
                kustoDatabaseName: this.databaseName,
                kustoTableName: this.tableName
            });
        }, 'azureManagement');
    };

    //returns all the adt instances that the user has the specified permission/permissions to
    getADTInstances = async () => {
        const adapterMethodSandbox = new AdapterMethodSandbox(this.authService);
        const alternatedRolesToCheck = [
            AzureAccessPermissionRoles['Azure Digital Twins Data Owner'],
            AzureAccessPermissionRoles['Azure Digital Twins Data Reader']
        ];
        return await adapterMethodSandbox.safelyFetchData(async () => {
            const adtInstanceResourcesResult = await this.getResources(
                AzureResourceTypes.ADT,
                AzureResourceProviderEndpoints.ADT
            );
            const adtInstanceResources: Array<IAzureResource> = adtInstanceResourcesResult?.getData();
            const digitalTwinsInstances: Array<IADTInstance> = [];

            if (adtInstanceResources) {
                const hasRoleDefinitionsResults = await Promise.all(
                    adtInstanceResources.map((adtInstanceResource) =>
                        this.hasRoleDefinitions(
                            adtInstanceResource.id,
                            this.uniqueObjectId,
                            [],
                            alternatedRolesToCheck
                        )
                    )
                );
                hasRoleDefinitionsResults.forEach((haveAccess, idx) => {
                    if (haveAccess) {
                        const adtInstanceResource = adtInstanceResources[idx];
                        digitalTwinsInstances.push({
                            id: adtInstanceResource.id,
                            name: adtInstanceResource.name,
                            hostName:
                                adtInstanceResource.properties['hostName'],
                            location: adtInstanceResource.location
                        });
                    }
                });
            }

            return new ADTInstancesData(digitalTwinsInstances);
        });
    };

    /** Checking missing role assignments for the container, for this we need the resouce id of the container and we need to make
     * series of Azure Management calls for be able to find that container - if exist in user's subscription.
     */
    getMissingStorageContainerAccessRoles = async (
        containerUrlString?: string
    ) => {
        let accountName, containerName;
        if (containerUrlString) {
            try {
                const containerURL = new URL(containerUrlString);
                this.accountName = containerURL.hostname.split('.')[0];
                this.containerName = containerURL.pathname.split('/')[1];
            } catch (error) {
                accountName = null;
                containerName = null;
                console.log(error);
            }
        } else {
            accountName = this.accountName;
            containerName = this.containerName;
        }

        const adapterMethodSandbox = new AdapterMethodSandbox(this.authService);
        return await adapterMethodSandbox.safelyFetchData(async () => {
            try {
                const storageEndPoint = `${AzureResourceProviderEndpoints.Storage}/${accountName}/blobServices/default/containers`;
                const storageResourcesInUsersSubscriptionsResult = await this.getResources(
                    AzureResourceTypes.Container,
                    storageEndPoint
                );

                const storageResources: Array<IAzureResource> = storageResourcesInUsersSubscriptionsResult?.getData();
                const storageResource = storageResources?.find(
                    (sR) => sR.name === containerName
                );
                if (storageResource) {
                    this.containerResourceId = storageResource.id;
                    const missingRoles = await this.getMissingRoleDefinitions(
                        storageResource.id,
                        this.uniqueObjectId,
                        EnforcedStorageContainerAccessRoleIdsToCheck,
                        AlternatedStorageContainerAccessRoleIdsToCheck
                    );

                    const missingEnforcedRoles = missingRoles?.filter((role) =>
                        EnforcedStorageContainerAccessRoleIdsToCheck.includes(
                            role
                        )
                    );
                    const missingAlternatedRoles = missingRoles?.filter(
                        (role) =>
                            AlternatedStorageContainerAccessRoleIdsToCheck.includes(
                                role
                            )
                    );
                    return new AzureMissingRoleDefinitionsData({
                        enforced: missingEnforcedRoles,
                        alternated: missingAlternatedRoles
                    });
                } else {
                    // return null as the container is not even in user's subscription
                    return new AzureMissingRoleDefinitionsData({
                        enforced: null,
                        alternated: null
                    });
                }
            } catch (error) {
                adapterMethodSandbox.pushError({
                    type: ComponentErrorType.DataFetchFailed,
                    isCatastrophic: false,
                    rawError: error
                });
                return null;
            }
        });
    };

    /** Adding provided role definitions to the user's role assignments for the container resource. This method assumes that
     * containerResourceId is already set in the previous getMissingStorageContainerAccessRoles method and present for assigning roles for.
     */
    addMissingRolesToStorageContainer = async (
        missingRoleDefinitionIds: MissingAzureRoleDefinitionAssignments
    ) => {
        const adapterMethodSandbox = new AdapterMethodSandbox(this.authService);
        return await adapterMethodSandbox.safelyFetchData(async () => {
            try {
                const enforcedRoleAssignmentResults = await Promise.all(
                    missingRoleDefinitionIds.enforced?.map((roleDefinitionId) =>
                        this.assignRole(
                            roleDefinitionId,
                            this.containerResourceId,
                            this.uniqueObjectId
                        )
                    )
                );

                let alternatedRoleAssignmentResult;
                if (
                    missingRoleDefinitionIds.alternated?.length &&
                    missingRoleDefinitionIds.alternated.includes(
                        AzureAccessPermissionRoles[
                            'Storage Blob Data Contributor'
                        ]
                    )
                ) {
                    // if alternated role assignment is missing, just add 'Storage Blob Data Contributor' by default
                    alternatedRoleAssignmentResult = await this.assignRole(
                        AzureAccessPermissionRoles[
                            'Storage Blob Data Contributor'
                        ],
                        this.containerResourceId,
                        this.uniqueObjectId
                    );
                }

                const newRoleAssignments: Array<IAzureRoleAssignment> = [];

                enforcedRoleAssignmentResults?.forEach((result) => {
                    if (!result?.hasNoData()) {
                        newRoleAssignments.push(result.getData());
                    }
                });

                if (!alternatedRoleAssignmentResult?.hasNoData()) {
                    newRoleAssignments.push(
                        alternatedRoleAssignmentResult.getData()
                    );
                }

                return new AzureRoleAssignmentsData(newRoleAssignments);
            } catch (error) {
                adapterMethodSandbox.pushError({
                    type: ComponentErrorType.DataFetchFailed,
                    isCatastrophic: false,
                    rawError: error
                });
                return null;
            }
        });
    };
}

export default interface ADT3DSceneAdapter
    extends ADTAdapter,
        BlobAdapter,
        AzureManagementAdapter,
        ADXAdapter {
    getConnectionInformation: () => Promise<
        AdapterResult<ADTInstanceConnectionData>
    >;
    getADTInstances: () => Promise<AdapterResult<ADTInstancesData>>;
    getMissingStorageContainerAccessRoles: (
        containerURLString?: string
    ) => Promise<AdapterResult<AzureMissingRoleDefinitionsData>>;
    addMissingRolesToStorageContainer: (
        missingRoleDefinitionIds: MissingAzureRoleDefinitionAssignments
    ) => Promise<AdapterResult<AzureRoleAssignmentsData>>;
}
applyMixins(ADT3DSceneAdapter, [
    ADTAdapter,
    BlobAdapter,
    AzureManagementAdapter,
    ADXAdapter
]);
