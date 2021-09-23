import {
    IAuthService,
    ITsiClientChartDataAdapter
} from '../Models/Constants/Interfaces';
import AdapterMethodSandbox from '../Models/Classes/AdapterMethodSandbox';
import { CardErrorType } from '../Models/Constants/Enums';
import axios from 'axios';
import { SearchSpan, TsiClientAdapterData } from '../Models/Classes';
import TsqExpression from 'tsiclient/TsqExpression';
import { transformTsqResultsForVisualization } from 'tsiclient/Transformers';

export default class ADXAdapter implements ITsiClientChartDataAdapter {
    private authService: IAuthService;
    private ADXClusterUrl: string;
    private ADXDBName: string;
    private ADXTableName: string;

    constructor(
        ADXClusterUrl: string,
        ADXDBName: string,
        ADXTableName: string,
        authService: IAuthService
    ) {
        this.ADXClusterUrl = ADXClusterUrl;
        this.ADXDBName = ADXDBName;
        this.ADXTableName = ADXTableName;
        this.authService = authService;
        this.authService.login();
    }
    async getTsiclientChartDataShape(
        id: string,
        searchSpan: SearchSpan,
        properties: string[]
    ) {
        const adapterMethodSandbox = new AdapterMethodSandbox(this.authService);

        return await adapterMethodSandbox.safelyFetchData(async (token) => {
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
                // // use the below azure management call to get adt-adx connection information including Kusto cluster url, database name and table name to retrieve the data history from
                // const connectionsData = await axios({
                //     method: 'get',
                //     url: `https://management.azure.com${ADTInstanceAzureResourceId}/timeSeriesDatabaseConnections`,
                //     headers: {
                //         Authorization: 'Bearer ' + token,
                //         Accept: 'application/json',
                //         'Content-Type': 'application/json'
                //     },
                //     params: {
                //         'api-version': '2021-06-30-preview'
                //     }
                // });
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
                            db: this.ADXDBName,
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
}
