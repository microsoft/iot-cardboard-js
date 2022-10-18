/**
 * This context is for managing the state and actions on the Ontology Authoring Tool page
 */
import produce from 'immer';
import React, { useContext, useReducer } from 'react';
import { getTargetFromSelection } from '../../../Components/OATPropertyEditor/Utils';
import i18n from '../../../i18n';
import { ProjectData } from '../../../Pages/OATEditorPage/Internal/Classes/ProjectData';
import {
    OAT_MODEL_ID_PREFIX,
    OAT_NAMESPACE_DEFAULT_VALUE
} from '../../Constants/Constants';
import {
    getOntologiesFromStorage,
    getLastUsedProjectId
} from '../../Services/OatUtils';
import { createGUID, getDebugLogger } from '../../Services/Utils';
import {
    IOatPageContext,
    IOatPageContextProviderProps,
    IOatPageContextState,
    OatPageContextAction,
    OatPageContextActionType
} from './OatPageContext.types';
import {
    createProject,
    saveData,
    switchCurrentProject,
    convertStateToProject
} from './OatPageContextUtils';

const debugLogging = true;
export const logDebugConsole = getDebugLogger('OatPageContext', debugLogging);

export const OatPageContext = React.createContext<IOatPageContext>(null);
export const useOatPageContext = () => useContext(OatPageContext);

/** used exclusively for storybook, should always be true in production */
export let isOatContextStorageEnabled =
    true || process.env.NODE_ENV === 'production';

export const OatPageContextReducer: (
    draft: IOatPageContextState,
    action: OatPageContextAction
) => IOatPageContextState = produce(
    (draft: IOatPageContextState, action: OatPageContextAction) => {
        logDebugConsole(
            'info',
            `Updating OAT Page context ${action.type} with payload: `,
            (action as any).payload // sometimes doesn't have payload
        );
        switch (action.type) {
            case OatPageContextActionType.CREATE_PROJECT: {
                createProject(
                    action.payload.name,
                    action.payload.namespace,
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
            case OatPageContextActionType.SET_OAT_DELETE_PROJECT: {
                const index = draft.ontologyFiles.findIndex(
                    (x) => x.id === action.payload.id
                );
                if (index >= 0) {
                    // remove the matching project
                    draft.ontologyFiles.splice(index, 1);

                    const fileCount = draft.ontologyFiles.length;
                    if (fileCount > index) {
                        // switch to the next project in the list
                        const projectId = draft.ontologyFiles[index].id;
                        switchCurrentProject(projectId, draft);
                    } else if (fileCount > 0) {
                        // switch to the first project in the list
                        switchCurrentProject(draft.ontologyFiles[0].id, draft);
                    } else {
                        // create a new project if none exist to switch to
                        const name = i18n.t('OATCommon.defaultFileName');
                        const namespace = OAT_NAMESPACE_DEFAULT_VALUE;
                        createProject(name, namespace, draft);
                    }
                } else {
                    logDebugConsole(
                        'warn',
                        `Could not find project to delete with id: ${action.payload.id}`
                    );
                }
                saveData(draft);
                break;
            }
            case OatPageContextActionType.DUPLICATE_PROJECT: {
                const id = createGUID();
                // duplicate the project
                const project = convertStateToProject(draft);
                project.projectName =
                    project.projectName +
                    '-' +
                    i18n.t('OATCommon.duplicateFileNameSuffix');
                draft.ontologyFiles.push({ id: id, data: project });

                // save data
                saveData(draft);

                // switch to the new project
                switchCurrentProject(id, draft);

                logDebugConsole(
                    'debug',
                    `Created new project with id: ${id}, {project}`,
                    project
                );
                break;
            }
            case OatPageContextActionType.SWITCH_CURRENT_PROJECT: {
                switchCurrentProject(action.payload.projectId, draft);
                break;
            }
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
            case OatPageContextActionType.SET_OAT_MODELS_TO_ADD: {
                const { models } = action.payload;
                draft.modelsToAdd = models || [];
                break;
            }
            case OatPageContextActionType.CLEAR_OAT_MODELS_TO_ADD: {
                draft.modelsToAdd = [];
                break;
            }
            case OatPageContextActionType.SET_OAT_ERROR: {
                draft.error = action.payload;
                break;
            }
            case OatPageContextActionType.SET_OAT_IMPORT_MODELS: {
                draft.modelsToImport = action.payload.models || [];
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

export const OatPageContextProvider: React.FC<IOatPageContextProviderProps> = React.memo(
    (props) => {
        const { children, initialState, disableLocalStorage } = props;
        isOatContextStorageEnabled =
            disableLocalStorage === true ? false : true;

        // skip wrapping if the context already exists
        const existingContext = useOatPageContext();
        if (existingContext) {
            return <>{children}</>;
        }

        const [oatPageState, oatPageDispatch] = useReducer(
            OatPageContextReducer,
            { ...emptyState, ...initialState },
            getInitialState
        );

        logDebugConsole(
            'debug',
            'Mount OatPageContextProvider. {state}',
            oatPageState
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
    }
);

const emptyState: IOatPageContextState = {
    // onotology
    ontologyFiles: [],
    currentOntologyId: '',
    currentOntologyModelMetadata: [],
    currentOntologyModelPositions: [],
    currentOntologyModels: [],
    currentOntologyNamespace: '',
    currentOntologyProjectName: '',
    currentOntologyTemplates: [],
    // other properties
    confirmDeleteOpen: { open: false },
    error: null,
    modelsToImport: [],
    modelsToAdd: [],
    isJsonUploaderOpen: false,
    modified: false,
    selectedModelTarget: null,
    selection: null,
    templatesActive: false
};

const getInitialState = (
    initialState: IOatPageContextState
): IOatPageContextState => {
    // use the default state if it's provided (mostly for test cases)
    const files = !isOatContextStorageEnabled
        ? initialState.ontologyFiles
        : getOntologiesFromStorage();
    // use the default state if it's provided (mostly for test cases)
    const lastProjectId = !isOatContextStorageEnabled
        ? initialState.currentOntologyId
        : getLastUsedProjectId();

    let project: ProjectData;
    let projectIdToUse = '';
    if (files.length > 0 && lastProjectId) {
        if (files.some((x) => x.id === lastProjectId)) {
            projectIdToUse = lastProjectId;
        } else {
            projectIdToUse = files[0].id;
        }
        project = files.find((x) => x.id === projectIdToUse).data;
        logDebugConsole(
            'debug',
            'Bootstrapping OAT context with existing project.'
        );
    } else if (!files.length || !lastProjectId) {
        // create a project if none exists
        project = new ProjectData(
            i18n.t('OATCommon.defaultFileName'),
            OAT_NAMESPACE_DEFAULT_VALUE,
            [],
            [],
            [],
            []
        );
        projectIdToUse = createGUID();
        logDebugConsole(
            'debug',
            'Did not find existing project. Creating a new one.'
        );
        files.push({
            id: projectIdToUse,
            data: project
        });
    }

    const state = {
        ...initialState,
        // files
        ontologyFiles: files,
        // onotology
        currentOntologyId: projectIdToUse,
        currentOntologyModelMetadata: project.modelsMetadata,
        currentOntologyModelPositions: project.modelPositions,
        currentOntologyModels: project.models,
        currentOntologyNamespace: project.namespace,
        currentOntologyProjectName: project.projectName,
        currentOntologyTemplates: project.templates
    };

    logDebugConsole(
        'debug',
        'Initialized context state. {projectId, state}',
        projectIdToUse,
        state
    );

    return state;
};
