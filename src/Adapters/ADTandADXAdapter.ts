import axios from 'axios';
import { transformTsqResultsForVisualization } from 'tsiclient/Transformers';
import TsqExpression from 'tsiclient/TsqExpression';
import {
    AdapterMethodSandbox,
    AdapterResult,
    CardError,
    SearchSpan,
    TsiClientAdapterData
} from '../Models/Classes';
import ADTInstanceConnectionData from '../Models/Classes/AdapterDataClasses/ADTInstanceConnectionData';
import ADTInstancesData from '../Models/Classes/AdapterDataClasses/ADTInstancesData';
import { CardErrorType, IADTInstanceConnection } from '../Models/Constants';
import {
    IAuthService,
    ITsiClientChartDataAdapter
} from '../Models/Constants/Interfaces';
import ADTAdapter from './ADTAdapter';

export default class ADTandADXAdapter
    extends ADTAdapter
    implements ITsiClientChartDataAdapter {
    private ADXConnectionInformation: {
        clusterUrl: string;
        databaseName: string;
        tableName: string;
        ADTInstanceResourceId?: string;
    };

    constructor(
        adtHostUrl: string,
        authServiceADT: IAuthService,
        adtProxyServerPath = '/api/proxy',
        adxInformation?: IADTInstanceConnection & {
            ADTInstanceResourceId?: string;
        }
    ) {
        super(adtHostUrl, authServiceADT, adtProxyServerPath);
        if (adxInformation) {
            this.ADXConnectionInformation = {
                clusterUrl: adxInformation.kustoClusterUrl,
                databaseName: adxInformation.kustoDatabaseName,
                tableName: adxInformation.kustoTableName,
                ADTInstanceResourceId: adxInformation.ADTInstanceResourceId
            };
        }
    }
    async getTsiclientChartDataShape(
        id: string,
        searchSpan: SearchSpan,
        properties: string[]
    ) {
        const adapterMethodSandbox = new AdapterMethodSandbox(this.authService);

        return await adapterMethodSandbox.safelyFetchData(async (token) => {
            if (!this.ADXConnectionInformation) {
                throw new CardError({
                    isCatastrophic: true,
                    type: CardErrorType.DataFetchFailed,
                    rawError: new Error(
                        'ADX connection information not available'
                    )
                });
            }

            const getTsqExpressions = () =>
                properties.map((prop) => {
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
                    return tsqExpression;
                });

            const getDataHistoryOfProperty = (prop: string) => {
                return axios({
                    method: 'post',
                    url: `${this.ADXConnectionInformation.clusterUrl}/v2/rest/query`,
                    headers: {
                        Authorization: 'Bearer ' + token,
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    },
                    data: {
                        db: this.ADXConnectionInformation.databaseName,
                        csl: `${
                            this.ADXConnectionInformation.tableName
                        } | where Id contains "${id}" and Key contains "${prop}" and TimeStamp between (datetime(${searchSpan.from.toISOString()}) .. datetime(${searchSpan.to.toISOString()}))`
                    }
                });
            };

            try {
                // fetch data history of the properties using ADX api
                const adxDataHistoryResults = await Promise.all(
                    properties.map(async (prop) =>
                        getDataHistoryOfProperty(prop)
                    )
                );

                // parse all data history results to get available timestamp and value pairs for the properties
                const tsqResults = [];
                adxDataHistoryResults?.map((result, idx) => {
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

                const tsqExpressions = getTsqExpressions();
                const transformedResults = transformTsqResultsForVisualization(
                    tsqResults,
                    tsqExpressions
                ) as any;

                return new TsiClientAdapterData(transformedResults);
            } catch (err) {
                adapterMethodSandbox.pushError({
                    type: CardErrorType.DataFetchFailed,
                    isCatastrophic: true,
                    rawError: err
                });
            }
        }, 'adx');
    }

    getConnectionInformation = async () => {
        if (this.ADXConnectionInformation) {
            return new AdapterResult<ADTInstanceConnectionData>({
                result: new ADTInstanceConnectionData({
                    kustoClusterUrl: this.ADXConnectionInformation.clusterUrl,
                    kustoDatabaseName: this.ADXConnectionInformation
                        .databaseName,
                    kustoTableName: this.ADXConnectionInformation.tableName
                }),
                errorInfo: null
            });
        }

        const adapterMethodSandbox = new AdapterMethodSandbox(this.authService);

        return await adapterMethodSandbox.safelyFetchData(async (token) => {
            // find the current ADT instance by its hostUrl
            const instanceDictionary: AdapterResult<ADTInstancesData> = await this.getADTInstances();
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
            this.ADXConnectionInformation = {
                clusterUrl:
                    connectionsData.data.value[0].properties.adxEndpointUri,
                databaseName:
                    connectionsData.data.value[0].properties.adxDatabaseName,
                tableName: `adt_dh_${connectionsData.data.value[0].properties.adxDatabaseName.replaceAll(
                    '-',
                    '_'
                )}_${instance.location}`
            };

            return new ADTInstanceConnectionData({
                kustoClusterUrl: this.ADXConnectionInformation.clusterUrl,
                kustoDatabaseName: this.ADXConnectionInformation.databaseName,
                kustoTableName: this.ADXConnectionInformation.tableName
            });
        }, 'azureManagement');
    };
}
