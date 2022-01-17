import { IAction } from '../../../Models/Constants/Interfaces';
import produce from 'immer';
import {
    SET_ADT_SCENE_CONFIG,
    SET_BLOB_CONTAINER_URLS,
    SET_CURRENT_STEP,
    SET_SELECTED_BLOB_CONTAINER_URL,
    SET_SELECTED_SCENE
} from '../../../Models/Constants/ActionTypes';
import { ADT3DScenePageState } from './ADT3DScenePage.types';
import { ADT3DScenePageSteps } from '../../../Models/Constants/Enums';

export const defaultADT3DScenePageState: ADT3DScenePageState = {
    scenesConfig: null,
    selectedBlobContainerURL: null,
    blobContainerURLs: [],
    selectedScene: null,
    currentStep: ADT3DScenePageSteps.SceneLobby
};

export const ADT3DScenePageReducer = produce(
    (draft: ADT3DScenePageState, action: IAction) => {
        const payload = action.payload;

        switch (action.type) {
            case SET_BLOB_CONTAINER_URLS:
                draft.blobContainerURLs = payload;
                break;
            case SET_SELECTED_BLOB_CONTAINER_URL:
                draft.selectedBlobContainerURL = payload;
                break;
            case SET_ADT_SCENE_CONFIG:
                draft.scenesConfig = payload;
                break;
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
