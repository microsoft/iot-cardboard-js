/**
 * This context is for managing the state and actions on the Ontology Authoring Tool page
 */
import produce from 'immer';
import React, { useContext, useReducer } from 'react';
import i18n from '../../../i18n';
import { IOatPropertyEditorTabKey } from '../../../Pages/OATEditorPage/Internal/Classes/OatTypes';
import {
    IOatProjectData,
    ProjectData
} from '../../../Pages/OATEditorPage/Internal/Classes/ProjectData';
import {
    OAT_DEFAULT_CONTEXT,
    OAT_DEFAULT_PATH_VALUE
} from '../../Constants/Constants';
import {
    getOntologiesFromStorage,
    getLastUsedProjectId,
    getAvailableLanguages
} from '../../Services/OatUtils';
import { createGUID, deepCopy, getDebugLogger } from '../../Services/Utils';
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
    convertStateToProject,
    deleteModelFromState,
    setSelectedModel,
    updateModelId,
    addTargetedRelationship,
    addNewModelToState,
    addUntargetedRelationship,
    getModelIndexById,
    getModelById,
    getReferenceIndexByName,
    deleteReferenceFromState
} from './OatPageContextUtils';

const debugLogging = false;
export const logDebugConsole = getDebugLogger('OatPageContext', debugLogging);

export const OatPageContext = React.createContext<IOatPageContext>(null);
export const useOatPageContext = () => useContext(OatPageContext);

/** used exclusively for storybook, should always be true in production */
export let isOatContextStorageEnabled =
    true || process.env.NODE_ENV === 'production';

