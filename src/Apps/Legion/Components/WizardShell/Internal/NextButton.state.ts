import produce from 'immer';

interface NextButtonReducerState {
    isDisabled: boolean;
    onClick: () => void;
}

export enum NextButtonReducerActionType {
    SET_IS_DISABLED = 'SET_IS_DISABLED',
    SET_ON_CLICK_FUNCTION = 'SET_ON_CLICK_FUNCTION'
}

type NextButtonReducerAction =
    | {
          type: NextButtonReducerActionType.SET_IS_DISABLED;
          payload: { isDisabled: boolean };
      }
    | {
          type: NextButtonReducerActionType.SET_ON_CLICK_FUNCTION;
          payload: { onClickFn: VoidFunction };
      };

export const defaultNextButtonState: NextButtonReducerState = {
    isDisabled: false,
    onClick: () => {
        return;
    }
};

export const nextButtonReducer = produce(
    (draft: NextButtonReducerState, action: NextButtonReducerAction) => {
        switch (action.type) {
            case NextButtonReducerActionType.SET_IS_DISABLED:
                draft.isDisabled = action.payload.isDisabled;
                break;
            case NextButtonReducerActionType.SET_ON_CLICK_FUNCTION:
                draft.onClick = action.payload.onClickFn;
                break;
        }
    }
);
