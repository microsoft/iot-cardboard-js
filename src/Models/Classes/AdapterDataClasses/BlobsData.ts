import { IAdapterData, IBlobFile } from '../../Constants/Interfaces';

class BlobsData implements IAdapterData {
    data: Array<IBlobFile>;

    constructor(data: Array<IBlobFile>) {
        this.data = data;
    }

    hasNoData() {
        return this.data === null || this.data === undefined;
    }
}

export default BlobsData;
