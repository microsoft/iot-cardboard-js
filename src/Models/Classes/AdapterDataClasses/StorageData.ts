import {
    IAdapterData,
    IBlobServiceCorsRule,
    IStorageBlob,
    IStorageContainer
} from '../../Constants/Interfaces';

export class StorageBlobsData implements IAdapterData {
    data: Array<IStorageBlob>;

    constructor(data: Array<IStorageBlob>) {
        this.data = data;
    }

    hasNoData() {
        return this.data === null || this.data === undefined;
    }
}

export class StorageContainersData implements IAdapterData {
    data: Array<IStorageContainer>;

    constructor(data: Array<IStorageContainer>) {
        this.data = data;
    }

    hasNoData() {
        return !this.data;
    }
}

export class StorageBlobServiceCorsRulesData implements IAdapterData {
    data: Array<IBlobServiceCorsRule> | ''; // emptry string is returned from API when we set the cors properties

    constructor(data: Array<IBlobServiceCorsRule> | '') {
        this.data = data;
    }

    hasNoData() {
        return !this.data;
    }
}
