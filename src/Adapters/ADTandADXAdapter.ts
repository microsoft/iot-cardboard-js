import axios from 'axios';
import { transformTsqResultsForVisualization } from 'tsiclient/Transformers';
import TsqExpression from 'tsiclient/TsqExpression';
import {
    AdapterMethodSandbox,
    SearchSpan,
    TsiClientAdapterData
} from '../Models/Classes';
import ADTInstancesData from '../Models/Classes/AdapterDataClasses/ADTInstancesData';
import { CardErrorType } from '../Models/Constants';
import {
    IAuthService,
    ITsiClientChartDataAdapter
} from '../Models/Constants/Interfaces';
import ADTAdapter from './ADTAdapter';

export default class ADTandADXAdapter
    extends ADTAdapter
    implements ITsiClientChartDataAdapter {
    private authServiceAzureManagement: IAuthService;
    private authServiceADX: IAuthService;
    private ADXClusterUrl: string;
    private ADXDatabaseName: string;
    private ADXTableName: string;

    constructor(
        adtHostUrl: string,
        authServiceADT: IAuthService,
        authServiceAzureManagement: IAuthService,
        authServiceADX: IAuthService,
        adtProxyServerPath = '/api/proxy'
    ) {
        super(adtHostUrl, authServiceADT, adtProxyServerPath);
        this.authServiceAzureManagement = authServiceAzureManagement;
        this.authServiceADX = authServiceADX;
    }
    async getTsiclientChartDataShape(
        id: string,
        searchSpan: SearchSpan,
        properties: string[]
    ) {
        this.authServiceADX.login();
        const adapterMethodSandbox = new AdapterMethodSandbox(
            this.authServiceADX
        );

        return await adapterMethodSandbox.safelyFetchData(async (token) => {
            debugger;
            const tsqExpressions = [];
            properties.forEach((prop) => {
                const variableObject = {
                    [prop]: {
                        kind: 'numeric',
                        value: { tsx: `$event.${prop}.Double` },
                        filter: null,
                        aggregation: { tsx: 'avg($value)' }
                    }
                };
                const tsqExpression = new TsqExpression(
                    { timeSeriesId: [id] },
                    variableObject,
                    searchSpan,
                    { alias: prop }
                );
                tsqExpressions.push(tsqExpression);
            });

            let adxResults;
            try {
                const axiosGets = properties.map(async (prop) => {
                    return await axios({
                        method: 'post',
                        url: `${this.ADXClusterUrl}/v2/rest/query`,
                        headers: {
                            Authorization: 'Bearer ' + token,
                            Accept: 'application/json',
                            'Content-Type': 'application/json'
                        },
                        data: {
                            db: this.ADXDatabaseName,
                            csl: `${
                                this.ADXTableName
                            } | where Id contains "${id}" and Key contains "${prop}" and TimeStamp between (datetime(${searchSpan.from.toISOString()}) .. datetime(${searchSpan.to.toISOString()}))`
                        }
                    });
                });

                adxResults = await axios.all(axiosGets);
            } catch (err) {
                adapterMethodSandbox.pushError({
                    type: CardErrorType.DataFetchFailed,
                    isCatastrophic: true,
                    rawError: err
                });
            }

            const tsqResults = [];
            adxResults.map((result, idx) => {
                const primaryResultFrames = result.data.filter(
                    (frame) => frame.TableKind === 'PrimaryResult'
                );
                if (primaryResultFrames.length) {
                    const timeStampColumnIndex = primaryResultFrames[0].Columns.findIndex(
                        (c) => c.ColumnName === 'TimeStamp'
                    );
                    const valueColumnIndex = primaryResultFrames[0].Columns.findIndex(
                        (c) => c.ColumnName === 'Value'
                    );
                    const mergedTimeStampAndValuePairs = [];
                    primaryResultFrames.forEach((rF) =>
                        rF.Rows.forEach((r) =>
                            mergedTimeStampAndValuePairs.push([
                                r[timeStampColumnIndex],
                                r[valueColumnIndex]
                            ])
                        )
                    );
                    const adxTimestamps = mergedTimeStampAndValuePairs.map(
                        (tSandValuePair) => tSandValuePair[0]
                    );
                    const adxValues = mergedTimeStampAndValuePairs.map(
                        (tSandValuePair) => tSandValuePair[1]
                    );
                    const tsqResult = {};
                    tsqResult['timestamps'] = adxTimestamps;
                    tsqResult['properties'] = [
                        {
                            values: adxValues,
                            name: properties[idx],
                            type: 'Double'
                        }
                    ];
                    tsqResults.push(tsqResult);
                }
            });

            const transformedResults = transformTsqResultsForVisualization(
                tsqResults,
                tsqExpressions
            ) as any;

            return new TsiClientAdapterData(transformedResults);
        });
    }

    getADTInstances = async () => {
        this.authServiceAzureManagement.login();
        const adapterMethodSandbox = new AdapterMethodSandbox(
            this.authServiceAzureManagement
        );

        return await adapterMethodSandbox.safelyFetchData(async (token) => {
            const getTenants = await axios({
                method: 'get',
                url: `https://management.azure.com/tenants`,
                headers: {
                    'Content-Type': 'application/json',
                    authorization: 'Bearer ' + token
                },
                params: {
                    'api-version': '2020-01-01'
                }
            });

            const msTenantId = getTenants.data.value.filter(
                (t) => t.defaultDomain === 'microsoft.onmicrosoft.com'
            )[0].tenantId;

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

            const subscriptionsByTenantId = subscriptions.data.value
                .filter((s) => s.tenantId === msTenantId)
                .map((s) => s.subscriptionId);

            const digitalTwinInstances = await Promise.all(
                subscriptionsByTenantId.map((subscriptionId) => {
                    return axios({
                        method: 'get',
                        url: `https://management.azure.com/subscriptions/${subscriptionId}/providers/Microsoft.DigitalTwins/digitalTwinsInstances`,
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

            const digitalTwinsInstanceDictionary = [];
            digitalTwinInstances.forEach((i: any) => {
                if (i.data.value.length) {
                    i.data.value.map((instance) =>
                        digitalTwinsInstanceDictionary.push({
                            hostName: instance.properties.hostName,
                            resourceId: instance.id,
                            location: instance.location
                        })
                    );
                }
            });
            return new ADTInstancesData(digitalTwinsInstanceDictionary);
        });
    };

    getConnectionInformation = async () => {
        const dictionary: any = await this.getADTInstances();
        const instance = dictionary.result.data.find(
            (d) => d.hostName === this.adtHostUrl
        );
        const adapterMethodSandbox = new AdapterMethodSandbox(
            this.authServiceAzureManagement
        );

        return await adapterMethodSandbox.safelyFetchData(async (token) => {
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
            this.ADXClusterUrl =
                connectionsData.data.value[0].properties.adxEndpointUri;
            this.ADXDatabaseName =
                connectionsData.data.value[0].properties.adxDatabaseName;
            this.ADXTableName = `adt_dh_${this.adtHostUrl.split('.')[0]}_${
                instance.location
            }`;

            return null;
        });
    };
}
