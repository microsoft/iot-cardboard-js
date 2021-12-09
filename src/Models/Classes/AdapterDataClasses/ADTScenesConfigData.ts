import { IAdapterData } from '../../Constants/Interfaces';
import { ViewerConfiguration } from '../3DVConfig';

class ADTScenesConfigData implements IAdapterData {
    data: ViewerConfiguration;

    constructor(data: ViewerConfiguration) {
        this.data = data;
    }

    hasNoData() {
        return this.data === null || this.data === undefined;
    }
}

export default ADTScenesConfigData;
