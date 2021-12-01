import { Vector3, Color3, AbstractMesh, Scene } from 'babylonjs';

export class SceneViewLabel {
    metric: string;
    value: number;
    meshId: string;
    color: string;
}

export class SelectedMesh {
    id: string;
    color: Color3;
}

export class Marker {
    name: string;
    latitude?: number;
    longitude?: number;
    color: { r: number; g: number; b: number; a?: number };
    isNav?: boolean;
}

export class ChildTwin {
    name: string;
    position: string;
}

export type SceneViewCallbackHandler = (
    marker: Marker,
    mesh: AbstractMesh,
    scene: Scene,
    e: PointerEvent
) => void;

export interface ISceneViewProp {
    modelUrl: string;
    cameraRadius: number;
    cameraCenter?: Vector3;
    markers?: Marker[];
    onMarkerClick?: SceneViewCallbackHandler;
    onMarkerHover?: SceneViewCallbackHandler;
    onCameraMove?: SceneViewCallbackHandler;
    labels?: SceneViewLabel[];
    children?: ChildTwin[];
}
