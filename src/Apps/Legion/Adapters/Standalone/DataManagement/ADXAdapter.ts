import axios from 'axios';
import AdapterMethodSandbox from '../../../../../Models/Classes/AdapterMethodSandbox';
import { ComponentErrorType } from '../../../../../Models/Constants/Enums';
import { IAuthService } from '../../../../../Models/Constants/Interfaces';
import BaseAdapter from '../../BaseAdapter';
import { DataManagementAdapterData } from './Models/DataManagementAdapter.data';
import {
    IDataManagementAdapter,
    IGetDataAdapterParams,
    IPushDataAdapterParams
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

    /** fetches database list or table list based on params
     * TODO: explore function overloading
     */
    async getData(params: IGetDataAdapterParams) {
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
                    db: params.databaseName ? params.databaseName : null,
                    csl: !params.databaseName
                        ? '.show databases | project DatabaseName'
                        : !params.tableName
                        ? '.show tables | project TableName'
                        : `${params.tableName} | order by TimeStamp desc | take 100`
                }
            }).catch((err) => {
                adapterMethodSandbox.pushError({
                    type: ComponentErrorType.DataFetchFailed,
                    isCatastrophic: true,
                    rawError: err
                });
                return null;
            });
            return new DataManagementAdapterData<
                | Array<string>
                | { Columns: Array<string>; Rows: Array<Array<any>> }
            >(
                !params.databaseName || !params.tableName
                    ? axiosResult?.data.Tables[0].Rows.reduce((acc, r) => {
                          acc.push(r[0]);
                          return acc;
                      }, [])
                    : {
                          Columns: axiosResult?.data.Tables[0].Columns.reduce(
                              (acc, r) => {
                                  acc.push(r.ColumnName);
                                  return acc;
                              },
                              []
                          ),
                          Rows: axiosResult?.data.Tables[0].Rows
                      }
            );
        }, 'adx');
    }

    /** pushes data to a table using database name and table name in params */
    async pushData(params: IPushDataAdapterParams) {
        const adapterMethodSandbox = new AdapterMethodSandbox(this.authService);
        return await adapterMethodSandbox.safelyFetchData(async (token) => {
            const axiosResult = await axios({
                method: 'post',
                url: `${this.connectionSource}/v1/rest/ingest/{database}/{table}`,
                headers: {
                    Authorization: 'Bearer ' + token,
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                data: {
                    db: params.databaseName ? params.databaseName : null,
                    csl: params.data
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
                axiosResult?.data
            );
        }, 'adx');
    }
}
