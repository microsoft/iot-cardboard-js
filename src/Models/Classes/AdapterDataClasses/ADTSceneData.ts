import { IAdapterData } from '../../Constants/Interfaces';
import { Scene } from '../3DVConfig';

class ADTSceneData implements IAdapterData {
    data: Scene;

    constructor(data: Scene) {
        this.data = data;
    }

    hasNoData() {
        return this.data === null || this.data === undefined;
    }
}

export default ADTSceneData;
