import { IAdapterData } from '../../Constants/Interfaces';
import { KeyValuePairData } from '../../Constants/Types';

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
