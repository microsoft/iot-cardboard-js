import axios from 'axios';
import AdapterMethodSandbox from '../../../../../Models/Classes/AdapterMethodSandbox';
import { ComponentErrorType } from '../../../../../Models/Constants/Enums';
import { IAuthService } from '../../../../../Models/Constants/Interfaces';
import { TIMESTAMP_COLUMN_NAME } from '../../../Components/DataPusher/DataPusher.types';
import BaseAdapter from '../../BaseAdapter';
import { DataManagementAdapterData } from './Models/DataManagementAdapter.data';
import {
    IDataManagementAdapter,
    IIngestRow,
    ITable,
    ITableColumn,
    ITableIngestionMapping
} from './Models/DataManagementAdapter.types';

export default class ADXAdapter
    extends BaseAdapter
    implements IDataManagementAdapter {
    connectionString: string;

    constructor(authService: IAuthService, connectionString: string) {
        super(authService);
        this.connectionString = connectionString;
        this.authService.login();
    }

    async getDatabases() {
        const adapterMethodSandbox = new AdapterMethodSandbox(this.authService);
        return await adapterMethodSandbox.safelyFetchData(async (token) => {
            const axiosResult = await axios({
                method: 'post',
                url: `${this.connectionString}/v1/rest/query`,
                headers: {
                    Authorization: 'Bearer ' + token,
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                data: {
                    csl: '.show databases | project DatabaseName'
                }
            }).catch((err) => {
                adapterMethodSandbox.pushError({
                    type: ComponentErrorType.DataFetchFailed,
                    isCatastrophic: true,
                    rawError: err
                });
                return null;
            });
            return new DataManagementAdapterData<Array<string>>(
                axiosResult?.data.Tables[0].Rows.reduce((acc, r) => {
                    acc.push(r[0]);
                    return acc;
                }, [])
            );
        }, 'adx');
    }

    async createDatabase(databaseName: string) {
        const adapterMethodSandbox = new AdapterMethodSandbox(this.authService);
        return await adapterMethodSandbox.safelyFetchData(async (armToken) => {
            const resourceResult = await axios({
                method: 'post',
                url:
                    'https://management.azure.com/providers/Microsoft.ResourceGraph/resources',
                headers: {
                    Authorization: 'Bearer ' + armToken,
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                params: { 'api-version': '2021-03-01' },
                data: {
                    query: `Resources | where type =~ 'Microsoft.Kusto/clusters' | where properties.uri =~ '${this.connectionString}' | project id, name, location, type, tenantId, subscriptionId | order by name asc`
                }
            }).catch((err) => {
                console.log(err);
                return null;
            });
            const resource = resourceResult?.data?.data[0];
            if (resource) {
                const putDatabase = await axios({
                    method: 'put',
                    url: `https://management.azure.com${resource.id}/databases/${databaseName}`,
                    headers: {
                        Authorization: 'Bearer ' + armToken,
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    },
                    params: { 'api-version': '2022-12-29' },
                    data: {
                        location: resource.location,
                        kind: 'ReadWrite'
                    }
                }).catch((err) => {
                    adapterMethodSandbox.pushError({
                        type: ComponentErrorType.DataUploadFailed,
                        isCatastrophic: true,
                        rawError: err
                    });
                    return null;
                });
                return new DataManagementAdapterData(putDatabase.data);
            }
        }, 'azureManagement');
    }

    async getTables(databaseName: string) {
        const adapterMethodSandbox = new AdapterMethodSandbox(this.authService);
        return await adapterMethodSandbox.safelyFetchData(async (token) => {
            const axiosResult = await axios({
                method: 'post',
                url: `${this.connectionString}/v1/rest/query`,
                headers: {
                    Authorization: 'Bearer ' + token,
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                data: {
                    db: databaseName,
                    csl: '.show tables | project TableName'
                }
            }).catch((err) => {
                adapterMethodSandbox.pushError({
                    type: ComponentErrorType.DataFetchFailed,
                    isCatastrophic: true,
                    rawError: err
                });
                return null;
            });
            return new DataManagementAdapterData<Array<string>>(
                axiosResult?.data.Tables[0].Rows.reduce((acc, r) => {
                    acc.push(r[0]);
                    return acc;
                }, [])
            );
        }, 'adx');
    }

    async createTable(
        databaseName: string,
        tableName: string,
        columns: Array<ITableColumn>,
        ingestionMappingName: string,
        ingestionMapping?: Array<ITableIngestionMapping>
    ) {
        const adapterMethodSandbox = new AdapterMethodSandbox(this.authService);
        return await adapterMethodSandbox.safelyFetchData(async (token) => {
            const createResult = await axios({
                method: 'post',
                url: `${this.connectionString}/v1/rest/mgmt`,
                headers: {
                    Authorization: 'Bearer ' + token,
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                data: {
                    db: databaseName,
                    csl: `.create table ${tableName} (`.concat(
                        columns.reduce(function (acc, curr, idx) {
                            acc = acc.concat(
                                `${curr.columnName}:${curr.columnDataType}`
                            );

                            if (idx < columns.length - 1) {
                                acc = acc + ', ';
                            }

                            return acc;
                        }, ''),
                        ')'
                    )
                }
            }).catch((err) => {
                adapterMethodSandbox.pushError({
                    type: ComponentErrorType.DataUploadFailed,
                    isCatastrophic: true,
                    rawError: err
                });
                return null;
            });
            let ingestionPolicyResult;
            if (createResult?.data) {
                ingestionPolicyResult = await axios({
                    method: 'post',
                    url: `${this.connectionString}/v1/rest/mgmt`,
                    headers: {
                        Authorization: 'Bearer ' + token,
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    },
                    data: {
                        db: databaseName,
                        csl: `.alter table ${tableName} policy streamingingestion enable`
                    }
                }).catch((err) => {
                    adapterMethodSandbox.pushError({
                        type: ComponentErrorType.DataUploadFailed,
                        isCatastrophic: true,
                        rawError: err
                    });
                    return null;
                });
            }
            let ingestionMappingResult;
            if (ingestionPolicyResult?.data) {
                ingestionMappingResult = await axios({
                    method: 'post',
                    url: `${this.connectionString}/v1/rest/mgmt`,
                    headers: {
                        Authorization: 'Bearer ' + token,
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    },
                    data: {
                        db: databaseName,
                        csl: `.create table ${tableName} ingestion json mapping '${ingestionMappingName}' '${JSON.stringify(
                            ingestionMapping
                                ? ingestionMapping
                                : columns.map(
                                      (c) =>
                                          ({
                                              column: c.columnName,
                                              path: `$.${c.columnName}`
                                          } as ITableIngestionMapping)
                                  )
                        )}'`
                    }
                }).catch((err) => {
                    adapterMethodSandbox.pushError({
                        type: ComponentErrorType.DataUploadFailed,
                        isCatastrophic: true,
                        rawError: err
                    });
                    return null;
                });
            }

            return new DataManagementAdapterData<boolean>(
                ingestionMappingResult?.data ? true : false
            );
        }, 'adx');
    }

    async upsertTable(
        databaseName: string,
        tableName: string,
        rows: Array<IIngestRow>,
        ingestionMappingName: string
    ) {
        const adapterMethodSandbox = new AdapterMethodSandbox(this.authService);
        return await adapterMethodSandbox.safelyFetchData(async (token) => {
            const axiosResult = await axios({
                method: 'post',
                url: `${this.connectionString}/v1/rest/ingest/${databaseName}/${tableName}`,
                headers: {
                    Authorization: 'Bearer ' + token,
                    Accept: 'application/json',
                    'Content-Type': 'text/plain'
                },
                params: {
                    streamFormat: 'JSON',
                    mappingName: ingestionMappingName
                },
                data: rows.reduce((acc, row, idx) => {
                    acc = acc.concat(JSON.stringify(row));
                    if (idx < rows.length - 1) {
                        acc = acc.concat('\n');
                    }
                    return acc;
                }, '')
            }).catch((err) => {
                adapterMethodSandbox.pushError({
                    type: ComponentErrorType.DataFetchFailed,
                    isCatastrophic: true,
                    rawError: err
                });
                return null;
            });
            return new DataManagementAdapterData<boolean>(
                axiosResult?.data ? true : false
            );
        }, 'adx');
    }

    async getTable(
        databaseName: string,
        tableName: string,
        orderByColumn: string = TIMESTAMP_COLUMN_NAME
    ) {
        const adapterMethodSandbox = new AdapterMethodSandbox(this.authService);
        return await adapterMethodSandbox.safelyFetchData(async (token) => {
            const axiosResult = await axios({
                method: 'post',
                url: `${this.connectionString}/v1/rest/query`,
                headers: {
                    Authorization: 'Bearer ' + token,
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                data: {
                    db: databaseName,
                    csl: `${tableName}${
                        orderByColumn ? ` | order by ${orderByColumn} desc` : ''
                    }`
                }
            }).catch((err) => {
                adapterMethodSandbox.pushError({
                    type: ComponentErrorType.DataFetchFailed,
                    isCatastrophic: true,
                    rawError: err
                });
                return null;
            });
            return new DataManagementAdapterData<ITable>({
                Columns: axiosResult?.data.Tables[0].Columns.reduce(
                    (acc: Array<ITableColumn>, r) => {
                        acc.push({
                            columnName: r.ColumnName,
                            columnDataType: r.ColumnType
                        });
                        return acc;
                    },
                    []
                ),
                Rows: axiosResult?.data.Tables[0].Rows
            });
        }, 'adx');
    }
}
