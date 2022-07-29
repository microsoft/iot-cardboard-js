import { ModelDict } from 'azure-iot-dtdl-parser';
import { DtdlInterface } from '../../Constants';
import { IAdapterData, IADTModel } from '../../Constants/Interfaces';

class ADTModelData implements IAdapterData {
    data: IADTModel;

    constructor(data: IADTModel) {
        this.data = data;
    }

    hasNoData() {
        return this.data === null || this.data === undefined;
    }
}

export class ADTAllModelsData implements IAdapterData {
    data: {
        rawModels: DtdlInterface[];
        parsedModels: ModelDict;
    };

    constructor(data: { rawModels: DtdlInterface[]; parsedModels: ModelDict }) {
        this.data = data;
    }

    hasNoData() {
        return !this.data?.parsedModels || !this.data?.rawModels;
    }
}

export class ADTTwinToModelMappingData implements IAdapterData {
    data: {
        twinId: string;
        modelId: string;
    };

    constructor(data: { twinId: string; modelId: string }) {
        this.data = data;
    }

    hasNoData() {
        return !this.data?.twinId || !this.data?.modelId;
    }
}

export default ADTModelData;
