import * as BABYLON from 'babylonjs';
import { Vector3, AbstractMesh, Material } from 'babylonjs';
import {
    IScene,
    ITwinToObjectMapping,
    IVisual
} from '../Types/Generated/3DScenesConfiguration-v1.0.0';
import {
    DTwin,
    IADT3DViewerRenderMode
} from '../../Models/Constants/Interfaces';

export class SceneVisual {
    element: ITwinToObjectMapping;
    meshIds: string[];
    visuals: IVisual[];
    twins: Record<string, DTwin>;
    coloredMeshItems?: ColoredMeshItem[];

    constructor(
        element: ITwinToObjectMapping,
        meshIds: string[],
        visuals: IVisual[],
        twins: Record<string, DTwin>,
        coloredMeshItems?: ColoredMeshItem[]
    ) {
        this.element = element;
        this.meshIds = meshIds;
        this.coloredMeshItems = coloredMeshItems;
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
    zoomToMeshIds?: string[];
    hideUnzoomedMeshes?: boolean;
    showHoverOnSelected?: boolean;
    renderMode?: IADT3DViewerRenderMode;
}
