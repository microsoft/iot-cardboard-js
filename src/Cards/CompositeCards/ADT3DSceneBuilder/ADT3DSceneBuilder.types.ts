import ADTandBlobAdapter from '../../../Adapters/ADTandBlobAdapter';
import MockAdapter from '../../../Adapters/MockAdapter';
import {
    IBehavior,
    ITwinToObjectMapping,
    IScenesConfig,
    IWidgetLibraryItem,
    IWidget
} from '../../../Models/Classes/3DVConfig';
import { ColoredMeshItem } from '../../../Models/Classes/SceneView.types';
import {
    ADT3DSceneBuilderMode,
    ADT3DSceneTwinBindingsMode,
    Locale,
    Theme,
    WidgetFormMode
} from '../../../Models/Constants/Enums';
import { IConsumeCompositeCardProps } from '../../../Models/Constants/Interfaces';

// START of Actions
export const SET_ADT_SCENE_CONFIG = 'SET_ADT_SCENE_CONFIG';
export const SET_ADT_SCENE_BUILDER_ELEMENTS = 'SET_ADT_SCENE_BUILDER_ELEMENTS';
export const SET_ADT_SCENE_BUILDER_BEHAVIORS =
    'SET_ADT_SCENE_BUILDER_BEHAVIORS';
export const SET_ADT_SCENE_BUILDER_SELECTED_ELEMENTS =
    'SET_ADT_SCENE_BUILDER_SELECTED_ELEMENTS';
export const SET_ADT_SCENE_BUILDER_SELECTED_ELEMENT =
    'SET_ADT_SCENE_BUILDER_SELECTED_ELEMENT';
export const SET_ADT_SCENE_BUILDER_SELECTED_BEHAVIOR =
    'SET_ADT_SCENE_BUILDER_SELECTED_BEHAVIOR';
export const SET_ADT_SCENE_ELEMENT_SELECTED_OBJECT_IDS =
    'SET_ADT_SCENE_ELEMENT_SELECTED_OBJECT_IDS';
export const SET_ADT_SCENE_BUILDER_COLORED_MESH_ITEMS =
    'SET_ADT_SCENE_BUILDER_COLORED_MESH_ITEMST';
export const SET_ADT_SCENE_BUILDER_MODE = 'SET_ADT_SCENE_BUILDER_MODE';
// END of Actions

export interface IADT3DSceneBuilderCardProps
    extends IConsumeCompositeCardProps {
    adapter: ADTandBlobAdapter | MockAdapter;
    sceneId: string;
}

export interface I3DSceneBuilderContext {
    adapter: ADTandBlobAdapter | MockAdapter;
    theme?: Theme;
    locale?: Locale;
    localeStrings?: Record<string, any>;
    config: IScenesConfig;
    getConfig: () => void;
    sceneId: string;
    selectedMeshIds: Array<string>;
    coloredMeshItems: ColoredMeshItem[];
    setSelectedMeshIds: (objects: Array<string>) => void;
    setColoredMeshItems: (objects: ColoredMeshItem[]) => void;
}

export type WidgetFormInfo = null | {
    widget: IWidgetLibraryItem;
    mode: WidgetFormMode;
    widgetIdx?: number;
};

export interface IBehaviorFormContext {
    behaviorToEdit: IBehavior;
    setBehaviorToEdit: React.Dispatch<React.SetStateAction<IBehavior>>;
    widgetFormInfo: WidgetFormInfo;
    setWidgetFormInfo: React.Dispatch<React.SetStateAction<WidgetFormInfo>>;
}

export interface IADT3DSceneBuilderElementListProps {
    elements: Array<ITwinToObjectMapping>;
    handleCreateElementClick: () => void;
    handleElementClick: (element: ITwinToObjectMapping) => void;
}

export interface IADT3DSceneBuilderElementFormProps {
    builderMode: ADT3DSceneBuilderMode;
    selectedElement: ITwinToObjectMapping;
    onElementSave: (elements: Array<ITwinToObjectMapping>) => void;
    onElementBackClick: () => void;
}

export type BehaviorSaveMode =
    | ADT3DSceneBuilderMode.EditBehavior
    | ADT3DSceneBuilderMode.CreateBehavior;

export type OnBehaviorSave = (
    behavior: IBehavior,
    mode: BehaviorSaveMode,
    originalBehaviorId?: string
) => void;

export interface IADT3DSceneBuilderBehaviorFormProps {
    builderMode: ADT3DSceneBuilderMode;
    selectedBehavior: IBehavior;
    elements: Array<ITwinToObjectMapping>;
    onBehaviorBackClick: () => void;
    onBehaviorSave: OnBehaviorSave;
    setSelectedBehavior: (behavior: IBehavior) => void;
    onManageElements: () => void;
    setSelectedElements: (elements: Array<ITwinToObjectMapping>) => any;
}

export interface ADT3DSceneBuilderState {
    config: IScenesConfig;
    selectedMeshIds: Array<string>;
    coloredMeshItems: ColoredMeshItem[];
}

export interface ADT3DSceneBuilderLeftPanelState {
    selectedPivotTab: ADT3DSceneTwinBindingsMode;
    builderMode: ADT3DSceneBuilderMode;
    elements: Array<ITwinToObjectMapping>;
    behaviors: Array<IBehavior>;
    selectedElement: ITwinToObjectMapping;
    selectedElements: Array<ITwinToObjectMapping>;
    selectedBehavior: IBehavior;
}

export interface IWidgetBuilderFormDataProps {
    formData: IWidget;
    setFormData: React.Dispatch<React.SetStateAction<IWidget>>;
}
