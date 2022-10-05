/**
 * This context is for managing the state and actions on the Ontology Authoring Tool page
 */
import produce from 'immer';
import React, { useContext, useReducer } from 'react';
import { getTargetFromSelection } from '../../../Components/OATPropertyEditor/Utils';
import { IOATFile } from '../../../Pages/OATEditorPage/Internal/Classes/OatTypes';
import { ProjectData } from '../../../Pages/OATEditorPage/Internal/Classes/ProjectData';
import { OAT_MODEL_ID_PREFIX } from '../../Constants/Constants';
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
    getLastUsedProjectId,
    getStoredEditorName
} from '../../Services/OatUtils';
import { createGUID, getDebugLogger } from '../../Services/Utils';
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
let isStorageEnabled = true || process.env.NODE_ENV === 'production';
export const setContextStorageEnabled = (value: boolean): void => {
    logDebugConsole('warn', 'Setting context storage property to ', value);
    isStorageEnabled = value;
};

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
            case OatPageContextActionType.CREATE_PROJECT: {
                const { name, namespace } = action.payload;
                const project = new ProjectData(
                    [],
                    [],
                    name,
                    [],
                    namespace.replace(/ /g, ''),
                    []
                );
                const id = createGUID();
                draft.ontologyFiles.push({ id: id, data: project });

                saveData(draft);
                setCurrentProject(draft, id);

                logDebugConsole(
                    'debug',
                    `Created new project with id: ${id}, {project, state}`,
                    project,
                    draft
                );
                break;
            }
            case OatPageContextActionType.EDIT_PROJECT: {
                const previousNamespace = draft.currentOntologyNamespace;
                draft.currentOntologyNamespace = action.payload.namespace.replace(
                    / /g,
                    ''
                );
                draft.currentOntologyProjectName = action.payload.name;
                // look through the project data and update any references to the namespace when it changes
                logDebugConsole(
                    'debug',
                    'Updating project namespace to: ' +
                        draft.currentOntologyNamespace
                );
                if (previousNamespace !== draft.currentOntologyNamespace) {
                    draft.currentOntologyModels.forEach((x) => {
                        x['@id'] = x['@id'].replace(
                            `${OAT_MODEL_ID_PREFIX}:${previousNamespace}:`,
                            `${OAT_MODEL_ID_PREFIX}:${draft.currentOntologyProjectName}:`
                        );
                    });
                }
                saveData(draft);
                break;
            }
            // case OatPageContextActionType.SET_OAT_DUPLICATE_PROJECT: {
            //     const project = convertStateToProject(draft);
            //     const id = createGUID();
            //     const storedFiles: IOATFile[] = [
            //         ...getOntologiesFromStorage(),
            //         { id: id, data: project }
            //     ];
            //     isStorageEnabled && storeOntologiesToStorage(storedFiles);

            //     setCurrentProject(draft, id);

            //     logDebugConsole(
            //         'debug',
            //         `Created new project with id: ${id}, {project, state}`,
            //         project,
            //         draft
            //     );
            //     break;
            // }
            case OatPageContextActionType.SET_CURRENT_PROJECT_NAME: {
                draft.currentOntologyProjectName = action.payload.name || '';
                saveData(draft);
                break;
            }
            case OatPageContextActionType.SET_CURRENT_TEMPLATES: {
                draft.currentOntologyTemplates = action.payload.templates || [];
                saveData(draft);
                break;
            }
            case OatPageContextActionType.SET_CURRENT_MODELS: {
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
            case OatPageContextActionType.SET_CURRENT_MODELS_METADATA: {
                draft.currentOntologyModelMetadata =
                    action.payload.metadata || [];
                saveData(draft);
                break;
            }
            case OatPageContextActionType.SET_CURRENT_MODELS_POSITIONS: {
                draft.currentOntologyModelPositions =
                    action.payload.positions || [];
                saveData(draft);
                break;
            }
            case OatPageContextActionType.SET_CURRENT_NAMESPACE: {
                draft.currentOntologyNamespace = action.payload.namespace || '';
                saveData(draft);
                break;
            }
            case OatPageContextActionType.SWITCH_CURRENT_PROJECT: {
                setCurrentProject(draft, action.payload.projectId);
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
            case OatPageContextActionType.SET_OAT_MODIFIED: {
                draft.modified = action.payload.isModified || false;
                break;
            }
            case OatPageContextActionType.SET_OAT_CONFIRM_DELETE_OPEN: {
                draft.confirmDeleteOpen = action.payload;
                break;
            }
            case OatPageContextActionType.SET_CURRENT_PROJECT: {
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
            case OatPageContextActionType.SET_OAT_TEMPLATES_ACTIVE: {
                draft.templatesActive = action.payload.isActive || false;
                break;
            }
        }
    }
);

