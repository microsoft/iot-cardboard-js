import { IAction } from '../../Models/Constants/Interfaces';
import produce from 'immer';
import {
    ADT3DSceneBuilderState,
    SET_ADT_SCENE_CONFIG,
    SET_ADT_SCENE_ELEMENT_SELECTED_OBJECT_IDS,
    SET_ADT_SCENE_BUILDER_ELEMENTS,
    SET_ADT_SCENE_BUILDER_SELECTED_ELEMENT,
    SET_ADT_SCENE_BUILDER_SELECTED_ELEMENTS,
    SET_ADT_SCENE_BUILDER_MODE,
    SET_ADT_SCENE_BUILDER_BEHAVIORS,
    SET_ADT_SCENE_BUILDER_SELECTED_BEHAVIOR,
    SET_WIDGET_FORM_INFO,
    SET_REVERT_TO_HOVER_COLOR,
    SET_ADT_SCENE_OBJECT_COLOR,
    SET_IS_LAYER_BUILDER_DIALOG_OPEN,
    SET_BEHAVIOR_TWIN_ALIAS_FORM_INFO,
    SET_ELEMENT_TWIN_ALIAS_FORM_INFO,
    SET_ADT_SCENE_BUILDER_REMOVED_ELEMENTS,
    SET_UNSAVED_BEHAVIOR_CHANGES_DIALOG_OPEN,
    SET_UNSAVED_BEHAVIOR_CHANGES_DIALOG_DISCARD_ACTION,
    SET_ADT_SCENE_BUILDER_FORM_DIRTY_MAP_ENTRY,
    SET_ADT_SCENE_BUILDER_DRAFT_BEHAVIOR,
    SET_GIZMO_ELEMENT_ITEM,
    SET_GIZMO_TRANSFORM_ITEM,
    BuilderDirtyFormType,
    SET_VISUAL_RULE_ACTIVE_MODE
} from './ADT3DSceneBuilder.types';
import {
    ADT3DSceneBuilderMode,
    ADT3DSceneTwinBindingsMode,
    VisualRuleFormMode,
    WidgetFormMode
} from '../../Models/Constants/Enums';
import { DefaultViewerModeObjectColor } from '../../Models/Constants';

export const defaultADT3DSceneBuilderState: ADT3DSceneBuilderState = {
    behaviors: [],
    behaviorTwinAliasFormInfo: null,
    builderMode: ADT3DSceneBuilderMode.ElementsIdle,
    coloredMeshItems: [],
    config: null,
    draftBehavior: null,
    elements: [],
    elementTwinAliasFormInfo: null,
    enableHoverOnModel: false,
    formDirtyState: new Map<BuilderDirtyFormType, boolean>(),
    gizmoElementItem: null,
    gizmoTransformItem: null,
    isLayerBuilderDialogOpen: false,
    layerBuilderDialogData: null,
    objectColor: DefaultViewerModeObjectColor,
    originalBehaviorToEdit: null,
    removedElements: null,
    selectedBehavior: null,
    selectedElement: null,
    selectedElements: null,
    selectedPivotTab: ADT3DSceneTwinBindingsMode.Elements,
    showHoverOnSelected: false,
    unsavedBehaviorDialogOpen: false,
    unsavedChangesDialogDiscardAction: null,
    visualRuleFormMode: VisualRuleFormMode.Inactive,
    widgetFormInfo: { mode: WidgetFormMode.Cancelled }
};

