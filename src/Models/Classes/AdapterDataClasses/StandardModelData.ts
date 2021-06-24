import {
    IAdapterData,
    IStandardModelIndexData
} from '../../Constants/Interfaces';
import { IStandardModelSearchResult } from '../../Constants/Interfaces';

class StandardModelSearchData implements IAdapterData {
    data: IStandardModelSearchResult;

    constructor(data: IStandardModelSearchResult) {
        this.data = data;
    }

    hasNoData() {
        return this.data === null || this.data === undefined;
    }
}

class StandardModelData implements IAdapterData {
    data: any;

    constructor(data: any) {
        this.data = data;
    }

    hasNoData() {
        return this.data === null || this.data === undefined;
    }
}

class StandardModelIndexData implements IAdapterData {
    data: IStandardModelIndexData;

    constructor(data: IStandardModelIndexData) {
        this.data = data;
    }

    hasNoData() {
        return this.data === null || this.data === undefined;
    }
}

export { StandardModelData, StandardModelSearchData, StandardModelIndexData };
