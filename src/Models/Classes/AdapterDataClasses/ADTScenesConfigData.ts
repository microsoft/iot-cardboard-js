import { IAdapterData } from '../../Constants/Interfaces';
import { IScenesConfig } from '../3DVConfig';

class ADTScenesConfigData implements IAdapterData {
    data: IScenesConfig;

    constructor(data: IScenesConfig) {
        this.data = data;
    }

    hasNoData() {
        return this.data === null || this.data === undefined;
    }
}

export default ADTScenesConfigData;
