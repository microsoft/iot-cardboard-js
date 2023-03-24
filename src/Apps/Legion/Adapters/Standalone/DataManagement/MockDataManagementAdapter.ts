import AdapterResult from '../../../../../Models/Classes/AdapterResult';
import BaseAdapter from '../../BaseAdapter';
import { DataManagementAdapterData } from './Models/DataManagementAdapter.data';
import {
    IDataManagementAdapter,
    IGetDataAdapterParams,
    IPushDataAdapterParams
} from './Models/DataManagementAdapter.types';

export default class MockDataManagementAdapter
    extends BaseAdapter
    implements IDataManagementAdapter {
    private networkTimeoutMillis;
    connectionSource: string;

    constructor() {
        super();
        this.networkTimeoutMillis = 0;
        this.connectionSource = 'mockConnectionString';
    }

    async mockNetwork() {
        // If mocking network latency, wait for networkTimeoutMillis
        if (this.networkTimeoutMillis > 0) {
            await new Promise((resolve) => {
                setTimeout(() => {
                    resolve(null);
                }, this.networkTimeoutMillis);
            });
        }
    }

    async getData(params: IGetDataAdapterParams) {
        try {
            await this.mockNetwork();
            return new AdapterResult<
                DataManagementAdapterData<
                    | Array<string>
                    | { Columns: Array<string>; Rows: Array<Array<any>> }
                >
            >({
                result: new DataManagementAdapterData(
                    !params.databaseName
                        ? ['MockDatabase1', 'MockDatabase2']
                        : !params.tableName
                        ? ['MockTable1', 'MockTable2']
                        : {
                              Columns: ['Timestamp'],
                              Rows: [['mockTimestamp1'], ['mockTimestamp2']]
                          }
                ),
                errorInfo: null
            });
        } catch (err) {
            return new AdapterResult<DataManagementAdapterData<Array<string>>>({
                result: null,
                errorInfo: { catastrophicError: err, errors: [err] }
            });
        }
    }

    async pushData(params: IPushDataAdapterParams) {
        try {
            await this.mockNetwork();
            return new AdapterResult<DataManagementAdapterData<Array<string>>>({
                result: new DataManagementAdapterData(
                    params.data as Array<string>
                ),
                errorInfo: null
            });
        } catch (err) {
            return new AdapterResult<DataManagementAdapterData<Array<string>>>({
                result: null,
                errorInfo: { catastrophicError: err, errors: [err] }
            });
        }
    }
}
