import AdapterResult from '../../../../../Models/Classes/AdapterResult';
import BaseAdapter from '../../BaseAdapter';
import { DataManagementAdapterData } from './Models/DataManagementAdapter.data';
import {
    IDataManagementAdapter,
    IIngestRow,
    ITable,
    ITableColumn,
    ITableIngestionMapping,
    IGetDatabaseResponse
} from './Models/DataManagementAdapter.types';

export default class MockDataManagementAdapter
    extends BaseAdapter
    implements IDataManagementAdapter {
    private networkTimeoutMillis;
    connectionString: string;

    constructor() {
        super();
        this.networkTimeoutMillis = 2000;
        this.connectionString = 'mockConnectionString';
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

    async getDatabases() {
        try {
            await this.mockNetwork();
            return new AdapterResult<DataManagementAdapterData<Array<string>>>({
                result: new DataManagementAdapterData([
                    'MockDatabase1',
                    'MockDatabase2'
                ]),
                errorInfo: null
            });
        } catch (err) {
            return new AdapterResult<DataManagementAdapterData<Array<string>>>({
                result: null,
                errorInfo: { catastrophicError: err, errors: [err] }
            });
        }
    }

    async getTargetDatabases() {
        try {
            await this.mockNetwork();
            return new AdapterResult<
                DataManagementAdapterData<Array<IGetDatabaseResponse>>
            >({
                result: new DataManagementAdapterData([
                    {
                        id: 'mock-db-id-1',
                        name: 'My Estero DB'
                    },
                    {
                        id: 'mock-db-id-1',
                        name: 'Windfarm 2'
                    },
                    {
                        id: 'mock-db-id-1',
                        name: 'Houston Factory'
                    }
                ]),
                errorInfo: null
            });
        } catch (err) {
            return new AdapterResult<
                DataManagementAdapterData<Array<IGetDatabaseResponse>>
            >({
                result: null,
                errorInfo: { catastrophicError: err, errors: [err] }
            });
        }
    }

    async createDatabase(_databaseName: string) {
        try {
            await this.mockNetwork();
            return new AdapterResult<DataManagementAdapterData<boolean>>({
                result: new DataManagementAdapterData(true),
                errorInfo: null
            });
        } catch (err) {
            return new AdapterResult<DataManagementAdapterData<boolean>>({
                result: null,
                errorInfo: { catastrophicError: err, errors: [err] }
            });
        }
    }

    async getTables(_databaseName: string) {
        try {
            await this.mockNetwork();
            return new AdapterResult<DataManagementAdapterData<Array<string>>>({
                result: new DataManagementAdapterData([
                    'MockTable1',
                    'MockTable2'
                ]),
                errorInfo: null
            });
        } catch (err) {
            return new AdapterResult<DataManagementAdapterData<Array<string>>>({
                result: null,
                errorInfo: { catastrophicError: err, errors: [err] }
            });
        }
    }

    async createTable(
        _databaseName: string,
        _tableName: string,
        _columns: Array<ITableColumn>,
        _ingestionMappingName: string,
        _ingestionMapping?: Array<ITableIngestionMapping>
    ) {
        try {
            await this.mockNetwork();
            return new AdapterResult<DataManagementAdapterData<boolean>>({
                result: new DataManagementAdapterData(true),
                errorInfo: null
            });
        } catch (err) {
            return new AdapterResult<DataManagementAdapterData<boolean>>({
                result: null,
                errorInfo: { catastrophicError: err, errors: [err] }
            });
        }
    }

    async upsertTable(
        _databaseName: string,
        _tableName: string,
        _data: IIngestRow[],
        _ingestionMappingName: string
    ) {
        try {
            await this.mockNetwork();
            return new AdapterResult<DataManagementAdapterData<boolean>>({
                result: new DataManagementAdapterData(true),
                errorInfo: null
            });
        } catch (err) {
            return new AdapterResult<DataManagementAdapterData<boolean>>({
                result: null,
                errorInfo: { catastrophicError: err, errors: [err] }
            });
        }
    }

    async getTable(
        _databaseName: string,
        _tableName: string,
        _orderByColumn?: string
    ) {
        try {
            await this.mockNetwork();
            return new AdapterResult<DataManagementAdapterData<ITable>>({
                result: new DataManagementAdapterData({
                    Columns: [
                        { columnName: 'Id', columnDataType: 'string' },
                        { columnName: 'Timestamp', columnDataType: 'datetime' },
                        { columnName: 'Temperature', columnDataType: 'real' }
                    ],
                    Rows: [
                        [
                            'Salt_Machine_01',
                            new Date().toISOString(),
                            Math.floor(Math.random() * 100)
                        ],
                        [
                            'Salt_Machine_02',
                            new Date().toISOString(),
                            Math.floor(Math.random() * 100)
                        ]
                    ]
                }),
                errorInfo: null
            });
        } catch (err) {
            return new AdapterResult<DataManagementAdapterData<ITable>>({
                result: null,
                errorInfo: { catastrophicError: err, errors: [err] }
            });
        }
    }
}
