import { IAdapterData, IADTTwinComponent } from '../../Constants/Interfaces';

class ADTTwinComponentData implements IAdapterData {
    data: IADTTwinComponent;

    constructor(data: IADTTwinComponent) {
        this.data = data;
    }

    hasNoData() {
        return this.data === null || this.data === undefined;
    }
}

export default ADTTwinComponentData;
