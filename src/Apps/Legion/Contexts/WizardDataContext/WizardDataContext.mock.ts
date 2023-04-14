/** File for exporting common testing utilities for the context */

import { IWizardDataContextState } from './WizardDataContext.types';

export const GET_MOCK_WIZARD_DATA_CONTEXT_STATE = (): IWizardDataContextState => {
    return {
        entities: [],
        properties: [],
        relationships: [],
        relationshipTypes: [],
        types: []
    };
};
