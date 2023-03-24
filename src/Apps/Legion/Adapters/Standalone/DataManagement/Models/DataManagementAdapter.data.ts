import { IAdapterData } from '../../../../../../Models/Constants/Interfaces';

export class DataManagementAdapterData<T> implements IAdapterData {
    data: T;

    constructor(data: T) {
        this.data = data;
    }

    hasNoData() {
        return this.data === null || this.data === undefined;
    }
}
