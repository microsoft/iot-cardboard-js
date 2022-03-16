import {
    IAdapterData,
    IADTModel,
    IADTRelationship,
    IADTTwin,
} from '../../Constants/Interfaces';

class ADTTwinsData implements IAdapterData {
    data: IADTTwin[];

    constructor(data: IADTTwin[]) {
        this.data = data;
    }

    hasNoData() {
        return (
            this.data === null ||
            this.data === undefined ||
            this.data.length === 0
        );
    }
}

class ADTModelsData implements IAdapterData {
    data: IADTModel[];

    constructor(data: IADTModel[]) {
        this.data = data;
    }

    hasNoData() {
        return (
            this.data === null ||
            this.data === undefined ||
            this.data.length === 0
        );
    }
}

class ADTRelationshipsData implements IAdapterData {
    data: IADTRelationship[];

    constructor(data: IADTRelationship[]) {
        this.data = data;
    }

    hasNoData() {
        return (
            this.data === null ||
            this.data === undefined ||
            this.data.length === 0
        );
    }
}

export { ADTTwinsData, ADTModelsData, ADTRelationshipsData };
