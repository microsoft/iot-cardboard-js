import { IAdapterData } from '../../Constants/Interfaces';
import { Config } from '../3DVConfig';

class ADTScenesConfigData implements IAdapterData {
    data: Config;

    constructor(data: Config) {
        this.data = data;
    }

    hasNoData() {
        return this.data === null || this.data === undefined;
    }
}

export default ADTScenesConfigData;
