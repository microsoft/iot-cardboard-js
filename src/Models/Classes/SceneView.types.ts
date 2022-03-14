import * as BABYLON from 'babylonjs';
import { Vector3, AbstractMesh, Material } from 'babylonjs';
import {
    IScene,
    IVisual
} from '../Types/Generated/3DScenesConfiguration-v1.0.0';
import {
    DTwin,
    IADT3DViewerRenderMode
} from '../../Models/Constants/Interfaces';

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
    getToken?: () => Promise<string>;
    coloredMeshItems?: ColoredMeshItem[];
    showHoverOnSelected?: boolean;
    renderMode?: IADT3DViewerRenderMode;
}
