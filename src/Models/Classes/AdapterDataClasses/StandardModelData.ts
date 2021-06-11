import { IAdapterData } from '../../Constants/Interfaces';
import { StandardModelSearchResult } from '../../Constants/Interfaces';

class StandardModelSearchData implements IAdapterData {
    data: StandardModelSearchResult;

    constructor(data: StandardModelSearchResult) {
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

export { StandardModelData, StandardModelSearchData };
