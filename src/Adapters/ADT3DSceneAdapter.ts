import axios from 'axios';
import ADTInstanceConnectionData from '../Models/Classes/AdapterDataClasses/ADTInstanceConnectionData';
import ADTInstancesData from '../Models/Classes/AdapterDataClasses/ADTInstancesData';
import StorageInstanceData from '../Models/Classes/AdapterDataClasses/StorageInstanceData';
import AdapterMethodSandbox from '../Models/Classes/AdapterMethodSandbox';
import AdapterResult from '../Models/Classes/AdapterResult';
import { IAuthService, IAzureResource } from '../Models/Constants/Interfaces';
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
                    url: `https://management.azure.com${instance.resourceId}/timeSeriesDatabaseConnections`,
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

    //returns all the storage instances that the user has the specified permissions to
    getContainers = async () => {
        const adapterMethodSandbox = new AdapterMethodSandbox(this.authService);
        const storageRoleDefinitionGuid = [
            'd57506d4-4c8d-48b1-8587-93c323f6a5a3',
            'bcd981a7-7f74-457b-83e1-cceb9e632ffe'
        ];
        return await adapterMethodSandbox.safelyFetchData(async () => {
            const storageEndPoint = `/Microsoft.Storage/storageAccounts/${this.accountName}/blobServices/default/containers`;
            const storageInstancesBySubscription = this.getInstances(
                storageEndPoint
            );
            const result = (await storageInstancesBySubscription).result.data;
            const storageInstances: Array<IAzureResource> = [];
            for (let i = 0; i < result.length; i++) {
                storageRoleDefinitionGuid.forEach((role) => {
                    if (
                        this.hasRoleDefinition(
                            result[i].resourceId,
                            this.uniqueObjectId,
                            role
                        )
                    ) {
                        storageInstances.push(result[i]);
                    }
                });
            }

            return new StorageInstanceData(storageInstances);
        });
    };

    //returns all the adt instances that the user has the specified permission/permissions to
    getADTInstances = async () => {
        const adapterMethodSandbox = new AdapterMethodSandbox(this.authService);
        const adtRoleDefinitionGuid = [
            'd57506d4-4c8d-48b1-8587-93c323f6a5a3',
            'bcd981a7-7f74-457b-83e1-cceb9e632ffe'
        ];
        return await adapterMethodSandbox.safelyFetchData(async () => {
            const adtEndpoint = 'Microsoft.DigitalTwins/digitalTwinsInstances';
            const adtInstancesBySubscription = this.getInstances(adtEndpoint); //get back an object that list all adt instances by the suscription id
            const result = (await adtInstancesBySubscription).result.data;
            const digitalTwinsInstances: Array<IAzureResource> = [];
            for (let i = 0; i < result.length; i++) {
                adtRoleDefinitionGuid.forEach((role) => {
                    if (
                        this.hasRoleDefinition(
                            result[i].resourceId,
                            this.uniqueObjectId,
                            role
                        )
                    ) {
                        digitalTwinsInstances.push(result[i]);
                    }
                });
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
    getContainers: () => Promise<AdapterResult<ADTInstancesData>>;
}
applyMixins(ADT3DSceneAdapter, [
    ADTAdapter,
    BlobAdapter,
    AzureManagementAdapter,
    ADXAdapter
]);
