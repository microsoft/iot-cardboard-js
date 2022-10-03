import produce from 'immer';
import {
    ADT3DScenePageAction,
    ADT3DScenePageActionTypes,
    ADXConnectionInformationLoadingState,
    IADT3DScenePageState
} from './ADT3DScenePage.types';
import { ADT3DScenePageSteps } from '../../Models/Constants/Enums';

export const defaultADT3DScenePageState: IADT3DScenePageState = {
    scenesConfig: null,
    selectedBlobContainerURL: null,
    selectedScene: null,
    currentStep: ADT3DScenePageSteps.SceneList,
    errors: [],
    errorCallback: null,
    adxConnectionInformationLoadingState:
        ADXConnectionInformationLoadingState.IDLE,
    adxConnectionInformation: null
};

export const ADT3DScenePageReducer: (
    draft: IADT3DScenePageState,
    action: ADT3DScenePageAction
) => IADT3DScenePageState = produce(
    (draft: IADT3DScenePageState, action: ADT3DScenePageAction) => {
        switch (action.type) {
            case ADT3DScenePageActionTypes.SET_ADT_SCENE_CONFIG:
                draft.scenesConfig = action.payload.scenesConfig;
                break;
            case ADT3DScenePageActionTypes.SET_SELECTED_SCENE:
                draft.selectedScene = action.payload.selectedScene;
                break;
            case ADT3DScenePageActionTypes.SET_CURRENT_STEP:
                draft.currentStep = action.payload.currentStep;
                break;
            case ADT3DScenePageActionTypes.SET_ERRORS:
                draft.errors = action.payload.errors;
                break;
            case ADT3DScenePageActionTypes.SET_ERROR_CALLBACK:
                draft.errorCallback = action.payload.errorCallback;
                break;
            case ADT3DScenePageActionTypes.SET_ADX_CONNECTION_INFORMATION_LOADING_STATE:
                draft.adxConnectionInformationLoadingState =
                    action.payload.adxConnectionInformationLoadingState;
                break;
            case ADT3DScenePageActionTypes.SET_ADX_CONNECTION_INFORMATION:
                draft.adxConnectionInformation =
                    action.payload.adxConnectionInformation;
                break;
            default:
                break;
        }
    },
    defaultADT3DScenePageState
);
