import { IAdapterData, IADTModel, IADTTwin } from '../../Constants/Interfaces';

class ADTTwinLookupData implements IAdapterData {
    data: { twin: IADTTwin; model: IADTModel };

    constructor(twin: IADTTwin, model: IADTModel) {
        this.data = { twin: twin, model: model };
    }

    hasNoData() {
        return this.data?.twin === null || this.data?.model === undefined;
    }
}

export default ADTTwinLookupData;
