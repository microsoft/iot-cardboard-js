import { IAdapterData, IADTTwin } from '../../Constants/Interfaces';

class ADTTwinData implements IAdapterData {
    data: IADTTwin;

    constructor(data: IADTTwin) {
        this.data = data;
    }

    hasNoData() {
        return this.data === null || this.data === undefined;
    }
}

export default ADTTwinData;
