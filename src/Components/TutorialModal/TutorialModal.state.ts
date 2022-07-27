import produce from 'immer';
import {
    ITutorialModalState,
    TutorialModalAction,
    TutorialModalActionType,
    TutorialModalPage
} from './TutorialModal.types';

export const defaultTutorialModalState = {
    pageKey: TutorialModalPage.CONCEPTS,
    slideNumber: 0
};

export const tutorialModalReducer = produce(
    (draft: ITutorialModalState, action: TutorialModalAction) => {
        switch (action.type) {
            case TutorialModalActionType.SET_PAGE:
                draft.pageKey = action.pageKey;
                break;
            case TutorialModalActionType.SET_SLIDE:
                draft.slideNumber = action.slide;
                break;
            default:
                return;
        }
    }
);
