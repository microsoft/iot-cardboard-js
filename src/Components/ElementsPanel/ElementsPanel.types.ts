import { SceneVisual } from '../../Models/Classes/SceneView.types';
import { ITwinToObjectMapping } from '../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';

export type SceneElementsModel = {
    elements: Array<{
        element: ITwinToObjectMapping;
        sceneVisuals: Array<SceneVisual>;
    }>;
};
