import * as BABYLON from 'babylonjs';
import { AbstractMesh, Material } from 'babylonjs';
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

export interface SelectedMesh {
    id: string;
    material: Material;
}

export class Marker {
    name: string;
    latitude?: number;
    longitude?: number;
    color: { r: number; g: number; b: number; a?: number };
    isNav?: boolean;
    scene?: Scene;
}

export type SceneViewCallbackHandler = (
    marker: Marker,
    mesh: AbstractMesh,
    scene: BABYLON.Scene,
    e: PointerEvent
) => void;

export interface ColoredMeshItem {
    meshId: string;
    color: string;
}

export interface ISceneViewProp {
    modelUrl: string;
    markers?: Marker[];
    onMarkerClick?: SceneViewCallbackHandler;
    onMarkerHover?: SceneViewCallbackHandler;
    onCameraMove?: SceneViewCallbackHandler;
    selectedMeshIds?: string[];
    showMeshesOnHover?: boolean;
    meshSelectionColor?: string;
    meshHoverColor?: string;
    meshSelectionHoverColor?: string;
    getToken?: () => Promise<string>;
    coloredMeshItems?: ColoredMeshItem[];
}
