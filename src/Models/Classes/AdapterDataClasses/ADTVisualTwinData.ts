import { IAdapterData } from '../../Constants/Interfaces';
import SceneViewLabel from '../SceneViewLabel';

class ADTVisualTwinData implements IAdapterData {
    data: { modelUrl: string; labels: SceneViewLabel[] };

    constructor(modelUrl: string, labels: SceneViewLabel[] ) {
        this.data = { modelUrl: modelUrl, labels: labels };
    }

    hasNoData() {
        return this.data?.modelUrl === null || this.data?.labels === undefined;
    }
}

export default ADTVisualTwinData;
