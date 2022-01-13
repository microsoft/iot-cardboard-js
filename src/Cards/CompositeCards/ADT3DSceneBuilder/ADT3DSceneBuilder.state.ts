import { IAction } from '../../../Models/Constants/Interfaces';
import produce from 'immer';
import {
    ADT3DSceneBuilderState,
    ADT3DSceneBuilderLeftPanelState,
    SET_ADT_SCENE_CONFIG,
    SET_ADT_SCENE_ELEMENT_SELECTED_OBJECT_IDS,
    SET_ADT_SCENE_BUILDER_ELEMENTS,
    SET_ADT_SCENE_BUILDER_SELECTED_ELEMENT,
    SET_ADT_SCENE_BUILDER_MODE,
    SET_ADT_SCENE_BUILDER_BEHAVIORS
} from './ADT3DSceneBuilder.types';
import { ADT3DSceneBuilderMode } from '../../../Models/Constants/Enums';

export const defaultADT3DSceneBuilderState: ADT3DSceneBuilderState = {
    config: null,
    selectedObjectIds: []
};

export const defaultADT3DSceneBuilderLeftPanelState: ADT3DSceneBuilderLeftPanelState = {
    builderMode: ADT3DSceneBuilderMode.Idle,
    elements: [],
    behaviors: [],
    selectedElement: null
};

export const ADT3DSceneBuilderReducer = produce(
    (draft: ADT3DSceneBuilderState, action: IAction) => {
        const payload = action.payload;

        switch (action.type) {
            case SET_ADT_SCENE_CONFIG:
                draft.config = payload;
                break;
            case SET_ADT_SCENE_ELEMENT_SELECTED_OBJECT_IDS:
                draft.selectedObjectIds = payload;
                break;
            default:
                break;
        }
    },
    defaultADT3DSceneBuilderState
);

export const ADT3DSceneBuilderLeftPanelReducer = (
    state = defaultADT3DSceneBuilderLeftPanelState,
    action
) =>
    produce(state, (draft) => {
        const payload = action.payload;

        switch (action.type) {
            case SET_ADT_SCENE_BUILDER_ELEMENTS:
                draft.elements = payload;
                break;
            case SET_ADT_SCENE_BUILDER_BEHAVIORS:
                draft.behaviors = payload;
                break;
            case SET_ADT_SCENE_BUILDER_SELECTED_ELEMENT:
                draft.selectedElement = payload;
                break;
            case SET_ADT_SCENE_BUILDER_MODE:
                draft.builderMode = payload;
                if (payload === ADT3DSceneBuilderMode.Idle) {
                    draft.selectedElement = null;
                }
                break;
            default:
                break;
        }
    });
