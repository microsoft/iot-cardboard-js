import { IAdapterData } from '../../Constants/Interfaces';
import { ADTModelsData, ADTTwinsData } from '../../Constants/Types';

class ADTAdapterData implements IAdapterData {
    data: ADTModelsData | ADTTwinsData;

    constructor(data: ADTModelsData | ADTTwinsData) {
        this.data = data;
    }

    hasNoData() {
        return this.data === null || this.data.value.length === 0;
    }
}

export default ADTAdapterData;
