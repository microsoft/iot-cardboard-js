import {
    IContextualMenuItem,
    IStackStyles,
    IStyle,
    IStyleFunctionOrObject,
    ITheme
} from '@fluentui/react';
import React from 'react';
import ADT3DSceneAdapter from '../../Adapters/ADT3DSceneAdapter';
import MockAdapter from '../../Adapters/MockAdapter';
import {
    IBehaviorTwinAliasItem,
    IElementTwinAliasItem,
    IWidgetLibraryItem
} from '../../Models/Classes/3DVConfig';
import {
    CustomMeshItem,
    ISceneViewProps,
    TransformedElementItem,
    TransformInfo
} from '../../Models/Classes/SceneView.types';
import {
    ADT3DSceneBuilderMode,
    ADT3DSceneTwinBindingsMode,
    Locale,
    Theme,
    TwinAliasFormMode,
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
    IValueWidget,
    ITwinToObjectMapping
} from '../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';

// START of Actions
export const SET_ADT_SCENE_CONFIG = 'SET_ADT_SCENE_CONFIG';
export const SET_ADT_SCENE_BUILDER_ELEMENTS = 'SET_ADT_SCENE_BUILDER_ELEMENTS';
export const SET_ADT_SCENE_BUILDER_BEHAVIORS =
    'SET_ADT_SCENE_BUILDER_BEHAVIORS';
export const SET_ADT_SCENE_BUILDER_SELECTED_ELEMENTS =
    'SET_ADT_SCENE_BUILDER_SELECTED_ELEMENTS';
export const SET_ADT_SCENE_BUILDER_REMOVED_ELEMENTS =
    'SET_ADT_SCENE_BUILDER_REMOVED_ELEMENTS';
export const SET_ADT_SCENE_BUILDER_SELECTED_ELEMENT =
    'SET_ADT_SCENE_BUILDER_SELECTED_ELEMENT';
export const SET_ADT_SCENE_BUILDER_SELECTED_BEHAVIOR =
    'SET_ADT_SCENE_BUILDER_SELECTED_BEHAVIOR';
export const SET_ADT_SCENE_BUILDER_DRAFT_BEHAVIOR =
    'SET_ADT_SCENE_BUILDER_DRAFT_BEHAVIOR';
export const SET_ADT_SCENE_ELEMENT_SELECTED_OBJECT_IDS =
    'SET_ADT_SCENE_ELEMENT_SELECTED_OBJECT_IDS';
export const SET_ADT_SCENE_BUILDER_COLORED_MESH_ITEMS =
    'SET_ADT_SCENE_BUILDER_COLORED_MESH_ITEMS';
export const SET_UNSAVED_BEHAVIOR_CHANGES_DIALOG_OPEN =
    'SET_ADT_UNSAVED_BEHAVIOR_CHANGES_DIALOG_OPEN';
export const SET_UNSAVED_BEHAVIOR_CHANGES_DIALOG_DISCARD_ACTION =
    'SET_UNSAVED_BEHAVIOR_CHANGES_DIALOG_DISCARD_ACTION';
export const SET_ADT_SCENE_BUILDER_MODE = 'SET_ADT_SCENE_BUILDER_MODE';
export const SET_WIDGET_FORM_INFO = 'SET_WIDGET_FORM_INFO';
export const SET_BEHAVIOR_TWIN_ALIAS_FORM_INFO =
    'SET_BEHAVIOR_TWIN_ALIAS_FORM_INFO';
export const SET_ELEMENT_TWIN_ALIAS_FORM_INFO =
    'SET_ELEMENT_TWIN_ALIAS_FORM_INFO';
export const SET_REVERT_TO_HOVER_COLOR = 'SET_REVERT_TO_HOVER_COLOR';
export const SET_ADT_SCENE_OBJECT_COLOR = 'SET_ADT_SCENE_OBJECT_COLOR';
export const SET_MESH_IDS_TO_OUTLINE = 'SET_MESH_IDS_TO_OUTLINE';
export const SET_IS_LAYER_BUILDER_DIALOG_OPEN =
    'SET_IS_LAYER_BUILDER_DIALOG_OPEN';
export const SET_ADT_SCENE_BUILDER_FORM_DIRTY_MAP_ENTRY =
    'SET_ADT_SCENE_BUILDER_FORM_DIRTY_MAP_ENTRY';
