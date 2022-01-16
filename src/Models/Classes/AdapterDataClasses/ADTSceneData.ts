import { IAdapterData } from '../../Constants/Interfaces';
import { IScene } from '../3DVConfig';

class ADTSceneData implements IAdapterData {
    data: IScene;

    constructor(data: IScene) {
        this.data = data;
    }

    hasNoData() {
        return this.data === null || this.data === undefined;
    }
}

export default ADTSceneData;
