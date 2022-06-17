/** File for exporting common testing utilities for the context */

import { IBehavior } from '../../../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { IBehaviorFormContextProviderProps } from './BehaviorFormContext.types';

export const GET_MOCK_BEHAVIOR_FORM_STATE = (): IBehaviorFormContextProviderProps => ({
    behaviorToEdit: {
        displayName: 'My test behavior'
    } as IBehavior,
    behaviorSelectedLayerIds: []
});
