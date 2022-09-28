/**
 * This context is for managing the state and actions on the Ontology Authoring Tool page
 */
import produce from 'immer';
import React, { useContext, useReducer } from 'react';
import {
    getStoredEditorModelsData,
    getStoredEditorTemplateData,
    getStoredEditorModelPositionsData,
    getStoredEditorNamespaceData,
    getStoredEditorModelMetadata
} from '../../Services/OatUtils';
import { getDebugLogger } from '../../Services/Utils';
import {
    IOatPageContext,
    IOatPageContextProviderProps,
    IOatPageContextState,
    OatPageContextAction,
    OatPageContextActionType
} from './OatPageContext.types';

const debugLogging = false;
const logDebugConsole = getDebugLogger('OatPageContext', debugLogging);

export const OatPageContext = React.createContext<IOatPageContext>(null);
export const useOatPageContext = () => useContext(OatPageContext);

export const OatPageContextReducer: (
    draft: IOatPageContextState,
    action: OatPageContextAction
) => IOatPageContextState = produce(
    (draft: IOatPageContextState, action: OatPageContextAction) => {
        logDebugConsole(
            'info',
            `Updating Deeplink context ${action.type} with payload: `,
            action.payload
        );
        switch (action.type) {
            case OatPageContextActionType.SET_ADT_URL: {
                draft.adtUrl = action.payload.url || '';
                break;
            }
            case 'MyAction': {
            }
        }
    }
);

export const OatPageContextProvider: React.FC<IOatPageContextProviderProps> = (
    props
) => {
    const { children } = props;

    // skip wrapping if the context already exists
    const existingContext = useOatPageContext();
    if (existingContext) {
        return <>{children}</>;
    }

    const { initialState = {} } = props;

    // set the initial state for the Deeplink reducer
    // use the URL values and then fallback to initial state that is provided
    const defaultState: IOatPageContextState = {
        adtUrl: initialState.adtUrl || '',
        selection: null,
        models: getStoredEditorModelsData(),
        templatesActive: false,
        importModels: [],
        isJsonUploaderOpen: false,
        templates: getStoredEditorTemplateData(),
        modelPositions: getStoredEditorModelPositionsData(),
        projectName: null,
        modified: false,
        error: null,
        namespace: getStoredEditorNamespaceData(),
        confirmDeleteOpen: { open: false },
        modelsMetadata: getStoredEditorModelMetadata()
    };

    const [oatPageState, oatPageDispatch] = useReducer(
        OatPageContextReducer,
        defaultState
    );

    return (
        <OatPageContext.Provider
            value={{
                oatPageDispatch,
                oatPageState
            }}
        >
            {children}
        </OatPageContext.Provider>
    );
};
