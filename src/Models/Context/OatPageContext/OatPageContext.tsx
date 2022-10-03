/**
 * This context is for managing the state and actions on the Ontology Authoring Tool page
 */
import produce from 'immer';
import React, { useContext, useReducer } from 'react';
import { getTargetFromSelection } from '../../../Components/OATPropertyEditor/Utils';
import { IOATFile } from '../../../Pages/OATEditorPage/Internal/Classes/OatTypes';
import { ProjectData } from '../../../Pages/OATEditorPage/Internal/Classes/ProjectData';
import {
    getStoredEditorModelsData,
    getStoredEditorTemplateData,
    getStoredEditorModelPositionsData,
    getStoredEditorNamespaceData,
    getStoredEditorModelMetadata,
    convertDtdlInterfacesToModels,
    storeEditorData,
    getOntologiesFromStorage,
    storeOntologiesToStorage,
    storeLastUsedProjectId,
    getLastUsedProjectId
} from '../../Services/OatUtils';
import { createGUID, deepCopy, getDebugLogger } from '../../Services/Utils';
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
            case OatPageContextActionType.SET_OAT_CREATE_PROJECT: {
                const project = new ProjectData(
                    [],
                    [],
                    action.payload.name,
                    [],
                    action.payload.namespace.replace(/ /g, ''),
                    []
                );
                const id = createGUID();
                const storedFiles: IOATFile[] = [
                    ...getOntologiesFromStorage(),
                    { id: id, data: project }
                ];
                storeOntologiesToStorage(storedFiles);
                setProjectId(draft, id);
                logDebugConsole(
                    'debug',
                    `Created new project with id: ${id}, {project}`,
                    project
                );
                break;
            }
            case OatPageContextActionType.SET_OAT_EDIT_PROJECT: {
                draft.namespace = action.payload.namespace.replace(/ /g, '');
                draft.projectName = action.payload.name;
                // TODO: look through the project data and update any references to the namespace when it changes
                saveData(draft);
                break;
            }
            case OatPageContextActionType.SET_OAT_DELETE_PROJECT: {
                const storedFiles = getOntologiesFromStorage();
                const index = storedFiles.findIndex(
                    (x) => x.id === action.payload.id
                );
                if (index >= 0) {
                    storedFiles.splice(index, 1);
                } else {
                    logDebugConsole(
                        'warn',
                        `Could not find project to delete with id: ${action.payload.id}`
                    );
                }
                saveData(draft);
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
                saveData(draft);
                break;
            }
            case OatPageContextActionType.SET_OAT_MODELS_METADATA: {
                draft.modelsMetadata = action.payload.metadata || [];
                saveData(draft);
                break;
            }
            case OatPageContextActionType.SET_OAT_MODELS_POSITIONS: {
                draft.modelPositions = action.payload.positions || [];
                saveData(draft);
                break;
            }
            case OatPageContextActionType.SET_OAT_MODIFIED: {
                draft.modified = action.payload.isModified || false;
                break;
            }
            case OatPageContextActionType.SET_OAT_NAMESPACE: {
                draft.namespace = action.payload.namespace || '';
                saveData(draft);
                break;
            }
            case OatPageContextActionType.SET_OAT_PROJECT_ID: {
                setProjectId(draft, action.payload.projectId);
                break;
            }
            case OatPageContextActionType.SET_OAT_PROJECT: {
                // TODO: Deprecate in favor of setting via id
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
                saveData(draft);
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
                saveData(draft);
                break;
            }
            case OatPageContextActionType.SET_OAT_TEMPLATES_ACTIVE: {
                draft.templatesActive = action.payload.isActive || false;
                break;
            }
        }
    }
);

function setProjectId(draft: IOatPageContextState, projectId: string) {
    draft.ontologyId = projectId;
    const storedFiles = getOntologiesFromStorage();
    const selectedFile = storedFiles.find((x) => x.id === draft.ontologyId);
    if (selectedFile) {
        const data = selectedFile.data;
        const projectToOpen = new ProjectData(
            data.modelPositions,
            convertDtdlInterfacesToModels(data.models),
            data.projectName,
            data.templates,
            data.namespace,
            data.modelsMetadata
        );
        draft.modelPositions = projectToOpen.modelPositions;
        draft.models = projectToOpen.models;
        draft.modelsMetadata = projectToOpen.modelsMetadata;
        draft.namespace = projectToOpen.namespace;
        draft.projectName = projectToOpen.projectName || '';
        draft.templates = projectToOpen.templates;
    }
    storeLastUsedProjectId(draft.ontologyId);
}

function saveData(draft: IOatPageContextState): void {
    saveEditorData(draft);
    saveOntologyFiles(draft);
}

/** TODO: remove this helper when we move the project data into a sub object on the state */
function getProjectDataFromState(draft: IOatPageContextState): ProjectData {
    return new ProjectData(
        draft.modelPositions,
        convertDtdlInterfacesToModels(draft.models),
        draft.projectName,
        draft.templates,
        draft.namespace,
        draft.modelsMetadata
    );
}

function saveEditorData(draft: IOatPageContextState): void {
    const projectData = getProjectDataFromState(draft);
    storeEditorData(projectData);
    logDebugConsole(
        'debug',
        'Saved editor data to storage. {data}',
        projectData
    );
}

function saveOntologyFiles(draft: IOatPageContextState): void {
    const filesCopy = deepCopy(getOntologiesFromStorage());
    const selectedOntology = filesCopy.find((x) => x.id === draft.ontologyId);
    if (selectedOntology) {
        selectedOntology.data = getProjectDataFromState(draft);
    } else {
        logDebugConsole(
            'warn',
            `Unable to persist the state data to local storage. Onotology with id: ${draft.ontologyId} wasn't found in storage.`
        );
    }
    storeOntologiesToStorage(filesCopy);
    logDebugConsole('debug', 'Saved files to storage. {files}', filesCopy);
}

export const OatPageContextProvider: React.FC<IOatPageContextProviderProps> = (
    props
) => {
    const { children, initialState } = props;

    // skip wrapping if the context already exists
    const existingContext = useOatPageContext();
    if (existingContext) {
        return <>{children}</>;
    }
    // set the initial state for the Deeplink reducer
    // use the URL values and then fallback to initial state that is provided
    const defaultState: IOatPageContextState = {
        confirmDeleteOpen: { open: false },
        error: null,
        importModels: [],
        isJsonUploaderOpen: false,
        modelPositions: getStoredEditorModelPositionsData(),
        models: getStoredEditorModelsData(),
        modelsMetadata: getStoredEditorModelMetadata(),
        modified: false,
        namespace: getStoredEditorNamespaceData(),
        ontologyId: getLastUsedProjectId(),
        projectName: null,
        selectedModelTarget: null,
        selection: null,
        templates: getStoredEditorTemplateData(),
        templatesActive: false,
        ...initialState
    };

    const [oatPageState, oatPageDispatch] = useReducer(
        OatPageContextReducer,
        defaultState
    );

    // TODO: read local storage on mount and dispatch to SET_OAT_PROJECT_ID so all the other properties get hydrated properly

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
