import axios from 'axios';
import AdapterMethodSandbox from '../../../../../Models/Classes/AdapterMethodSandbox';
import { ComponentErrorType } from '../../../../../Models/Constants/Enums';
import { IAuthService } from '../../../../../Models/Constants/Interfaces';
import BaseAdapter from '../../BaseAdapter';
import { DataManagementAdapterData } from './Models/DataManagementAdapter.data';
import {
    IDataManagementAdapter,
    IIngestRow,
    ITable
} from './Models/DataManagementAdapter.types';

export default class ADXAdapter
    extends BaseAdapter
    implements IDataManagementAdapter {
    connectionSource: string;

    constructor(authService: IAuthService, connectionSource: string) {
        super(authService);
        this.connectionSource = connectionSource;
        this.authService.login();
    }
    async getDatabases() {
        const adapterMethodSandbox = new AdapterMethodSandbox(this.authService);
        return await adapterMethodSandbox.safelyFetchData(async (token) => {
            const axiosResult = await axios({
                method: 'post',
                url: `${this.connectionSource}/v1/rest/query`,
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
                    query: `Resources | where type =~ 'Microsoft.Kusto/clusters' | where properties.uri =~ '${this.connectionSource}' | project id, name, location, type, tenantId, subscriptionId | order by name asc`
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
                url: `${this.connectionSource}/v1/rest/query`,
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

    async createTable(_databaseName: string, _tableName: string) {
        const adapterMethodSandbox = new AdapterMethodSandbox(this.authService);
        return await adapterMethodSandbox.safelyFetchData(async (token) => {
            console.log('Not implemented.');
            return new DataManagementAdapterData<boolean>(true);
        }, 'adx');
    }

    async upsertTable(
        databaseName: string,
        tableName: string,
        data: Array<IIngestRow>
    ) {
        const adapterMethodSandbox = new AdapterMethodSandbox(this.authService);
        return await adapterMethodSandbox.safelyFetchData(async (token) => {
            console.log('Not implemented.');
            const axiosResult = await axios({
                method: 'post',
                url: `${this.connectionSource}/v1/rest/ingest/${databaseName}/${tableName}`,
                headers: {
                    Authorization: 'Bearer ' + token,
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Host: new URL(this.connectionSource).hostname
                },
                params: { streamFormat: 'JSON' },
                data: {
                    data
                }
            }).catch((err) => {
                adapterMethodSandbox.pushError({
                    type: ComponentErrorType.DataFetchFailed,
                    isCatastrophic: true,
                    rawError: err
                });
                return null;
            });
            return new DataManagementAdapterData<boolean>(true);
        }, 'adx');
    }

    async getTable(databaseName: string, tableName: string) {
        const adapterMethodSandbox = new AdapterMethodSandbox(this.authService);
        return await adapterMethodSandbox.safelyFetchData(async (token) => {
            const axiosResult = await axios({
                method: 'post',
                url: `${this.connectionSource}/v1/rest/query`,
                headers: {
                    Authorization: 'Bearer ' + token,
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                data: {
                    db: databaseName,
                    csl: `${tableName} | order by TimeStamp desc | take 100`
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
                    (acc, r) => {
                        acc.push(r.ColumnName);
                        return acc;
                    },
                    []
                ),
                Rows: axiosResult?.data.Tables[0].Rows
            });
        }, 'adx');
    }
}
