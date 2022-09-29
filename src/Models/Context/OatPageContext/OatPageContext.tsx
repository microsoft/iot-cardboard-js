/**
 * This context is for managing the state and actions on the Ontology Authoring Tool page
 */
import produce from 'immer';
import React, { useContext, useReducer } from 'react';
import { getTargetFromSelection } from '../../../Components/OATPropertyEditor/Utils';
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

const debugLogging = true;
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
            `Updating OAT Page context ${action.type} with payload: `,
            action.payload
        );
        switch (action.type) {
            case OatPageContextActionType.SET_OAT_CONFIRM_DELETE_OPEN: {
                draft.confirmDeleteOpen = action.payload;
                break;
            }
            case OatPageContextActionType.SET_OAT_ERROR: {
                draft.error = action.payload;
                break;
            }
            case OatPageContextActionType.SET_OAT_IMPORT_MODELS: {
                draft.importModels = action.payload.models || [];
                break;
            }
            case OatPageContextActionType.SET_OAT_IS_JSON_UPLOADER_OPEN: {
                draft.isJsonUploaderOpen = action.payload.isOpen || false;
                break;
            }
            case OatPageContextActionType.SET_OAT_MODELS: {
                draft.models = action.payload.models || [];
                if (draft.models && draft.selection) {
                    draft.selectedModelTarget = getTargetFromSelection(
                        draft.models,
                        draft.selection
                    );
                }
                break;
            }
            case OatPageContextActionType.SET_OAT_MODELS_METADATA: {
                draft.modelsMetadata = action.payload.metadata || [];
                break;
            }
            case OatPageContextActionType.SET_OAT_MODELS_POSITIONS: {
                draft.modelPositions = action.payload.positions || [];
                break;
            }
            case OatPageContextActionType.SET_OAT_MODIFIED: {
                draft.modified = action.payload.isModified || false;
                break;
            }
            case OatPageContextActionType.SET_OAT_NAMESPACE: {
                draft.namespace = action.payload.namespace || '';
                break;
            }
            case OatPageContextActionType.SET_OAT_PROJECT: {
                draft.modelPositions = action.payload.modelPositions;
                draft.models = action.payload.models;
                draft.modelsMetadata = action.payload.modelsMetadata;
                draft.namespace = action.payload.namespace;
                draft.projectName = action.payload.projectName || '';
                draft.templates = action.payload.templates;
                break;
            }
            case OatPageContextActionType.SET_OAT_PROJECT_NAME: {
                draft.projectName = action.payload.name || '';
                break;
            }
            case OatPageContextActionType.SET_OAT_SELECTED_MODEL: {
                draft.selection = action.payload.selection;
                if (draft.models && draft.selection) {
                    draft.selectedModelTarget = getTargetFromSelection(
                        draft.models,
                        draft.selection
                    );
                }
                break;
            }
            case OatPageContextActionType.SET_OAT_TEMPLATES: {
                draft.templates = action.payload.templates || [];
                break;
            }
            case OatPageContextActionType.SET_OAT_TEMPLATES_ACTIVE: {
                draft.templatesActive = action.payload.isActive || false;
                break;
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
    // set the initial state for the Deeplink reducer
    // use the URL values and then fallback to initial state that is provided
    const defaultState: IOatPageContextState = {
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
        modelsMetadata: getStoredEditorModelMetadata(),
        selectedModelTarget: null
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
