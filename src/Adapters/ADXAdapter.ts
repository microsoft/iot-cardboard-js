import {
    IADXAdapter,
    IADXConnection,
    IAuthService
} from '../Models/Constants/Interfaces';
import AdapterMethodSandbox from '../Models/Classes/AdapterMethodSandbox';
import { ADXTableColumns, ComponentErrorType } from '../Models/Constants/Enums';
import axios from 'axios';
import ADXTimeSeriesData from '../Models/Classes/AdapterDataClasses/ADXTimeSeriesData';
import {
    ADXTable,
    ADXTimeSeries,
    ADXTimeSeriesTableRow,
    TimeSeriesData
} from '../Models/Constants/Types';
import { getDebugLogger, isValidADXClusterUrl } from '../Models/Services/Utils';

const debugLogging = false;
const logDebugConsole = getDebugLogger('ADXAdapter', debugLogging);

export default class ADXAdapter implements IADXAdapter {
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

    async getTimeSeriesData(
        seriesIds: Array<string>,
        query: string,
        connection?: IADXConnection
    ) {
        const adapterMethodSandbox = new AdapterMethodSandbox(
            this.adxAuthService
        );

        return await adapterMethodSandbox.safelyFetchData(async (token) => {
            const clusterUrl = connection
                ? connection.kustoClusterUrl
                : this.adxConnectionInformation.kustoClusterUrl;

            if (!isValidADXClusterUrl(clusterUrl)) {
                logDebugConsole(
                    'error',
                    'Error(s) thrown: Cluster url is not valid!'
                );
                adapterMethodSandbox.pushError({
                    type: ComponentErrorType.DataFetchFailed,
                    isCatastrophic: true
                });
            }

            const getDataHistoryFromADX = () => {
                return axios({
                    method: 'post',
                    url: `${clusterUrl}/v2/rest/query`,
                    headers: {
                        Authorization: 'Bearer ' + token,
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    },
                    data: {
                        db: connection
                            ? connection.kustoDatabaseName
                            : this.adxConnectionInformation.kustoDatabaseName,
                        csl: query
                    }
                });
            };

            try {
                logDebugConsole(
                    'debug',
                    '[START] Fetching data history from cluster for query: ',
                    query
                );
                // fetch data history of the properties using ADX api
                const adxDataHistoryResults = await getDataHistoryFromADX();
                const resultTimeSeriesData: Array<ADXTimeSeries> = []; // considering there is going to be multiple series to fetch data for

                if (adxDataHistoryResults.data && adxDataHistoryResults.data.data) {
                    const primaryResultTables: Array<ADXTable> = adxDataHistoryResults.data.data.filter(
                        (frame) => frame.TableKind === 'PrimaryResult'
                    );
                    logDebugConsole(
                        'debug',
                        '[END] Number of tables fetched: ',
                        primaryResultTables.length
                    );
                    primaryResultTables.forEach((table, idx) => {
                        logDebugConsole(
                            'debug',
                            `Table-${idx} has ${table.Rows.length} rows.`
                        );
                        const timeStampColumnIndex = table.Columns.findIndex(
                            (c) => c.ColumnName === ADXTableColumns.TimeStamp
                        );
                        const idColumnIndex = table.Columns.findIndex(
                            (c) => c.ColumnName === ADXTableColumns.Id
                        );
                        const keyColumnIndex = table.Columns.findIndex(
                            (c) => c.ColumnName === ADXTableColumns.Key
                        );
                        const valueColumnIndex = table.Columns.findIndex(
                            (c) => c.ColumnName === ADXTableColumns.Value
                        );
                        const tableTimeSeriesData: Array<ADXTimeSeriesTableRow> = [];

                        table.Rows.forEach((r) =>
                            tableTimeSeriesData.push({
                                timestamp: r[timeStampColumnIndex],
                                id: r[idColumnIndex],
                                key: r[keyColumnIndex],
                                value: r[valueColumnIndex]
                            } as ADXTimeSeriesTableRow)
                        );

                        if (tableTimeSeriesData.length) {
                            // each table has same id and key in current design of querying for data history for twin id and property
                            resultTimeSeriesData.push({
                                seriesId: seriesIds[idx],
                                id: tableTimeSeriesData[0].id,
                                key: tableTimeSeriesData[0].key,
                                data: tableTimeSeriesData.reduce(
                                    (acc: Array<TimeSeriesData>, cur) => {
                                        acc.push({
                                            timestamp: cur.timestamp, // note that date is in UTC
                                            value: cur.value
                                        });
                                        return acc;
                                    },
                                    []
                                )
                            });
                        }
                    });
                }
                return new ADXTimeSeriesData(resultTimeSeriesData);
            } catch (err) {
                if (err?.request.status === 0) {
                    adapterMethodSandbox.pushError({
                        type: ComponentErrorType.ConnectionError,
                        isCatastrophic: true,
                        rawError: err
                    });
                } else {
                    switch (err?.response?.status) {
                        case 400:
                            adapterMethodSandbox.pushError({
                                type: ComponentErrorType.BadRequestException,
                                isCatastrophic: true,
                                rawError: err
                            });
                            break;
                        case 403:
                            adapterMethodSandbox.pushError({
                                type: ComponentErrorType.UnauthorizedAccess,
                                isCatastrophic: true,
                                rawError: err
                            });
                            break;
                        default:
                            adapterMethodSandbox.pushError({
                                type: ComponentErrorType.DataFetchFailed,
                                isCatastrophic: true,
                                rawError: err
                            });
                    }
                }
                logDebugConsole(
                    'error',
                    'Error(s) thrown time series data. {err}',
                    err
                );
                return new ADXTimeSeriesData(null);
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
