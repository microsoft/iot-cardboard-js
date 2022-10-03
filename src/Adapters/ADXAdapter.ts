import {
    IADXAdapter,
    IADXConnection,
    IAuthService,
    ITsiClientChartDataAdapter
} from '../Models/Constants/Interfaces';
import AdapterMethodSandbox from '../Models/Classes/AdapterMethodSandbox';
import { ComponentErrorType } from '../Models/Constants/Enums';
import axios from 'axios';
import { SearchSpan, TsiClientAdapterData } from '../Models/Classes';
import TsqExpression from 'tsiclient/TsqExpression';
import { transformTsqResultsForVisualization } from 'tsiclient/Transformers';
import ADXTimeSeriesData from '../Models/Classes/AdapterDataClasses/ADXTimeSeriesData';
import { ADXTimeSeries } from '../Models/Constants/Types';

export default class ADXAdapter
    implements ITsiClientChartDataAdapter, IADXAdapter {
    protected adxAuthService: IAuthService;
    protected adxConnectionInformation: IADXConnection;

    constructor(
        adxAuthService: IAuthService,
        adxConnectionInformation: IADXConnection
    ) {
        this.adxConnectionInformation = adxConnectionInformation;
        this.adxAuthService = adxAuthService;
        this.adxAuthService.login();
    }

    async getTimeSeriesData(query: string) {
        const adapterMethodSandbox = new AdapterMethodSandbox(
            this.adxAuthService
        );

        return await adapterMethodSandbox.safelyFetchData(async (token) => {
            const getDataHistoryFromADX = () => {
                return axios({
                    method: 'post',
                    url: `${this.adxConnectionInformation.kustoClusterUrl}/v2/rest/query`,
                    headers: {
                        Authorization: 'Bearer ' + token,
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    },
                    data: {
                        db: this.adxConnectionInformation.kustoDatabaseName,
                        csl: `${this.adxConnectionInformation.kustoTableName} | ${query}))` /** example query: 
                        | where TimeStamp between (datetime(2020-09-07) .. datetime(2022-09-07))
                        | where Id contains "Car"
                        | where Key == "Speed"
                        | project Id, TimeStamp, Key, Value */
                    }
                });
            };

            try {
                // fetch data history of the properties using ADX api
                const adxDataHistoryResults = await getDataHistoryFromADX();
                adxDataHistoryResults.data?.map((result) => {
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
                        const mergedTimeStampAndValuePairs: Array<ADXTimeSeries> = [];
                        primaryResultFrames.forEach((rF) =>
                            rF.Rows.forEach((r) =>
                                mergedTimeStampAndValuePairs.push({
                                    timestamp: r[timeStampColumnIndex],
                                    value: r[valueColumnIndex]
                                })
                            )
                        );
                        return new ADXTimeSeriesData(
                            mergedTimeStampAndValuePairs
                        );
                    }
                });
            } catch (err) {
                adapterMethodSandbox.pushError({
                    type: ComponentErrorType.DataFetchFailed,
                    isCatastrophic: true,
                    rawError: err
                });
                return new ADXTimeSeriesData(null);
            }
        }, 'adx');
    }

    async getTsiclientChartDataShape(
        id: string,
        searchSpan: SearchSpan,
        properties: string[]
    ) {
        const adapterMethodSandbox = new AdapterMethodSandbox(
            this.adxAuthService
        );

        return await adapterMethodSandbox.safelyFetchData(async (token) => {
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
                    url: `${this.adxConnectionInformation.kustoClusterUrl}/v2/rest/query`,
                    headers: {
                        Authorization: 'Bearer ' + token,
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    },
                    data: {
                        db: this.adxConnectionInformation.kustoDatabaseName,
                        csl: `${
                            this.adxConnectionInformation.kustoTableName
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
                    type: ComponentErrorType.DataFetchFailed,
                    isCatastrophic: true,
                    rawError: err
                });
            }
        }, 'adx');
    }

    setADXConnectionInformation(adxConnectionInformation: IADXConnection) {
        this.adxConnectionInformation = adxConnectionInformation;
    }

    getADXConnectionInformation() {
        return this.adxConnectionInformation;
    }
}
