import { IAction } from '../../Models/Constants/Interfaces';
import produce from 'immer';
import {
    SET_ADT_SCENE_CONFIG,
    SET_CURRENT_STEP,
    SET_SELECTED_SCENE,
    SET_ERRORS,
    SET_ERROR_CALLBACK
} from '../../Models/Constants/ActionTypes';
import { ADT3DScenePageState } from './ADT3DScenePage.types';
import { ADT3DScenePageSteps } from '../../Models/Constants/Enums';

export const defaultADT3DScenePageState: ADT3DScenePageState = {
    scenesConfig: null,
    selectedBlobContainerURL: null,
    selectedScene: null,
    currentStep: ADT3DScenePageSteps.SceneList,
    errors: [],
    errorCallback: null
};

export const ADT3DScenePageReducer: (
    draft: ADT3DScenePageState,
    action: IAction
) => ADT3DScenePageState = produce(
    (draft: ADT3DScenePageState, action: IAction) => {
        const payload = action.payload;

        switch (action.type) {
            case SET_ADT_SCENE_CONFIG:
                draft.scenesConfig = payload;
                break;
            case SET_SELECTED_SCENE:
                draft.selectedScene = payload;
                break;
            case SET_CURRENT_STEP:
                draft.currentStep = payload;
                break;
            case SET_ERRORS:
                draft.errors = payload;
                break;
            case SET_ERROR_CALLBACK:
                draft.errorCallback = payload;
                break;
            default:
                break;
        }
    },
    defaultADT3DScenePageState
);
