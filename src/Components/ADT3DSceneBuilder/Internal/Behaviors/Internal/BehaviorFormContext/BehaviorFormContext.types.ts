import { IBehavior } from '../../../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';

export interface IBehaviorFormContextProviderProps {
    behaviorToEdit: IBehavior;
}

/**
 * A context used for capturing the current state of the app and restoring it to a new instance of the app
 */
export interface IBehaviorFormContext {
    behaviorFormState: IBehaviorFormContextState;
    behaviorFormDispatch: React.Dispatch<BehaviorFormContextAction>;
}

/**
 * The state of the context
 */
export interface IBehaviorFormContextState {
    behaviorToEdit: IBehavior | null;
    isDirty: boolean;
}

/**
 * The actions to update the state
 */
export enum BehaviorFormContextActionType {
    SET_ADT_URL = 'SET_ADT_URL'
}

/** The actions to update the state */
export type BehaviorFormContextAction = {
    type: BehaviorFormContextActionType.SET_ADT_URL;
    payload: { url: string };
};
