import { IContextualMenuItem } from '@fluentui/react';
import React from 'react';
import ADTandBlobAdapter from '../../Adapters/ADTandBlobAdapter';
import MockAdapter from '../../Adapters/MockAdapter';
import { IWidgetLibraryItem } from '../../Models/Classes/3DVConfig';
import { CustomMeshItem } from '../../Models/Classes/SceneView.types';
import {
    ADT3DSceneBuilderMode,
    ADT3DSceneTwinBindingsMode,
    Locale,
    Theme,
    WidgetFormMode
} from '../../Models/Constants/Enums';
import {
    IADTObjectColor,
    IConsumeCompositeCardProps
} from '../../Models/Constants/Interfaces';
import {
    I3DScenesConfig,
    IBehavior,
    IGaugeWidget,
    ILinkWidget,
    ITwinToObjectMapping
} from '../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';

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
export const SET_WIDGET_FORM_INFO = 'SET_WIDGET_FORM_INFO';
export const SET_REVERT_TO_HOVER_COLOR = 'SET_REVERT_TO_HOVER_COLOR';
export const SET_ADT_SCENE_OBJECT_COLOR = 'SET_ADT_SCENE_OBJECT_COLOR';
export const SET_MESH_IDS_TO_OUTLINE = 'SET_MESH_IDS_TO_OUTLINE';
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
    config: I3DScenesConfig;
    getConfig: () => void;
    sceneId: string;
    coloredMeshItems: Array<CustomMeshItem>;
    setColoredMeshItems: (objects: Array<CustomMeshItem>) => void;
    setOutlinedMeshItems: (ids: Array<CustomMeshItem>) => void;
    widgetFormInfo: WidgetFormInfo;
    setWidgetFormInfo: (widgetFormInfo: WidgetFormInfo) => void;
    dispatch: React.Dispatch<{ type: string; payload: any }>;
    state: ADT3DSceneBuilderState;
    objectColor: IADTObjectColor;
}

export type WidgetFormInfo = {
    widget?: IWidgetLibraryItem;
    mode: WidgetFormMode;
    widgetId?: string;
};

export interface IBehaviorFormContext {
    behaviorToEdit: IBehavior;
    setBehaviorToEdit: React.Dispatch<React.SetStateAction<IBehavior>>;
}

export interface IContextMenuProps {
    isVisible: boolean;
    x: number;
    y: number;
    items: IContextualMenuItem[];
}

export interface IADT3DSceneBuilderElementListProps {
    elements: Array<ITwinToObjectMapping>;
    handleCreateElementClick: () => void;
    handleElementClick: (element: ITwinToObjectMapping) => void;
}

export interface IADT3DSceneBuilderElementFormProps {
    builderMode: ADT3DSceneBuilderMode;
    selectedElement: ITwinToObjectMapping;
    behaviors: Array<IBehavior>;
    onElementSave: (elements: Array<ITwinToObjectMapping>) => void;
    onElementBackClick: () => void;
    onBehaviorSave: OnBehaviorSave;
    onBehaviorClick: (behavior: IBehavior) => void;
    onCreateBehaviorWithElements: () => void;
}

export interface IADT3DSceneBuilderAddBehaviorCalloutProps {
    availableBehaviors: Array<IBehavior>;
    calloutTarget: string;
    onAddBehavior: (behavior: IBehavior) => void;
    onCreateBehaviorWithElements: () => void;
    hideCallout: () => void;
}

export type BehaviorSaveMode =
    | ADT3DSceneBuilderMode.EditBehavior
    | ADT3DSceneBuilderMode.CreateBehavior;

export type OnBehaviorSave = (
    behavior: IBehavior,
    mode: BehaviorSaveMode
) => void;

export interface IADT3DSceneBuilderBehaviorFormProps {
    builderMode: ADT3DSceneBuilderMode;
    selectedBehavior: IBehavior;
    elements: Array<ITwinToObjectMapping>;
    selectedElements: Array<ITwinToObjectMapping>;
    onBehaviorBackClick: () => void;
    onBehaviorSave: OnBehaviorSave;
    setSelectedElements: (elements: Array<ITwinToObjectMapping>) => any;
    updateSelectedElements: (
        element: ITwinToObjectMapping,
        isSelected: boolean
    ) => void;
}

export interface IADT3DSceneBuilderElementsProps {
    elements: Array<ITwinToObjectMapping>;
    selectedElements: Array<ITwinToObjectMapping>;
    updateSelectedElements: (
        updatedElement: ITwinToObjectMapping,
        isSelected: boolean
    ) => void;
    clearSelectedElements?: () => void;
    onCreateBehaviorClick?: () => void;
    onCreateElementClick?: () => void;
    onRemoveElement?: (newElements: Array<ITwinToObjectMapping>) => void;
    onElementClick?: (element: ITwinToObjectMapping) => void;
    isEditBehavior?: boolean;
    hideSearch?: boolean;
}

export interface ADT3DSceneBuilderState {
    config: I3DScenesConfig;
    coloredMeshItems: Array<CustomMeshItem>;
    outlinedMeshItems: Array<CustomMeshItem>;
    widgetFormInfo: WidgetFormInfo;
    selectedPivotTab: ADT3DSceneTwinBindingsMode;
    builderMode: ADT3DSceneBuilderMode;
    elements: Array<ITwinToObjectMapping>;
    behaviors: Array<IBehavior>;
    selectedElement: ITwinToObjectMapping;
    selectedElements: Array<ITwinToObjectMapping>;
    selectedBehavior: IBehavior;
    showHoverOnSelected: boolean;
    enableHoverOnModel: boolean;
    objectColor: IADTObjectColor;
}

export interface IWidgetBuilderFormDataProps {
    getIntellisensePropertyNames?: (twinId: string) => string[];
    setIsWidgetConfigValid?: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface ILinkWidgetBuilderProps extends IWidgetBuilderFormDataProps {
    formData: ILinkWidget;
    updateWidgetData: (widgetData: ILinkWidget) => void;
}

export interface IGaugeWidgetBuilderProps extends IWidgetBuilderFormDataProps {
    formData: IGaugeWidget;
    updateWidgetData: (widgetData: IGaugeWidget) => void;
}

export interface BehaviorState {
    behaviorToEdit: IBehavior;
    behaviorsOnElement: Array<IBehavior>;
    behaviorsToEdit: Array<IBehavior>;
    availableBehaviors: Array<IBehavior>;
}
