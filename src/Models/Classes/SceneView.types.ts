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
import { CameraInteraction, ViewerObjectStyle } from '../Constants';

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

export interface Marker {
    name: string;
    id: string;
    UIElement: any;
    GroupedUIElement?: any;
    position?: Vector3;
    attachedMeshIds?: string[];
    showIfOccluded?: boolean;
    latitude?: number;
    longitude?: number;
    scene?: IScene;
}

export type SceneViewCallbackHandler = (
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
    backgroundColor?: IADTBackgroundColor;
    badgeGroups?: SceneViewBadgeGroup[];
    cameraInteractionType?: CameraInteraction;
    cameraPosition?: ICameraPosition;
    coloredMeshItems?: CustomMeshItem[];
    getToken?: () => Promise<string>;
    markers?: Marker[];
    modelUrl?: string | 'Globe';
    objectColor?: IADTObjectColor;
    objectColorOptions?: IADTObjectColor[];
    objectStyle?: ViewerObjectStyle;
    onBadgeGroupHover?: (
        alert: SceneViewBadgeGroup,
        left: number,
        top: number
    ) => void;
    onCameraMove?: (position: ICameraPosition) => void;
    onMeshClick?: SceneViewEventHandler;
    onMeshHover?: SceneViewEventHandler;
    onSceneLoaded?: (scene: BABYLON.Scene) => void;
    outlinedMeshitems?: CustomMeshItem[];
    showHoverOnSelected?: boolean;
    showMeshesOnHover?: boolean;
    unzoomedMeshOpacity?: number;
    zoomToMeshIds?: string[];
}
