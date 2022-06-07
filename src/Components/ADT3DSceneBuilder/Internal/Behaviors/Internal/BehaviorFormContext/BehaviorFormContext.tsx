/**
 * This context is for transferring state from one session to another. These properties are managed by the various parts of the app and can be read onMount to restore the state
 */
import produce from 'immer';
import React, { useContext, useReducer } from 'react';
import { getDebugLogger } from '../../../../../../Models/Services/Utils';
import { IBehavior } from '../../../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import {
    IBehaviorFormContext,
    IBehaviorFormContextState,
    BehaviorFormContextAction,
    BehaviorFormContextActionType,
    IBehaviorFormContextProviderProps
} from './BehaviorFormContext.types';

const debugLogging = false;
const logDebugConsole = getDebugLogger('BehaviorFormContext', debugLogging);

export const BehaviorFormContext = React.createContext<IBehaviorFormContext>(
    null
);
export const useBehaviorFormContext = () => useContext(BehaviorFormContext);

export const BehaviorFormContextReducer: (
    draft: IBehaviorFormContextState,
    action: BehaviorFormContextAction
) => IBehaviorFormContextState = produce(
    (draft: IBehaviorFormContextState, action: BehaviorFormContextAction) => {
        logDebugConsole(
            'info',
            `Updating BehaviorForm context ${action.type} with payload: `,
            action.payload
        );
        switch (action.type) {
            case BehaviorFormContextActionType.SET_ADT_URL: {
                // draft.adtUrl = action.payload.url || '';
                break;
            }
        }
    }
);

export const BehaviorFormContextProvider: React.FC<IBehaviorFormContextProviderProps> = (
    props
) => {
    const { children } = props;

    // skip wrapping if the context already exists
    const existingContext = useBehaviorFormContext();
    if (existingContext) {
        return <>{children}</>;
    }

    const { behaviorToEdit } = props;
    const defaultState: IBehaviorFormContextState = {
        behaviorToEdit: behaviorToEdit,
        isDirty: false
    };

    const [behaviorFormState, behaviorFormDispatch] = useReducer(
        BehaviorFormContextReducer,
        defaultState
    );
    return (
        <BehaviorFormContext.Provider
            value={{
                behaviorFormDispatch,
                behaviorFormState
            }}
        >
            {children}
        </BehaviorFormContext.Provider>
    );
};
