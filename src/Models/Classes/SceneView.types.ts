import { Vector3, Color3, AbstractMesh, Scene } from 'babylonjs';

export class SceneViewLabel {
    metric: string;
    value: number;
    meshIds: string[];
    color: string;
}

export class SelectedMesh {
    id: string;
    color: Color3;
}

export class Marker {
    id?: string;
    name: string;
    position?: Vector3;
    latitude?: number;
    longitude?: number;
    color: { r: number; g: number; b: number };
    isNav?: boolean;
}

export type SceneViewCallbackHandler = (
    marker: Marker,
    mesh: AbstractMesh,
    scene: Scene,
    e: PointerEvent
) => void;

export interface ISceneViewProp {
    modelUrl: string;
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
    onCameraMove?: (
        marker: Marker,
        mesh: AbstractMesh,
        scene: Scene,
        e: PointerEvent
    ) => void;
    labels?: SceneViewLabel[];
    selectedMeshes?: string[];
    showMeshesOnHover?: boolean;
    meshSelectionColor?: string;
    meshHoverColor?: string;
}
