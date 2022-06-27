/** File for exporting common testing utilities for the context */

import { IBehavior } from '../../Types/Generated/3DScenesConfiguration-v1.0.0';
import {
    IBehaviorFormContextProviderProps,
    IBehaviorFormContextState
} from './BehaviorFormContext.types';

export const GET_MOCK_BEHAVIOR_FORM_PROVIDER_PROPS = (): IBehaviorFormContextProviderProps => ({
    behaviorToEdit: {
        displayName: 'My test behavior'
    } as IBehavior,
    behaviorSelectedLayerIds: []
});
export const GET_MOCK_BEHAVIOR_FORM_STATE = (): IBehaviorFormContextState => ({
    behaviorSelectedLayerIds: [],
    behaviorToEdit: {} as IBehavior,
    isDirty: false
});
