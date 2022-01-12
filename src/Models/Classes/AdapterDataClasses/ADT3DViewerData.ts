import { IAdapterData } from '../../Constants/Interfaces';
import { SceneVisual } from '../SceneView.types';

class ADT3DViewerData implements IAdapterData {
    data: { modelUrl: string; sceneVisuals: SceneVisual[] };

    constructor(modelUrl: string, sceneVisuals: SceneVisual[]) {
        this.data = { modelUrl: modelUrl, sceneVisuals: sceneVisuals };
    }

    hasNoData() {
        return (
            this.data?.modelUrl === null ||
            this.data?.sceneVisuals === undefined
        );
    }
}

export default ADT3DViewerData;
