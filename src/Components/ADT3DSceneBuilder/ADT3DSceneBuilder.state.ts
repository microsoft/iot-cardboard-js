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
    SET_MESH_IDS_TO_OUTLINE,
    SET_ADT_SCENE_OBJECT_COLOR,
    SET_IS_LAYER_BUILDER_DIALOG_OPEN,
    SET_BEHAVIOR_TWIN_ALIAS_FORM_INFO,
    SET_ELEMENT_TWIN_ALIAS_FORM_INFO,
    SET_ADT_SCENE_BUILDER_REMOVED_ELEMENTS,
    SET_ORIGINAL_BEHAVIOR_TO_EDIT,
    SET_UNSAVED_BEHAVIOR_CHANGES_DIALOG_OPEN,
    SET_UNSAVED_BEHAVIOR_CHANGES_DIALOG_DISCARD_ACTION
} from './ADT3DSceneBuilder.types';
import {
    ADT3DSceneBuilderMode,
    ADT3DSceneTwinBindingsMode,
    WidgetFormMode
} from '../../Models/Constants/Enums';
import { DefaultViewerModeObjectColor } from '../../Models/Constants';

export const defaultADT3DSceneBuilderState: ADT3DSceneBuilderState = {
    config: null,
    coloredMeshItems: [],
    outlinedMeshItems: [],
    widgetFormInfo: { mode: WidgetFormMode.Cancelled },
    behaviorTwinAliasFormInfo: null,
    elementTwinAliasFormInfo: null,
    selectedPivotTab: ADT3DSceneTwinBindingsMode.Elements,
    builderMode: ADT3DSceneBuilderMode.ElementsIdle,
    elements: [],
    behaviors: [],
    selectedElement: null,
    selectedElements: null,
    removedElements: null,
    selectedBehavior: null,
    showHoverOnSelected: false,
    enableHoverOnModel: false,
    objectColor: DefaultViewerModeObjectColor,
    isLayerBuilderDialogOpen: false,
    layerBuilderDialogData: null,
    originalBehaviorToEdit: null,
    unsavedBehaviorDialogOpen: false,
    unsavedChangesDialogDiscardAction: null
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
            case SET_ADT_SCENE_BUILDER_SELECTED_ELEMENT:
                draft.selectedElement = payload;
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
            case SET_ADT_SCENE_BUILDER_SELECTED_BEHAVIOR:
                draft.selectedBehavior = payload;
                break;
            case SET_ORIGINAL_BEHAVIOR_TO_EDIT:
                draft.originalBehaviorToEdit = payload;
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
            case SET_MESH_IDS_TO_OUTLINE:
                draft.outlinedMeshItems = payload;
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
                        draft.outlinedMeshItems = [];
                        break;
                    case ADT3DSceneBuilderMode.BehaviorIdle:
                        draft.selectedBehavior = null;
                        draft.selectedPivotTab =
                            ADT3DSceneTwinBindingsMode.Behaviors;
                        draft.outlinedMeshItems = [];
                        break;
                    case ADT3DSceneBuilderMode.EditElement:
                    case ADT3DSceneBuilderMode.CreateElement:
                        draft.enableHoverOnModel = true;
                        draft.outlinedMeshItems = [];
                        break;
                    default:
                        draft.enableHoverOnModel = false;
                        break;
                }
                break;
            default:
                break;
        }
    },
    defaultADT3DSceneBuilderState
);