// function CreateProject(
//     name: string,
//     namespace: string,
//     draft: IOatPageContextState
// ) {
// }

function setCurrentProject(draft: IOatPageContextState, projectId: string) {
    draft.currentOntologyId = projectId;
    const selectedFile = draft.ontologyFiles.find(
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
        mapProjectToState(draft, projectToOpen);
        logDebugConsole(
            'debug',
            `Setting current project to id: ${draft.currentOntologyId}. {project, state}`,
            projectToOpen,
            draft
        );
    } else {
        logDebugConsole(
            'warn',
            `Project not found in storage. Unable to find the current project to ${draft.currentOntologyId}`
        );
    }
    storeLastUsedProjectId(draft.currentOntologyId);
}

function saveData(draft: IOatPageContextState): void {
    saveEditorData(draft);
    saveOntologyFiles(draft);
}

/** TODO: remove this helper when we move the project data into a sub object on the state */
function convertStateToProject(draft: IOatPageContextState): ProjectData {
    // NOTE: need to recreate the arrays to break proxy links that were causing issues downstream
    return new ProjectData(
        Array.from(draft.currentOntologyModelPositions),
        convertDtdlInterfacesToModels(draft.currentOntologyModels),
        draft.currentOntologyProjectName,
        Array.from(draft.currentOntologyTemplates),
        draft.currentOntologyNamespace,
        Array.from(draft.currentOntologyModelMetadata)
    );
}

function mapProjectToState(
    draft: IOatPageContextState,
    projectToOpen: ProjectData
) {
    draft.currentOntologyModelPositions = projectToOpen.modelPositions;
    draft.currentOntologyModels = projectToOpen.models;
    draft.currentOntologyModelMetadata = projectToOpen.modelsMetadata;
    draft.currentOntologyNamespace = projectToOpen.namespace;
    draft.currentOntologyProjectName = projectToOpen.projectName || '';
    draft.currentOntologyTemplates = projectToOpen.templates;
}

function saveEditorData(draft: IOatPageContextState): void {
    const projectData = convertStateToProject(draft);
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
            'Storage disabled. Skipping saving editor data. {data}',
            projectData
        );
    }
}

function saveOntologyFiles(draft: IOatPageContextState): void {
    const filesCopy: IOATFile[] = [...draft.ontologyFiles];
    const selectedOntology = filesCopy.find(
        (x) => x.id === draft.currentOntologyId
    );
    if (selectedOntology) {
        selectedOntology.data = convertStateToProject(draft);
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
        currentOntologyProjectName: getStoredEditorName(),
        currentOntologyTemplates: getStoredEditorTemplateData(),
        error: null,
        importModels: [],
        isJsonUploaderOpen: false,
        modified: false,
        ontologyFiles: getOntologiesFromStorage(),
        selectedModelTarget: null,
        selection: null,
        templatesActive: false,
        ...initialState
    };

    console.log('*** INITIAL STATE', defaultState.ontologyFiles);

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
