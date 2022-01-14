import ADTandBlobAdapter from '../../../Adapters/ADTandBlobAdapter';
import MockAdapter from '../../../Adapters/MockAdapter';
import {
    Behavior,
    ScenesConfig,
    TwinToObjectMapping
} from '../../../Models/Classes/3DVConfig';
import {
    ADT3DSceneBuilderMode,
    Locale,
    Theme
} from '../../../Models/Constants/Enums';
import { IConsumeCompositeCardProps } from '../../../Models/Constants/Interfaces';

// START of Actions
export const SET_ADT_SCENE_CONFIG = 'SET_ADT_SCENE_CONFIG';
export const SET_ADT_SCENE_BUILDER_ELEMENTS = 'SET_ADT_SCENE_BUILDER_ELEMENTS';
export const SET_ADT_SCENE_BUILDER_BEHAVIORS =
    'SET_ADT_SCENE_BUILDER_BEHAVIORS';
export const SET_ADT_SCENE_BUILDER_SELECTED_ELEMENT =
    'SET_ADT_SCENE_BUILDER_SELECTED_ELEMENT';
export const SET_ADT_SCENE_ELEMENT_SELECTED_OBJECT_IDS =
    'SET_ADT_SCENE_ELEMENT_SELECTED_OBJECT_IDS';
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
    config: ScenesConfig;
    getConfig: () => void;
    sceneId: string;
    selectedObjectIds: Array<string>;
    setSelectedObjectIds: (objects: Array<string>) => void;
}

export interface IADT3DSceneBuilderElementListProps {
    elements: Array<TwinToObjectMapping>;
    handleCreateElementClick: () => void;
    handleElementClick: (element: TwinToObjectMapping) => void;
}

export interface IADT3DSceneBuilderElementFormProps {
    builderMode: ADT3DSceneBuilderMode;
    selectedElement: TwinToObjectMapping;
    onElementSave: (elements: Array<TwinToObjectMapping>) => void;
    onElementBackClick: () => void;
}

export interface ADT3DSceneBuilderState {
    config: ScenesConfig;
    selectedObjectIds: Array<string>;
}

export interface ADT3DSceneBuilderLeftPanelState {
    builderMode: ADT3DSceneBuilderMode;
    elements: Array<TwinToObjectMapping>;
    behaviors: Array<Behavior>;
    selectedElement: TwinToObjectMapping;
}
