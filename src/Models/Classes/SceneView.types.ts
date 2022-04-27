import * as BABYLON from '@babylonjs/core/Legacy/legacy';
import {
    Vector3,
    AbstractMesh,
    Material,
    IPointerEvent
} from '@babylonjs/core';
import {
    IBehavior,
    IScene,
    ITwinToObjectMapping
} from '../Types/Generated/3DScenesConfiguration-v1.0.0';
import {
    DTwin,
    IADTBackgroundColor,
    IADTObjectColor
} from '../../Models/Constants/Interfaces';
import { CameraInteraction } from '../Constants';

export class SceneVisual {
    element: ITwinToObjectMapping;
    behaviors: IBehavior[];
    twins: Record<string, DTwin>;
    coloredMeshItems?: CustomMeshItem[];
    alertBadgeGroup?: SceneViewBadgeGroup[];

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
    e: IPointerEvent
) => void;

export interface CustomMeshItem {
    meshId: string;
    color?: string;
}

export interface SceneViewBadge {
    id: string;
    meshId: string;
    color?: string;
    icon?: string;
}

export interface ColoredMeshGroup {
    meshId: string;
    colors: string[];
    currentColor: number;
}

export interface SceneViewBadgeGroup {
    id: string;
    meshId: string;
    badges: SceneViewBadge[];
    element: ITwinToObjectMapping;
    behaviors: IBehavior[];
    twins: Record<string, DTwin>;
}

export type SceneViewEventHandler = (
    marker: Marker,
    mesh: AbstractMesh,
    scene: BABYLON.Scene,
    e: PointerEvent
) => void;

export interface ICameraPosition {
    position: BABYLON.Vector3;
    target: BABYLON.Vector3;
    radius: number;
}

export interface ISceneViewProps {
    modelUrl?: string | 'Globe';
    markers?: Marker[];
    onSceneLoaded?: (scene: BABYLON.Scene) => void;
    onMeshClick?: SceneViewEventHandler;
    onMeshHover?: SceneViewEventHandler;
    onBadgeGroupHover?: (
        alert: SceneViewBadgeGroup,
        left: number,
        top: number
    ) => void;
    onCameraMove?: (position: ICameraPosition) => void;
    isWireframe?: boolean;
    showMeshesOnHover?: boolean;
    getToken?: () => Promise<string>;
    coloredMeshItems?: CustomMeshItem[];
    outlinedMeshitems?: CustomMeshItem[];
    zoomToMeshIds?: string[];
    unzoomedMeshOpacity?: number;
    showHoverOnSelected?: boolean;
    objectColors?: IADTObjectColor;
    badgeGroups?: SceneViewBadgeGroup[];
    backgroundColor?: IADTBackgroundColor;
    cameraInteractionType?: CameraInteraction;
    cameraPosition?: ICameraPosition;
}
