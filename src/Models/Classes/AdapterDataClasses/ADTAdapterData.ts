import { IAdapterData } from '../../Constants/Interfaces';
import { ADTModelsApiData, ADTTwinsApiData } from '../../Constants/Types';

export class ADTAdapterModelsData implements IAdapterData {
    data: ADTModelsApiData;

    constructor(data: ADTModelsApiData) {
        this.data = data;
    }

    hasNoData() {
        return (
            this.data === undefined ||
            this.data === null ||
            this.data.value?.length === 0
        );
    }
}

export class ADTAdapterTwinsData implements IAdapterData {
    data: ADTTwinsApiData;

    constructor(data: ADTTwinsApiData) {
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