export const SET_GIZMO_ELEMENT_ITEM = 'SET_PARENT_MESH_IDS_TO_GIZMO';
export const SET_GIZMO_TRANSFORM_ITEM = 'SET_GIZMO_TRANSFORM_ITEM';
// END of Actions

export interface IADT3DSceneBuilderCardProps
    extends IConsumeCompositeCardProps {
    adapter: ADT3DSceneAdapter | MockAdapter;
    sceneId: string;
    sceneViewProps?: ISceneViewProps;
    /** show the toggle to switch between builder & viewer modes */
    showModeToggle?: boolean;
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<
        IADT3DSceneBuilderStyleProps,
        IADT3DSceneBuilderStyles
    >;
}

export interface IADT3DSceneBuilderStyleProps {
    theme: ITheme;
}
export interface IADT3DSceneBuilderStyles {
    root: IStyle;
    wrapper: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: IADT3DSceneBuilderSubComponentStyles;
}

export interface IADT3DSceneBuilderSubComponentStyles {
    headerStack?: IStackStyles;
}

export interface I3DSceneBuilderContext {
    adapter: ADT3DSceneAdapter | MockAdapter;
    theme?: Theme;
    locale?: Locale;
    localeStrings?: Record<string, any>;
    config: I3DScenesConfig;
    getConfig: () => void;
    sceneId: string;
    coloredMeshItems: Array<CustomMeshItem>;
    setColoredMeshItems: (objects: Array<CustomMeshItem>) => void;
    setOutlinedMeshItems: (ids: Array<CustomMeshItem>) => void;
    setGizmoElementItem: (item: TransformedElementItem) => void;
    setGizmoTransformItem: (item: TransformInfo) => void;
    widgetFormInfo: WidgetFormInfo;
    setWidgetFormInfo: (widgetFormInfo: WidgetFormInfo) => void;
    behaviorTwinAliasFormInfo: BehaviorTwinAliasFormInfo;
    setBehaviorTwinAliasFormInfo: (
        behaviorTwinAliasFormInfo: BehaviorTwinAliasFormInfo
    ) => void;
    elementTwinAliasFormInfo: ElementTwinAliasFormInfo;
    setElementTwinAliasFormInfo: (
        elementTwinAliasFormInfo: ElementTwinAliasFormInfo
    ) => void;
    dispatch: React.Dispatch<{ type: string; payload: any }>;
    state: ADT3DSceneBuilderState;
    objectColor: IADTObjectColor;
    setUnsavedBehaviorChangesDialogOpen: (isOpen: boolean) => void;
    setUnsavedChangesDialogDiscardAction: (action: any) => void;
    setIsLayerBuilderDialogOpen: (
        isOpen: boolean,
        behaviorId?: string,
        onFocusDismiss?: (layerId: string) => void
    ) => void;
}

export type BuilderDirtyFormType = 'behavior' | 'element';

export type WidgetFormInfo = {
    widget?: IWidgetLibraryItem;
    mode: WidgetFormMode;
    widgetId?: string;
};

export type BehaviorTwinAliasFormInfo = null | {
    twinAlias: IBehaviorTwinAliasItem;
    mode: TwinAliasFormMode;
    aliasToAutoPopulate?: string; // this is needed to prefill the value of the alias (by search text when there is no results) when creating a new one
};

export type ElementTwinAliasFormInfo = null | {
    twinAlias: IElementTwinAliasItem;
    mode: TwinAliasFormMode;
};

export interface IElementFormContext {
    elementToEdit: ITwinToObjectMapping;
    setElementToEdit: React.Dispatch<
        React.SetStateAction<ITwinToObjectMapping>
    >;
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
    onElementSave: (newElements: Array<ITwinToObjectMapping>) => void;
    onElementBackClick: () => void;
    onBehaviorClick: (behavior: IBehavior) => void;
    onCreateBehaviorWithElements: (
        preSearchedBehaviorName: string,
        newElement?: ITwinToObjectMapping
    ) => void;
}

export interface IADT3DSceneBuilderAddBehaviorCalloutProps {
    availableBehaviors: Array<IBehavior>;
    calloutTarget: string;
    onAddBehavior: (behavior: IBehavior) => void;
    onCreateBehaviorWithElements: (preSearchedBehaviorName?: string) => void;
    hideCallout: () => void;
    isCreateBehaviorDisabled?: boolean;
}

