import { IAdapterData } from '../../Constants/Interfaces';

class GithubSearchData implements IAdapterData {
    data: any;

    constructor(data: any) {
        this.data = data;
    }

    hasNoData() {
        return this.data === null || this.data === undefined;
    }
}

export default GithubSearchData;
