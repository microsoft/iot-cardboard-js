import { IAdapterData, IStorageContainer } from '../../Constants/Interfaces';

class StorageContainersData implements IAdapterData {
    data: Array<IStorageContainer>;

    constructor(data: Array<IStorageContainer>) {
        this.data = data;
    }

    hasNoData() {
        return !this.data;
    }
}

export default StorageContainersData;
