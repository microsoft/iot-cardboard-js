import { IAdapterData } from '../../Constants/Interfaces';
import { ScenesApiData } from '../../Constants/Types';

export class ScenesAdapterData implements IAdapterData {
    data: ScenesApiData;

    constructor(data: ScenesApiData) {
        this.data = data;
    }

    hasNoData() {
        return (
            this.data === undefined ||
            this.data === null ||
            this.data.value.length === 0
        );
    }
}
