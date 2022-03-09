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
    color: string;
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
    color?: string;
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
    onMeshClick?: SceneViewEventHandler;
    onMeshHover?: SceneViewEventHandler;
    onCameraMove?: SceneViewEventHandler;
    showMeshesOnHover?: boolean;
    defaultColoredMeshColor?: string;
    meshHoverColor?: string;
    defaultColoredMeshHoverColor?: string;
    isWireframe?: boolean;
    meshBaseColor?: string;
    meshFresnelColor?: string;
    meshOpacity?: number;
    getToken?: () => Promise<string>;
    coloredMeshItems?: ColoredMeshItem[];
    showHoverOnSelected?: boolean;
}
