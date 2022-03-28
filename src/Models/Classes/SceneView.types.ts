import * as BABYLON from 'babylonjs';
import { Vector3, AbstractMesh, Material } from 'babylonjs';
import {
    IBehavior,
    IScene,
    ITwinToObjectMapping
} from '../Types/Generated/3DScenesConfiguration-v1.0.0';
import { DTwin, IADTObjectColor } from '../../Models/Constants/Interfaces';

export class SceneVisual {
    element: ITwinToObjectMapping;
    behaviors: IBehavior[];
    twins: Record<string, DTwin>;
    coloredMeshItems?: CustomMeshItem[];
    alertBadges?: SceneViewBadge[];

    constructor(
        element: ITwinToObjectMapping,
        behaviors: IBehavior[],
        twins: Record<string, DTwin>,
        coloredMeshItems?: CustomMeshItem[]
    ) {
        this.element = element;
        this.coloredMeshItems = coloredMeshItems;
        this.behaviors = behaviors;
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

export interface CustomMeshItem {
    meshId: string;
    color?: string;
}

export interface SceneViewBadge {
    meshId: string;
    color?: string;
    icon?: string;
    iconColor?: string;
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
    isWireframe?: boolean;
    showMeshesOnHover?: boolean;
    getToken?: () => Promise<string>;
    coloredMeshItems?: CustomMeshItem[];
    outlinedMeshitems?: CustomMeshItem[];
    zoomToMeshIds?: string[];
    unzoomedMeshOpacity?: number;
    showHoverOnSelected?: boolean;
    objectColors?: IADTObjectColor;
    badges?: SceneViewBadge[];
}
