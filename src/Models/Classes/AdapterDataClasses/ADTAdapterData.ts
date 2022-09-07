import { IAdapterData } from '../../Constants/Interfaces';
import { ADTModelsApiData, ADTTwinsApiData } from '../../Constants/Types';
import { DtdlInterface } from '../../Constants/dtdlInterfaces';

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

export class ADTAdapterSearchByQueryData implements IAdapterData {
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

interface IADTAdapterExpandedModelData {
    rootModel: DtdlInterface;
    expandedModels: DtdlInterface[];
}

export class ADTAdapterExpandedModelData implements IAdapterData {
    data: IADTAdapterExpandedModelData;

    constructor(data: IADTAdapterExpandedModelData) {
        this.data = data;
    }

    hasNoData() {
        return this.data === null || this.data === undefined;
    }
}

export class ADTAdapterPatchData implements IAdapterData {
    data: any;

    constructor(data: any) {
        this.data = data;
    }

    hasNoData() {
        return this.data === null || this.data === undefined;
    }
}