export const ADT3DSceneBuilderReducer: (
    draft: ADT3DSceneBuilderState,
    action: IAction
) => ADT3DSceneBuilderState = produce(
    (draft: ADT3DSceneBuilderState, action: IAction) => {
        const payload = action.payload;

        switch (action.type) {
            case SET_ADT_SCENE_CONFIG:
                draft.config = payload;
                break;
            case SET_ADT_SCENE_ELEMENT_SELECTED_OBJECT_IDS:
                draft.coloredMeshItems = payload;
                break;
            case SET_WIDGET_FORM_INFO:
                draft.widgetFormInfo = payload;
                break;
            case SET_BEHAVIOR_TWIN_ALIAS_FORM_INFO:
                draft.behaviorTwinAliasFormInfo = payload;
                break;
            case SET_ELEMENT_TWIN_ALIAS_FORM_INFO:
                draft.elementTwinAliasFormInfo = payload;
                break;
            case SET_ADT_SCENE_BUILDER_ELEMENTS:
                draft.elements = payload;
                break;
            case SET_ADT_SCENE_BUILDER_BEHAVIORS:
                draft.behaviors = payload;
                break;
            case SET_ADT_SCENE_BUILDER_SELECTED_ELEMENTS:
                draft.selectedElements = payload;
                break;
            case SET_ADT_SCENE_BUILDER_REMOVED_ELEMENTS:
                draft.removedElements = payload;
                break;
            case SET_ADT_SCENE_OBJECT_COLOR:
                draft.objectColor = payload;
                break;
            case SET_ADT_SCENE_BUILDER_FORM_DIRTY_MAP_ENTRY:
                draft.formDirtyState.set(
                    action.payload.formType,
                    action.payload.value
                );
                break;

            case SET_ADT_SCENE_BUILDER_SELECTED_ELEMENT:
                draft.selectedElement = payload;
                if (!payload) {
                    draft.formDirtyState.set('element', false);
                }
                break;

            case SET_ADT_SCENE_BUILDER_SELECTED_BEHAVIOR:
                draft.selectedBehavior = payload;
                if (!payload) {
                    draft.formDirtyState.set('behavior', false);
                }
                break;
            case SET_ADT_SCENE_BUILDER_DRAFT_BEHAVIOR:
                draft.draftBehavior = Object.freeze(payload); // freeze to prevent accidental updates. Changes should be on the form context
                break;

            case SET_UNSAVED_BEHAVIOR_CHANGES_DIALOG_DISCARD_ACTION:
                draft.unsavedChangesDialogDiscardAction = payload;
                break;
            case SET_UNSAVED_BEHAVIOR_CHANGES_DIALOG_OPEN:
                draft.unsavedBehaviorDialogOpen = payload;
                break;
            case SET_REVERT_TO_HOVER_COLOR:
                draft.showHoverOnSelected = payload;
                break;
            case SET_GIZMO_ELEMENT_ITEM:
                draft.gizmoElementItem = payload;
                break;
            case SET_GIZMO_TRANSFORM_ITEM:
                draft.gizmoTransformItem = payload;
                break;
            case SET_IS_LAYER_BUILDER_DIALOG_OPEN:
                draft.isLayerBuilderDialogOpen = payload.isOpen;
                if (payload.behaviorId) {
                    draft.layerBuilderDialogData = {
                        behaviorId: payload.behaviorId,
                        onFocusDismiss: payload.onFocusDismiss
                    };
                } else {
                    draft.layerBuilderDialogData = null;
                }
                break;
            case SET_ADT_SCENE_BUILDER_MODE:
                draft.builderMode = payload;
                switch (payload) {
                    case ADT3DSceneBuilderMode.ElementsIdle:
                        draft.selectedElement = null;
                        draft.selectedPivotTab =
                            ADT3DSceneTwinBindingsMode.Elements;
                        draft.enableHoverOnModel = false;
                        break;
                    case ADT3DSceneBuilderMode.BehaviorIdle:
                        draft.selectedBehavior = null;
                        draft.selectedPivotTab =
                            ADT3DSceneTwinBindingsMode.Behaviors;
                        break;
                    case ADT3DSceneBuilderMode.EditElement:
                    case ADT3DSceneBuilderMode.CreateElement:
                        draft.enableHoverOnModel = true;
                        break;
                    default:
                        draft.enableHoverOnModel = false;
                        break;
                }
                break;
            case SET_VISUAL_RULE_ACTIVE_MODE:
                draft.visualRuleFormMode = payload;
                break;
            default:
                break;
        }
    },
    defaultADT3DSceneBuilderState
);
