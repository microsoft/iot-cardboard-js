import { IAdapterData } from '../../Constants/Interfaces';

type KeyValuePairData = Record<string, any>;

class KeyValuePairAdapterData implements IAdapterData {
    data: KeyValuePairData;

    constructor(data: KeyValuePairData) {
        this.data = data;
    }

    hasNoData() {
        return this.data === null;
    }
}

export default KeyValuePairAdapterData;