export const MAX_MODEL_COUNT = 70;

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
                    action.payload.defaultPath,
                    action.payload.defaultContext,
                    draft
                );
                break;
            }
            case OatPageContextActionType.EDIT_PROJECT: {
                draft.currentOntologyDefaultPath = action.payload.defaultPath.replace(
                    / /g,
                    ''
                );
                draft.currentOntologyProjectName = action.payload.name;
                draft.currentOntologyDefaultContext =
                    action.payload.defaultContext;
                saveData(draft);
                break;
            }
            case OatPageContextActionType.DELETE_PROJECT: {
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
                        const path = OAT_DEFAULT_PATH_VALUE;
                        const context = OAT_DEFAULT_CONTEXT;
                        createProject(name, path, context, draft);
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
                project.projectName = `${project.projectName}-${i18n.t(
                    'OATCommon.duplicateFileNameSuffix'
                )}`;
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
                setSelectedModel(draft.selection, draft);
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
                draft.currentOntologyDefaultPath =
                    action.payload.namespace || '';
                saveData(draft);
                break;
            }
            case OatPageContextActionType.SET_CURRENT_PROJECT: {
                draft.currentOntologyModelPositions =
                    action.payload.modelPositions;
                draft.currentOntologyModels = action.payload.models;
                draft.currentOntologyModelMetadata =
                    action.payload.modelsMetadata;
                draft.currentOntologyDefaultPath = action.payload.defaultPath;
                draft.currentOntologyProjectName =
                    action.payload.projectName || '';
                draft.currentOntologyTemplates = action.payload.templates;
                break;
            }
            case OatPageContextActionType.DELETE_MODEL: {
                const targetModel = draft.currentOntologyModels.find(
                    (x) => x['@id'] === action.payload.id
                );
                if (!targetModel) {
                    logDebugConsole(
                        'warn',
                        `Could not find model (id: ${action.payload.id}) to delete in state.`
                    );
                    break;
                }
                setSelectedModel(null, draft);
                deleteModelFromState(
                    targetModel['@id'],
                    targetModel['@type'],
                    draft
                );
                draft.graphUpdatesToSync = {
                    actionType: 'Delete',
                    models: [targetModel]
                };
                saveData(draft);
                break;
            }
            case OatPageContextActionType.DELETE_REFERENCE: {
                const { modelId, nameOrTarget, referenceType } = action.payload;
                const targetModel = draft.currentOntologyModels.find(
                    (x) => x['@id'] === modelId
                );
                if (!targetModel) {
                    logDebugConsole(
                        'warn',
                        `Could not find model (id: ${modelId}) to modify.`
                    );
                    break;
                }
                setSelectedModel(null, draft);
                deleteReferenceFromState({
                    state: draft,
                    modelId: modelId,
                    referenceType: referenceType,
                    nameOrTarget: nameOrTarget
                });
                saveData(draft);
                break;
            }
            case OatPageContextActionType.GENERAL_UNDO: {
                draft.currentOntologyModels = action.payload.models;
                draft.currentOntologyModelPositions = action.payload.positions;
                setSelectedModel(action.payload.selection, draft);
                saveData(draft);
                break;
            }
            case OatPageContextActionType.UPDATE_MODEL: {
                const { model } = action.payload;
                // find model
                const index = getModelIndexById(
                    draft.currentOntologyModels,
                    model['@id']
                );
                if (index > -1) {
                    logDebugConsole(
                        'debug',
                        'Updating model at index: ',
                        index
                    );
                    // update value
                    draft.currentOntologyModels[index] = deepCopy(model);
                    saveData(draft);
                } else {
                    logDebugConsole(
                        'warn',
                        'Did not find existing model to update with id ' +
                            model['@id']
                    );
                }
                break;
            }
            case OatPageContextActionType.UPDATE_REFERENCE: {
                const { modelId, reference } = action.payload;
                if (!modelId) {
                    logDebugConsole(
                        'warn',
                        'Model id cannot be null. Unable to update reference. {reference}',
                        reference
                    );
                    break;
                }
                // find model
                const model = getModelById(
                    draft.currentOntologyModels,
                    modelId
                );
                if (model) {
                    // find the reference
                    const referenceIndex = getReferenceIndexByName(
                        model,
                        reference.name
                    );
                    if (referenceIndex > -1 && model.contents) {
                        // update value
                        model.contents[referenceIndex] = deepCopy(reference);
                        saveData(draft);
                    } else {
                        logDebugConsole(
                            'warn',
                            'Did not find existing reference to update on model with name ' +
                                reference.name
                        );
                    }
                } else {
                    logDebugConsole(
                        'warn',
                        'Did not find existing model with id ' + modelId
                    );
                }
                break;
            }
            case OatPageContextActionType.UPDATE_MODEL_ID: {
                const { newId, existingId } = action.payload;
                updateModelId(
                    existingId,
                    newId,
                    draft.currentOntologyModels,
                    draft.currentOntologyModelPositions
                );

                // const
                draft.graphUpdatesToSync = {
                    actionType: 'Update',
                    models: [
                        {
                            newModel: draft.currentOntologyModels.find(
                                (x) => x['@id'] === newId
                            ),
                            oldId: existingId
                        }
                    ]
                };

                // Note: not sure why the deep copy is here, but leaving it since it seemed intentional before the refactor
                const newSelection =
                    draft.selection && draft.selection.contentId
                        ? deepCopy(draft.selection)
                        : { modelId: newId };

                setSelectedModel(newSelection, draft);
                saveData(draft);
                break;
            }
            case OatPageContextActionType.UPDATE_MODEL_POSTIONS: {
                action.payload.models.forEach((item) => {
                    const currentPosition = draft.currentOntologyModelPositions.find(
                        (x) => x['@id'] === item['@id']
                    );
                    if (currentPosition) {
                        // update existing
                        currentPosition.position.x = item.position.x;
                        currentPosition.position.y = item.position.y;
                    } else {
                        // add new entry
                        draft.currentOntologyModelPositions.push(item);
                    }
                });
                saveData(draft);
                break;
            }
            case OatPageContextActionType.UPDATE_IMPORT_PROGRESS: {
                draft.importState = action.payload;
                break;
            }
            case OatPageContextActionType.IMPORT_MODELS: {
                const { models } = action.payload;
                if (models?.length > 0) {
                    const newModels = deepCopy(draft.currentOntologyModels);
                    models.forEach((modelToAdd) => {
                        if (
                            !draft.currentOntologyModels.find(
                                (x) => x['@id'] === modelToAdd['@id']
                            )
                        ) {
                            newModels.push(modelToAdd);
                        }
                    });
                    draft.currentOntologyModels = newModels;
                }
                saveData(draft);
                break;
            }
            case OatPageContextActionType.ADD_NEW_MODEL: {
                if (draft.currentOntologyModels?.length >= MAX_MODEL_COUNT) {
                    draft.error = {
                        title: i18n.t('OAT.ImportLimits.title'),
                        message: i18n.t('OAT.ImportLimits.message', {
                            count: MAX_MODEL_COUNT
                        })
                    };
                    break;
                }
                const newModel = addNewModelToState(draft);
                setSelectedModel(
                    {
                        modelId: newModel['@id']
                    },
                    draft
                );
                // need to send this to the graph component to figure out the relative coordinates for the new model to use
                draft.graphUpdatesToSync = {
                    actionType: 'Add',
                    models: [newModel]
                };
                saveData(draft);
                break;
            }
            case OatPageContextActionType.ADD_NEW_RELATIONSHIP: {
                if (action.payload.type === 'Targeted') {
                    const {
                        relationshipType,
                        sourceModelId,
                        targetModelId
                    } = action.payload;
                    addTargetedRelationship(
                        draft,
                        sourceModelId,
                        targetModelId,
                        relationshipType
                    );
                } else {
                    const { sourceModelId, position } = action.payload;
                    addUntargetedRelationship(draft, sourceModelId, position);
                }
                saveData(draft);
                break;
            }
            case OatPageContextActionType.ADD_NEW_MODEL_WITH_RELATIONSHIP: {
                if (draft.currentOntologyModels?.length >= MAX_MODEL_COUNT) {
                    draft.error = {
                        title: 'Model limit reached',
                        message: `Currently the model count in an ontology is limited to ${MAX_MODEL_COUNT}. We appologize for the incovenience`
                    };
                    break;
                }
                const {
                    position,
                    relationshipType,
                    sourceModelId
                } = action.payload;
                const targetModel = addNewModelToState(draft, position);
                addTargetedRelationship(
                    draft,
                    sourceModelId,
                    targetModel['@id'],
                    relationshipType
                );
                saveData(draft);

                break;
            }
            case OatPageContextActionType.GRAPH_SET_MODELS_TO_SYNC: {
                draft.graphUpdatesToSync = action.payload;
                break;
            }
            case OatPageContextActionType.CLEAR_GRAPH_LAYOUT: {
                draft.triggerGraphLayout = false;
                break;
            }
            case OatPageContextActionType.PERFORM_GRAPH_LAYOUT: {
                draft.triggerGraphLayout = true;
                break;
            }
            case OatPageContextActionType.GRAPH_CLEAR_MODELS_TO_SYNC: {
                draft.graphUpdatesToSync = { actionType: 'None' };
                break;
            }
            case OatPageContextActionType.SET_SELECTED_PROPERTY_EDITOR_TAB: {
                draft.selectedPropertyEditorTab = action.payload.selectedTabKey;
                break;
            }
            case OatPageContextActionType.SET_OAT_ERROR: {
                draft.error = action.payload;
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
                draft.confirmDialog = action.payload;
                break;
            }
            case OatPageContextActionType.SET_OAT_SELECTED_MODEL: {
                setSelectedModel(action.payload.selection, draft);
                break;
            }
            case OatPageContextActionType.SET_UPLOAD_FILE_CALLBACK: {
                draft.openUploadFileCallback = action.payload.callback;
                break;
            }
            case OatPageContextActionType.SET_UPLOAD_FOLDER_CALLBACK: {
                draft.openUploadFolderCallback = action.payload.callback;
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
            'Mount OatPageContextProvider. {state, storageEnabled}',
            oatPageState,
            isOatContextStorageEnabled
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
    currentOntologyDefaultPath: '',
    currentOntologyDefaultContext: '',
    currentOntologyProjectName: '',
    currentOntologyTemplates: [],
    // other properties
    importState: { state: 'closed' },
    triggerGraphLayout: false,
    confirmDialog: { open: false },
    languageOptions: [],
    error: null,
    graphUpdatesToSync: { actionType: 'None' },
    isJsonUploaderOpen: false,
    modified: false,
    selection: null,
    templatesActive: false,
    selectedPropertyEditorTab: IOatPropertyEditorTabKey.Properties,
    openUploadFileCallback: null,
    openUploadFolderCallback: null
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

    let project: IOatProjectData;
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
            'Bootstrapping OAT context with existing project. {projectId}',
            projectIdToUse
        );
    } else if (!files.length || !lastProjectId) {
        // create a project if none exists
        project = new ProjectData(
            i18n.t('OATCommon.defaultFileName'),
            OAT_DEFAULT_PATH_VALUE,
            OAT_DEFAULT_CONTEXT,
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

    const state: IOatPageContextState = {
        ...initialState,
        // files
        ontologyFiles: files,
        // onotology
        currentOntologyId: projectIdToUse,
        currentOntologyModelMetadata: project.modelsMetadata,
        currentOntologyModelPositions: project.modelPositions,
        currentOntologyModels: project.models,
        currentOntologyDefaultPath: project.defaultPath,
        currentOntologyDefaultContext:
            project.defaultContext || OAT_DEFAULT_CONTEXT, // backfill any old projects
        currentOntologyProjectName: project.projectName,
        currentOntologyTemplates: project.templates,
        languageOptions: getAvailableLanguages(i18n)
    };

    logDebugConsole(
        'debug',
        'Initialized context state. {projectId, state}',
        projectIdToUse,
        state
    );

    return state;
};