export interface IADT3DSceneBuilderAddTwinAliasCalloutProps {
    availableTwinAliases: Array<IBehaviorTwinAliasItem>;
    calloutTarget: string;
    onAddTwinAlias: (twinAlias: IBehaviorTwinAliasItem) => void;
    onCreateTwinAlias: (preSearchedAlias?: string) => void;
    hideCallout: () => void;
}

export interface IADT3DSceneBuilderPrimaryTwinPropertiesCalloutProps {
    commonPrimaryTwinProperties: Array<string>;
    isLoading: boolean;
    calloutTarget: string;
    hideCallout: () => void;
}

export type BehaviorSaveMode =
    | ADT3DSceneBuilderMode.EditBehavior
    | ADT3DSceneBuilderMode.CreateBehavior;

export type OnBehaviorSave = (
    config: I3DScenesConfig,
    behavior: IBehavior,
    mode: BehaviorSaveMode,
    selectedLayerIds?: string[],
    selectedElements?: Array<ITwinToObjectMapping>,
    removedElements?: Array<ITwinToObjectMapping>
) => Promise<void>;

export interface IADT3DSceneBuilderBehaviorFormProps {
    behaviors: Array<IBehavior>;
    builderMode: ADT3DSceneBuilderMode;
    elements: Array<ITwinToObjectMapping>;
    onBehaviorBackClick: () => void;
    onBehaviorSave: OnBehaviorSave;
    onElementClick?: (element: ITwinToObjectMapping) => void;
    onRemoveElement?: (newElements: Array<ITwinToObjectMapping>) => void;
    removedElements: Array<ITwinToObjectMapping>;
    selectedElements: Array<ITwinToObjectMapping>;
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
    onCreateBehaviorClick?: (initialBehaviorName: string) => void;
    onCreateElementClick?: () => void;
    onRemoveElement?: (newElements: Array<ITwinToObjectMapping>) => void;
    onElementClick?: (element: ITwinToObjectMapping) => void;
    isEditBehavior?: boolean;
    hideSearch?: boolean;
}

export interface ADT3DSceneBuilderState {
    behaviors: Array<IBehavior>;
    behaviorTwinAliasFormInfo: BehaviorTwinAliasFormInfo;
    builderMode: ADT3DSceneBuilderMode;
    coloredMeshItems: Array<CustomMeshItem>;
    config: I3DScenesConfig;
    elements: Array<ITwinToObjectMapping>;
    elementTwinAliasFormInfo: ElementTwinAliasFormInfo;
    enableHoverOnModel: boolean;
    formDirtyState: Map<BuilderDirtyFormType, boolean>;
    gizmoElementItem: TransformedElementItem;
    gizmoTransformItem: TransformInfo;
    isLayerBuilderDialogOpen: boolean;
    layerBuilderDialogData: {
        behaviorId: string;
        onFocusDismiss?: (layerId: string) => void;
    };
    objectColor: IADTObjectColor;
    originalBehaviorToEdit: IBehavior;
    outlinedMeshItems: Array<CustomMeshItem>;
    removedElements: Array<ITwinToObjectMapping>;
    selectedBehavior: IBehavior;
    /** copy of the behavior being edited by the form. Reflects changes in realtime but should not be edited */
    draftBehavior: IBehavior;
    selectedElement: ITwinToObjectMapping;
    selectedElements: Array<ITwinToObjectMapping>;
    selectedPivotTab: ADT3DSceneTwinBindingsMode;
    showHoverOnSelected: boolean;
    unsavedBehaviorDialogOpen: boolean;
    unsavedChangesDialogDiscardAction: VoidFunction;
    widgetFormInfo: WidgetFormInfo;
}

export interface IWidgetBuilderFormDataProps {
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

export interface IValueWidgetBuilderProps extends IWidgetBuilderFormDataProps {
    formData: IValueWidget;
    updateWidgetData: (widgetData: IValueWidget) => void;
}

export interface BehaviorState {
    behaviorToEdit: IBehavior;
    behaviorsOnElement: Array<IBehavior>;
    behaviorsToEdit: Array<IBehavior>;
    availableBehaviors: Array<IBehavior>;
}
