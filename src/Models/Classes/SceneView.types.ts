import * as BABYLON from 'babylonjs';
import { Vector3, AbstractMesh, Material } from 'babylonjs';
import { DTwin } from '../../Models/Constants/Interfaces';
import { IScene, IVisual } from './3DVConfig';

export class SceneVisual {
    meshIds: string[];
    visuals: IVisual[];
    twins: Record<string, DTwin>;
    constructor(
        meshIds: string[],
        visuals: IVisual[],
        twins: Record<string, DTwin>
    ) {
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
    position?: Vector3;
    latitude?: number;
    longitude?: number;
    color: { r: number; g: number; b: number };
    isNav?: boolean;
    scene?: IScene;
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

export type SceneViewEventHandler = (
    marker: Marker,
    mesh: AbstractMesh,
    scene: BABYLON.Scene,
    e: PointerEvent
) => void;

export interface ISceneViewProp {
    modelUrl: string;
    markers?: Marker[];
    onSceneLoaded?: (scene: BABYLON.Scene) => void;
    onMarkerClick?: SceneViewEventHandler;
    onMarkerHover?: SceneViewEventHandler;
    onCameraMove?: SceneViewEventHandler;
    selectedMeshIds?: string[];
    showMeshesOnHover?: boolean;
    meshSelectionColor?: string;
    meshHoverColor?: string;
    meshSelectionHoverColor?: string;
    getToken?: () => Promise<string>;
    coloredMeshItems?: ColoredMeshItem[];
    isWireframe?: boolean;
    meshBaseColor?: { r: number; g: number; b: number; a: number };
    meshFresnelColor?: { r: number; g: number; b: number; a: number };
}
