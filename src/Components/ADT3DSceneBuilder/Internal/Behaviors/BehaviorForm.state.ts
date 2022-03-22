import produce, { enableMapSet } from 'immer';
import {
    BehaviorFormAction,
    BehaviorFormActionType,
    IBehaviorFormState,
    IValidityState,
    TabNames
} from './BehaviorForm.types';

enableMapSet();

export const defaultBehaviorFormState: IBehaviorFormState = {
    validityMap: new Map<TabNames, IValidityState>()
};

export const BehaviorFormReducer = produce(
    (draft: IBehaviorFormState, action: BehaviorFormAction) => {
        const payload = action.payload;

        switch (action.type) {
            case BehaviorFormActionType.SET_TAB_STATE:
                draft.validityMap.set(payload.tabName, payload.state);
                break;
        }
    },
    defaultBehaviorFormState
);
