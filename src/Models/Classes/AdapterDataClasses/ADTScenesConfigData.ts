import { IAdapterData } from '../../Constants/Interfaces';
import { ScenesConfig } from '../3DVConfig';

class ADTScenesConfigData implements IAdapterData {
    data: ScenesConfig;

    constructor(data: ScenesConfig) {
        this.data = data;
    }

    hasNoData() {
        return this.data === null || this.data === undefined;
    }
}

export default ADTScenesConfigData;
