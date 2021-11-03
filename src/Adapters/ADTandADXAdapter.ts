import axios from 'axios';
import { AdapterMethodSandbox, AdapterResult } from '../Models/Classes';
import ADTInstanceConnectionData from '../Models/Classes/AdapterDataClasses/ADTInstanceConnectionData';
import ADTInstancesData from '../Models/Classes/AdapterDataClasses/ADTInstancesData';
import { IADTInstanceConnection } from '../Models/Constants';
import { IAuthService } from '../Models/Constants/Interfaces';
import { applyMixins } from '../Models/Services/Utils';
import ADTAdapter from './ADTAdapter';
import ADXAdapter from './ADXAdapter';

export default class ADTandADXAdapter {
    private tenantId = '';
    constructor(
        adtHostUrl: string,
        authService: IAuthService,
        tenantId?: string,
        adxInformation?: IADTInstanceConnection,
        adtProxyServerPath = '/api/proxy'
    ) {
        this.adtHostUrl = adtHostUrl;
        this.authService = this.adxAuthService = authService;
        this.adtProxyServerPath = adtProxyServerPath;
        this.axiosInstance = axios.create({ baseURL: this.adtProxyServerPath });
        this.authService.login((_name, _userName, tenants) => {
            if (tenants?.map((t) => t.tenantId).includes(tenantId)) {
                this.tenantId = tenantId;
            } else {
                this.tenantId = tenants[0]?.tenantId;
            }
        });

        if (adxInformation) {
            this.clusterUrl = adxInformation.kustoClusterUrl;
            this.databaseName = adxInformation.kustoDatabaseName;
            this.tableName = adxInformation.kustoTableName;
        }
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
            // find the current ADT instance by its hostUrl
            const instanceDictionary: AdapterResult<ADTInstancesData> = await this.getADTInstances(
                this.tenantId
            );
            const instance = instanceDictionary.result.data.find(
                (d) => d.hostName === this.adtHostUrl
            );

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
            )}_${instance.location}`;

            return new ADTInstanceConnectionData({
                kustoClusterUrl: this.clusterUrl,
                kustoDatabaseName: this.databaseName,
                kustoTableName: this.tableName
            });
        }, 'azureManagement');
    };
}

export default interface ADTandADXAdapter extends ADTAdapter, ADXAdapter {
    getConnectionInformation: () => Promise<
        AdapterResult<ADTInstanceConnectionData>
    >;
}
applyMixins(ADTandADXAdapter, [ADTAdapter, ADXAdapter]);
