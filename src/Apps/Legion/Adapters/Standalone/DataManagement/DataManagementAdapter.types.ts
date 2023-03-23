import { IBaseAdapter } from '../../../Models/Interfaces';

export interface IDataManagementAdapter extends IBaseAdapter {
    connectionSource: any;
    pushData: (data: any) => void;
    getData: (params?: any) => void;
}
