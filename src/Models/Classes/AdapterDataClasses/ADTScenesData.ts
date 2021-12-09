import { IAdapterData } from '../../Constants/Interfaces';
import { Scene } from '../3DVConfig';

class ADTScenesData implements IAdapterData {
    data: Array<Scene>;

    constructor(data: Array<Scene>) {
        this.data = data;
    }

    hasNoData() {
        return (
            this.data === null ||
            this.data === undefined ||
            this.data.length === 0
        );
    }
}

export default ADTScenesData;
