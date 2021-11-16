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
    position?: Vector3;
    latitude?: number;
    longitude?: number;
    color: Color3;
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
    onMarkerClick?: (
        marker: Marker,
        mesh: AbstractMesh,
        scene: Scene,
        e: PointerEvent
    ) => void;
    onMarkerHover?: (
        marker: Marker,
        mesh: AbstractMesh,
        scene: Scene,
        e: PointerEvent
    ) => void;
    labels?: SceneViewLabel[];
    children?: ChildTwin[];
}
