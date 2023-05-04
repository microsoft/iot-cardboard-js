import AdapterResult from '../../../../../Models/Classes/AdapterResult';
import BaseAdapter from '../../BaseAdapter';
import { DataManagementAdapterData } from './Models/DataManagementAdapter.data';
import {
    IDataManagementAdapter,
    IIngestRow,
    ITable,
    ITableColumn,
    ITableIngestionMapping
} from './Models/DataManagementAdapter.types';

export default class MockDataManagementAdapter
    extends BaseAdapter
    implements IDataManagementAdapter {
    private networkTimeoutMillis;
    connectionString: string;

    constructor() {
        super();
        this.networkTimeoutMillis = 1000;
        this.connectionString =
            'https://mockConnectionString.westus.kusto.windows.net';
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

    async getClusters() {
        try {
            await this.mockNetwork();
            return new AdapterResult<DataManagementAdapterData<Array<string>>>({
                result: new DataManagementAdapterData([
                    'https://mockCluster1.eastus.kusto.windows.net',
                    'https://mockCluster2.westus.kusto.windows.net'
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
                        { columnName: 'Temperature', columnDataType: 'real' },
                        { columnName: 'FlowRate', columnDataType: 'real' },
                        { columnName: 'Pressure', columnDataType: 'real' }
                    ],
                    Rows: [
                        [
                            'Salt_Machine_01',
                            new Date().toISOString(),
                            Math.floor(Math.random() * 100),
                            null,
                            Math.floor(Math.random() * 100)
                        ],
                        [
                            'Salt_Machine_02',
                            new Date().toISOString(),
                            Math.floor(Math.random() * 100),
                            null,
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
