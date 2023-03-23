import BaseAdapter from '../../BaseAdapter';
import { IDataManagementAdapter } from './DataManagementAdapter.types';

export default class MockDataManagementAdapter
    extends BaseAdapter
    implements IDataManagementAdapter {
    connectionSource: any;

    constructor(connectionSource: string) {
        super();
        this.connectionSource = connectionSource;
    }

    pushData: (data: any) => void;
    getData: (params?: any) => void;
}
