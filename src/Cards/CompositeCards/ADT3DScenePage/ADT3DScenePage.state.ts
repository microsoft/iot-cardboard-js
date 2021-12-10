import { IAction } from '../../../Models/Constants/Interfaces';
import produce from 'immer';
import {
    SET_CURRENT_STEP,
    SET_SELECTED_SCENE
} from '../../../Models/Constants/ActionTypes';
import { ADT3DScenePageState } from './ADT3DScenePage.types';
import { ADT3DScenePageSteps } from '../../../Models/Constants/Enums';

export const defaultADT3DScenePageState: ADT3DScenePageState = {
    selectedScene: null,
    currentStep: ADT3DScenePageSteps.SceneTwinList
};

export const ADT3DScenePageReducer = produce(
    (draft: ADT3DScenePageState, action: IAction) => {
        const payload = action.payload;

        switch (action.type) {
            case SET_SELECTED_SCENE:
                draft.selectedScene = payload;
                break;
            case SET_CURRENT_STEP:
                draft.currentStep = payload;
                break;
            default:
                break;
        }
    },
    defaultADT3DScenePageState
);
