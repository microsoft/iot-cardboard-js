import { IAdapterData } from '../../Constants/Interfaces';
import { ADTModelsData, ADTTwinsData } from '../../Constants/Types';

export class ADTAdapterModelsData implements IAdapterData {
    data: ADTModelsData;

    constructor(data: ADTModelsData) {
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

export class ADTAdapterTwinsData implements IAdapterData {
    data: ADTTwinsData;

    constructor(data: ADTTwinsData) {
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
