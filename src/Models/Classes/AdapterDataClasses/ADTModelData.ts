import { IAdapterData, IADTModel } from '../../Constants/Interfaces';

class ADTModelData implements IAdapterData {
    data: IADTModel;

    constructor(data: IADTModel) {
        this.data = data;
    }

    hasNoData() {
        return this.data === null || this.data === undefined;
    }
}

export default ADTModelData;
