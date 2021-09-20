import SceneViewLabel from "./SceneViewLabel";
import * as BABYLON from 'babylonjs';

export default class SceneViewData {
    modelRoot: string; 
    modelFile: string; 
    labels: SceneViewLabel[];
    cameraRadius: number;
    cameraCenter: BABYLON.Vector3;
}
