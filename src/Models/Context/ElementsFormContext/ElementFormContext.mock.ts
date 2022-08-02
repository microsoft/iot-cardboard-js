/** File for exporting common testing utilities for the context */

import { ITwinToObjectMapping } from '../../Types/Generated/3DScenesConfiguration-v1.0.0';
import {
    IElementFormContextProviderProps,
    IElementFormContextState
} from './ElementFormContext.types';

export const GET_MOCK_ELEMENT_FORM_PROVIDER_PROPS = (): IElementFormContextProviderProps => ({
    elementToEdit: {
        displayName: 'My test element',
        id: 'test element id',
        primaryTwinID: 'primaryTwinID',
        objectIDs: []
    } as ITwinToObjectMapping,
    linkedBehaviorIds: []
});
export const GET_MOCK_ELEMENT_FORM_STATE = (): IElementFormContextState => ({
    elementToEdit: {} as ITwinToObjectMapping,
    linkedBehaviorIds: [],
    isDirty: false
});
