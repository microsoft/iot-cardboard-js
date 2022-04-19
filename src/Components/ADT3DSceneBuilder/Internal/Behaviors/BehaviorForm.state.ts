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
        switch (action.type) {
            case BehaviorFormActionType.SET_TAB_STATE: {
                const { tabName, state } = action.payload;
                draft.validityMap.set(tabName, state);
                break;
            }
        }
    },
    defaultBehaviorFormState
);
