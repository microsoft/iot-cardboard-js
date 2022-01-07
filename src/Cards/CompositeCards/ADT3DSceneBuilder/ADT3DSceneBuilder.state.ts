import { IAction } from '../../../Models/Constants/Interfaces';
import produce from 'immer';
import { ADT3DSceneBuilderVisualStateRulesState } from './ADT3DSceneBuilder.types';
import { SET_ADT_SCENE_BUILDER_ELEMENTS } from '../../../Models/Constants/ActionTypes';

export const defaultADT3DScenePageState: ADT3DSceneBuilderVisualStateRulesState = {
    elements: []
};

export const ADT3DSceneBuilderVisualStateRulesReducer = produce(
    (draft: ADT3DSceneBuilderVisualStateRulesState, action: IAction) => {
        const payload = action.payload;

        switch (action.type) {
            case SET_ADT_SCENE_BUILDER_ELEMENTS:
                draft.elements = payload;
                break;
            default:
                break;
        }
    },
    defaultADT3DScenePageState
);
