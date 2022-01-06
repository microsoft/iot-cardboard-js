import * as BABYLON from 'babylonjs';
import { Vector3, Color3, AbstractMesh } from 'babylonjs';
import { Scene, Visual } from './3DVConfig';

export class SceneVisual {
    meshIds: string[];
    visuals: Visual[];
    twins: any;
    constructor(meshIds: string[], visuals: Visual[], twins: any) {
        this.meshIds = meshIds;
        this.visuals = visuals;
        this.twins = twins;
    }
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
    color: { r: number; g: number; b: number };
    isNav?: boolean;
    scene?: Scene;
}

export type SceneViewCallbackHandler = (
    marker: Marker,
    mesh: AbstractMesh,
    scene: BABYLON.Scene,
    e: PointerEvent
) => void;

export interface ISceneViewProp {
    modelUrl: string;
    markers?: Marker[];
    onMarkerClick?: (
        marker: Marker,
        mesh: AbstractMesh,
        scene: BABYLON.Scene,
        e: PointerEvent
    ) => void;
    onMarkerHover?: (
        marker: Marker,
        mesh: AbstractMesh,
        scene: BABYLON.Scene,
        e: PointerEvent
    ) => void;
    onCameraMove?: (
        marker: Marker,
        mesh: AbstractMesh,
        scene: BABYLON.Scene,
        e: PointerEvent
    ) => void;
    sceneVisuals?: SceneVisual[];
    selectedMeshIds?: string[];
    showMeshesOnHover?: boolean;
    meshSelectionColor?: string;
    meshHoverColor?: string;
    getToken?: () => Promise<string>;
}
