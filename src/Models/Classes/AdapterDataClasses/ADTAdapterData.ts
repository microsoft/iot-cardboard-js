import { IAdapterData } from '../../Constants/Interfaces';
import { ADTModelsData, ADTwinsData } from '../../Constants/Types';

class ADTAdapterData implements IAdapterData {
    data: ADTModelsData | ADTwinsData;

    constructor(data: ADTModelsData | ADTwinsData) {
        this.data = data;
    }

    hasNoData() {
        return this.data === null || this.data.value.length === 0;
    }
}

export default ADTAdapterData;
