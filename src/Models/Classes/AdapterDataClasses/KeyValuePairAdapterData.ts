import { IAdapterData } from '../../Constants/Interfaces';
import { KeyValuePairData } from '../../Constants/Types';

class KeyValuePairAdapterData implements IAdapterData {
    data: Array<KeyValuePairData>;

    constructor(data: Array<KeyValuePairData>) {
        this.data = data;
    }

    hasNoData() {
        return (
            this.data === null ||
            this.data.length === 0 ||
            !this.data.reduce((acc, curr) => {
                return acc || curr.value;
            }, false)
        );
    }
}

export default KeyValuePairAdapterData;
