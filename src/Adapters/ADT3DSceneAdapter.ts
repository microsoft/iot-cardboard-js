import axios from 'axios';
import ADTInstanceConnectionData from '../Models/Classes/AdapterDataClasses/ADTInstanceConnectionData';
import ADTInstancesData from '../Models/Classes/AdapterDataClasses/ADTInstancesData';
import StorageContainersData from '../Models/Classes/AdapterDataClasses/StorageContainersData';
import AdapterMethodSandbox from '../Models/Classes/AdapterMethodSandbox';
import AdapterResult from '../Models/Classes/AdapterResult';
import {
    AzureAccessPermissionRoles,
    AzureServiceResourceProviderEndpoints
} from '../Models/Constants/Enums';
import {
    IADTInstance,
    IAuthService,
    IAzureResource,
    IStorageContainer
} from '../Models/Constants/Interfaces';
import { applyMixins } from '../Models/Services/Utils';
import ADTAdapter from './ADTAdapter';
import ADXAdapter from './ADXAdapter';
import AzureManagementAdapter from './AzureManagementAdapter';
import BlobAdapter from './BlobAdapter';

export default class ADT3DSceneAdapter {
    public accountName: string;
    constructor(
        authService: IAuthService,
        adtHostUrl: string,
        accountName: string,
        blobContainerUrl?: string,
        tenantId?: string,
        uniqueObjectId?: string,
        adtProxyServerPath = '/proxy/adt',
        blobProxyServerPath = '/proxy/blob'
    ) {
        this.adtHostUrl = adtHostUrl;
        this.authService = this.blobAuthService = authService;
        this.accountName = accountName;
        this.tenantId = tenantId;
        this.uniqueObjectId = uniqueObjectId;
        if (blobContainerUrl) {
            const containerURL = new URL(blobContainerUrl);
            this.storageAccountHostUrl = containerURL.hostname;
            this.blobContainerPath = containerURL.pathname;
        }

        this.adtProxyServerPath = adtProxyServerPath;
        this.blobProxyServerPath = blobProxyServerPath;
        this.authService.login();
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

    //returns all the storage containers that the user has the specified permissions to
    getContainers = async () => {
        const adapterMethodSandbox = new AdapterMethodSandbox(this.authService);
        const accessRolesToCheck = [
            AzureAccessPermissionRoles.Reader,
            AzureAccessPermissionRoles.StorageBlobDataContributor
        ];
        return await adapterMethodSandbox.safelyFetchData(async () => {
            const storageEndPoint = `${AzureServiceResourceProviderEndpoints.Storage}/${this.accountName}/blobServices/default/containers`;
            const storageResourcesResult = await this.getResources(
                storageEndPoint
            );
            const storageResources: Array<IAzureResource> = storageResourcesResult.getData();
            const storageContainers: Array<IStorageContainer> = [];
            for (let i = 0; i < storageResources.length; i++) {
                const storageResource = storageResources[i];
                const haveAccess = await this.hasRoleDefinitions(
                    storageResource.id,
                    this.uniqueObjectId,
                    accessRolesToCheck,
                    true
                );
                if (haveAccess) {
                    storageContainers.push({
                        id: storageResource.id,
                        name: storageResource.name
                    });
                }
            }

            return new StorageContainersData(storageContainers);
        });
    };

    //returns all the adt instances that the user has the specified permission/permissions to
    getADTInstances = async () => {
        const adapterMethodSandbox = new AdapterMethodSandbox(this.authService);
        const accessRolesToCheck = [
            AzureAccessPermissionRoles.AzureDigitalTwinsDataOwner,
            AzureAccessPermissionRoles.AzureDigitalTwinsDataReader
        ];
        return await adapterMethodSandbox.safelyFetchData(async () => {
            const adtInstanceResourcesResult = await this.getResources(
                AzureServiceResourceProviderEndpoints.ADT
            );
            const adtInstanceResources: Array<IAzureResource> = adtInstanceResourcesResult.getData();
            const digitalTwinsInstances: Array<IADTInstance> = [];

            if (adtInstanceResources) {
                for (let i = 0; i < adtInstanceResources.length; i++) {
                    const adtInstanceResource = adtInstanceResources[i];
                    const haveAccess = await this.hasRoleDefinitions(
                        adtInstanceResource.id,
                        this.uniqueObjectId,
                        accessRolesToCheck
                    );
                    if (haveAccess) {
                        digitalTwinsInstances.push({
                            id: adtInstanceResource.id,
                            name: adtInstanceResource.name,
                            hostName:
                                adtInstanceResource.properties['hostName'],
                            location: adtInstanceResource.location
                        });
                    }
                }
            }

            return new ADTInstancesData(digitalTwinsInstances);
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
    getContainers: () => Promise<AdapterResult<StorageContainersData>>;
}
applyMixins(ADT3DSceneAdapter, [
    ADTAdapter,
    BlobAdapter,
    AzureManagementAdapter,
    ADXAdapter
]);
