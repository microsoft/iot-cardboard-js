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

/** used exclusively for storybook, should always be true in production */
export const isStorageEnabled = true || process.env.NODE_ENV === 'production';

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
                isStorageEnabled && storeOntologiesToStorage(storedFiles);
                setProjectId(draft, id);
                logDebugConsole(
                    'debug',
                    `Created new project with id: ${id}, {project}`,
                    project
                );
                break;
            }
            case OatPageContextActionType.SET_OAT_EDIT_PROJECT: {
                draft.currentOntologyNamespace = action.payload.namespace.replace(
                    / /g,
                    ''
                );
                draft.currentOntologyProjectName = action.payload.name;
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
                draft.currentOntologyModels = action.payload.models || [];
                if (draft.currentOntologyModels && draft.selection) {
                    draft.selectedModelTarget = getTargetFromSelection(
                        draft.currentOntologyModels,
                        draft.selection
                    );
                }
                saveData(draft);
                break;
            }
            case OatPageContextActionType.SET_OAT_MODELS_METADATA: {
                draft.currentOntologyModelMetadata =
                    action.payload.metadata || [];
                saveData(draft);
                break;
            }
            case OatPageContextActionType.SET_OAT_MODELS_POSITIONS: {
                draft.currentOntologyModelPositions =
                    action.payload.positions || [];
                saveData(draft);
                break;
            }
            case OatPageContextActionType.SET_OAT_MODIFIED: {
                draft.modified = action.payload.isModified || false;
                break;
            }
            case OatPageContextActionType.SET_OAT_NAMESPACE: {
                draft.currentOntologyNamespace = action.payload.namespace || '';
                saveData(draft);
                break;
            }
            case OatPageContextActionType.SET_OAT_PROJECT_ID: {
                setProjectId(draft, action.payload.projectId);
                break;
            }
            case OatPageContextActionType.SET_OAT_PROJECT: {
                // TODO: Deprecate in favor of setting via id
                draft.currentOntologyModelPositions =
                    action.payload.modelPositions;
                draft.currentOntologyModels = action.payload.models;
                draft.currentOntologyModelMetadata =
                    action.payload.modelsMetadata;
                draft.currentOntologyNamespace = action.payload.namespace;
                draft.currentOntologyProjectName =
                    action.payload.projectName || '';
                draft.currentOntologyTemplates = action.payload.templates;
                break;
            }
            case OatPageContextActionType.SET_OAT_PROJECT_NAME: {
                draft.currentOntologyProjectName = action.payload.name || '';
                saveData(draft);
                break;
            }
            case OatPageContextActionType.SET_OAT_SELECTED_MODEL: {
                draft.selection = action.payload.selection;
                if (draft.currentOntologyModels && draft.selection) {
                    draft.selectedModelTarget = getTargetFromSelection(
                        draft.currentOntologyModels,
                        draft.selection
                    );
                }
                break;
            }
            case OatPageContextActionType.SET_OAT_TEMPLATES: {
                draft.currentOntologyTemplates = action.payload.templates || [];
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
    draft.currentOntologyId = projectId;
    const storedFiles = getOntologiesFromStorage();
    const selectedFile = storedFiles.find(
        (x) => x.id === draft.currentOntologyId
    );
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
        draft.currentOntologyModelPositions = projectToOpen.modelPositions;
        draft.currentOntologyModels = projectToOpen.models;
        draft.currentOntologyModelMetadata = projectToOpen.modelsMetadata;
        draft.currentOntologyNamespace = projectToOpen.namespace;
        draft.currentOntologyProjectName = projectToOpen.projectName || '';
        draft.currentOntologyTemplates = projectToOpen.templates;
    }
    storeLastUsedProjectId(draft.currentOntologyId);
}

function saveData(draft: IOatPageContextState): void {
    saveEditorData(draft);
    saveOntologyFiles(draft);
}

/** TODO: remove this helper when we move the project data into a sub object on the state */
function getProjectDataFromState(draft: IOatPageContextState): ProjectData {
    return new ProjectData(
        draft.currentOntologyModelPositions,
        convertDtdlInterfacesToModels(draft.currentOntologyModels),
        draft.currentOntologyProjectName,
        draft.currentOntologyTemplates,
        draft.currentOntologyNamespace,
        draft.currentOntologyModelMetadata
    );
}

function saveEditorData(draft: IOatPageContextState): void {
    const projectData = getProjectDataFromState(draft);
    if (isStorageEnabled) {
        storeEditorData(projectData);
        logDebugConsole(
            'debug',
            'Saved editor data to storage. {data}',
            projectData
        );
    } else {
        logDebugConsole(
            'warn',
            'Stroage disabled. Skipping saving editor data. {data}',
            projectData
        );
    }
}

function saveOntologyFiles(draft: IOatPageContextState): void {
    const filesCopy = deepCopy(getOntologiesFromStorage());
    const selectedOntology = filesCopy.find(
        (x) => x.id === draft.currentOntologyId
    );
    if (selectedOntology) {
        selectedOntology.data = getProjectDataFromState(draft);
    } else {
        logDebugConsole(
            'warn',
            `Unable to persist the state data to local storage. Onotology with id: ${draft.currentOntologyId} wasn't found in storage.`
        );
    }
    if (isStorageEnabled) {
        storeOntologiesToStorage(filesCopy);
        logDebugConsole('debug', 'Saved files to storage. {files}', filesCopy);
    } else {
        logDebugConsole(
            'warn',
            'Storage disabled. Skipping saving files. {files}',
            filesCopy
        );
    }
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
        currentOntologyId: getLastUsedProjectId(),
        currentOntologyModelMetadata: getStoredEditorModelMetadata(),
        currentOntologyModelPositions: getStoredEditorModelPositionsData(),
        currentOntologyModels: getStoredEditorModelsData(),
        currentOntologyNamespace: getStoredEditorNamespaceData(),
        currentOntologyProjectName: null,
        currentOntologyTemplates: getStoredEditorTemplateData(),
        error: null,
        importModels: [],
        isJsonUploaderOpen: false,
        modified: false,
        selectedModelTarget: null,
        selection: null,
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
