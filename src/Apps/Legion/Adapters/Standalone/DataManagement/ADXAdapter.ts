import {
    IADXConnection,
    IAuthService
} from '../../../../../Models/Constants/Interfaces';
import BaseAdapter from '../../BaseAdapter';
import { IDataManagementAdapter } from './DataManagementAdapter.types';

export default class ADXAdapter
    extends BaseAdapter
    implements IDataManagementAdapter {
    connectionSource: IADXConnection;

    constructor(authService: IAuthService, connectionSource: IADXConnection) {
        super(authService);
        this.connectionSource = connectionSource;
        this.authService.login();
    }

    pushData: (data: any) => void;
    getData: (params?: any) => void;
}
