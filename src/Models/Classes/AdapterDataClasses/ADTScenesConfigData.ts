import { IAdapterData } from '../../Constants/Interfaces';
import { I3DScenesConfig } from '../../Types/Generated/3DScenesConfiguration-v1.0.0';

class ADTScenesConfigData implements IAdapterData {
    data: I3DScenesConfig;

    constructor(data: I3DScenesConfig) {
        this.data = data;
    }

    hasNoData() {
        return this.data === null || this.data === undefined;
    }
}

export default ADTScenesConfigData;
