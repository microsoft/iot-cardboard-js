import i18n from '../../../i18n';
import { getDisplayName } from '../../../Components/OATPropertyEditor/Utils';
import { ProjectData } from '../../../Pages/OATEditorPage/Internal/Classes';
import { IOATFile } from '../../../Pages/OATEditorPage/Internal/Classes/OatTypes';
import {
    IOATModelPosition,
    IOATSelection
} from '../../../Pages/OATEditorPage/OATEditorPage.types';
import { DTDLSchema, DTDLType } from '../../Classes/DTDL';
import {
    DtdlComponent,
    DtdlInterface,
    DtdlInterfaceContent,
    DtdlRelationship,
    IOATNodePosition,
    OatGraphReferenceType,
    OatReferenceType,
    OAT_GRAPH_REFERENCE_TYPE,
    OAT_INTERFACE_TYPE,
    OAT_UNTARGETED_RELATIONSHIP_NAME
} from '../../Constants';
import {
    buildModelId,
    convertDtdlInterfacesToModels,
    ensureIsArray,
    getUntargetedRelationshipNodeId,
    isUntargeted,
    storeLastUsedProjectId,
    storeOntologiesToStorage
} from '../../Services/OatUtils';
import {
    createGUID,
    deepCopy,
    sortCaseInsensitive
} from '../../Services/Utils';
import { isOatContextStorageEnabled, logDebugConsole } from './OatPageContext';
import { IOatPageContextState } from './OatPageContext.types';
import { CONTEXT_CLASS_BASE } from '../../../Components/OATGraphViewer/Internal/Utils';
import {
    isDTDLComponentReference,
    isDTDLProperty,
    isDTDLReference,
    isDTDLRelationshipReference
} from '../../Services/DtdlUtils';

//#region Add/remove models

/**
 * Looks at the existing models and generates a new name until it finds a unique name
 * @param existingModels current set of models in the graph
 * @param namespace the namespace for the current ontology
 * @param defaultNamePrefix the name prefix for models (ex: "Model")
 * @returns the id string for the new model
 */
const getNextModelInfo = (
    existingModels: DtdlInterface[],
    namespace: string,
    defaultNamePrefix: string
) => {
    // Identifies which is the next model Id on creating new nodes
    let nextModelIdIndex = -1;
    let nextModelId = '';
    let index = 0;
    while (index !== -1) {
        nextModelIdIndex++;
        nextModelId = buildModelId({
            namespace,
            modelName: `${defaultNamePrefix.toLowerCase()}${nextModelIdIndex}`
        });
        index = existingModels.findIndex(
            (element) => element['@id'] === nextModelId
        );
    }

    const name = `${defaultNamePrefix}${nextModelIdIndex}`;
    return { id: nextModelId, name: name };
};
const getNewModel = (id: string, modelName: string) => {
    const model: DtdlInterface = {
        '@context': CONTEXT_CLASS_BASE,
        '@id': id,
        '@type': OAT_INTERFACE_TYPE,
        contents: [],
        displayName: modelName
    };

    return model;
};
export const addNewModelToState = (
    state: IOatPageContextState,
    modelPosition?: IOATNodePosition
): DtdlInterface => {
    const modelInfo = getNextModelInfo(
        state.currentOntologyModels,
        state.currentOntologyNamespace,
        i18n.t('OATCommon.defaultModelNamePrefix')
    );
    const newModel: DtdlInterface = getNewModel(modelInfo.id, modelInfo.name);

    // add to the models list
    if (!state.currentOntologyModels) {
        state.currentOntologyModels = [newModel];
    } else {
        state.currentOntologyModels.push(newModel);
    }

    // position is not included on a new model add from header since we need to get the relative location from the graph
    if (modelPosition) {
        const position: IOATModelPosition = {
            '@id': newModel['@id'],
            position: modelPosition
        };
        // add to the positions list
        if (!state.currentOntologyModelPositions) {
            state.currentOntologyModelPositions = [position];
        } else {
            state.currentOntologyModelPositions.push(position);
        }
    }

    return newModel;
};
/** deletes all references of a model from the graph including relationships */
export const deleteModelFromState = (
    modelId: string,
    modelType: string,
    models: DtdlInterface[],
    positions: IOATModelPosition[]
) => {
    if (modelType === OAT_UNTARGETED_RELATIONSHIP_NAME) {
        const match = models.find((element) => element['@id'] === modelId);
        if (match) {
            match.contents = match.contents.filter(
                (content) => content['@id'] !== modelId
            );
        }
    } else {
        const index = models.findIndex((m) => m['@id'] === modelId);
        if (index >= 0) {
            // remove from models list
            models.splice(index, 1);
            models.forEach((m) => {
                // remove from relationship list of all models
                m.contents = m.contents.filter(
                    (content) =>
                        (!('target' in content) ||
                            content.target !== modelId) &&
                        (!('schema' in content) || content.schema !== modelId)
                );
                // remove from extends list for all models
                if (m.extends) {
                    m.extends = (m.extends as string[]).filter(
                        (ex) => ex !== modelId
                    );
                }
            });
        }
    }

    // remove from positions list
    const index = positions.findIndex((x) => x['@id'] === modelId);
    positions.splice(index, 1);

    return { models: models, positions: positions };
};

type DeleteReferenceArgs = {
    state: IOatPageContextState;
    modelId: string;
    referenceType: OatGraphReferenceType;
    nameOrTarget: string;
};

/** deletes all references of a model from the graph including relationships */
export const deleteReferenceFromState = (args: DeleteReferenceArgs) => {
    const { state, modelId } = args;

    const model = getModelById(state.currentOntologyModels, modelId);
    // console.log(
    //     '[START] Remove reference. {args, model}',
    //     args,
    //     current(model)
    // );
    if (!model) {
        console.error('Could not find model to delete');
        return false;
    }

    switch (args.referenceType) {
        case 'Untargeted':
        case DTDLType.Relationship:
            model.contents = model.contents?.filter(
                (x) =>
                    !isDTDLRelationshipReference(x) ||
                    (isDTDLRelationshipReference(x) &&
                        x.name !== args.nameOrTarget)
            );
            break;
        case DTDLType.Component:
            model.contents = model.contents?.filter(
                (x) =>
                    !isDTDLComponentReference(x) ||
                    (isDTDLComponentReference(x) &&
                        x.name !== args.nameOrTarget)
            );
            break;
        case 'Extend':
            model.extends = ensureIsArray(model.extends).filter(
                (x) => x !== args.nameOrTarget
            );
            break;
    }

    // if(args.referenceType === 'Relationship' || args.referenceType === 'Component'){
    //     const newContents =
    // }else if(args.referenceType)
    // console.log('[END] Remove reference. {model}', current(model));

    return true;
};

//#endregion

/**
 * Looks up the index of a model in a collection of models and returns the index.
 * Returns -1 if not found or if arguments are invalid
 */
export const getModelIndexById = (
    models: DtdlInterface[],
    modelId: string
): number => {
    if (models && modelId) {
        return models.findIndex((x) => x['@id'] === modelId);
    }
    return -1;
};

/**
 * Looks up a model in the collection by id and returns a reference
 * Returns undefined if not found or arguments are invalid
 */
export const getModelById = (
    models: DtdlInterface[],
    modelId: string
): DtdlInterface | undefined => {
    if (models && modelId) {
        const index = getModelIndexById(models, modelId);
        return models[index];
    }
    return undefined;
};

/**
 * Looks up the index of a reference in the contents of a model and returns the index.
 * Returns -1 if not found or if arguments are invalid
 */
export const getReferenceIndexByName = (
    model: DtdlInterface,
    referenceName: string
): number => {
    if (model && referenceName) {
        return model.contents.findIndex(
            (x) => x.name === referenceName && isDTDLReference(x)
        );
    }
    return -1;
};

/**
 * Looks up a reference in the contents of a model and returns the reference.
 * Returns undefined if not found or arguments are invalid
 */
export const getReferenceByName = (
    model: DtdlInterface,
    referenceName: string
): DtdlInterfaceContent | undefined => {
    if (model && referenceName) {
        const index = getReferenceIndexByName(model, referenceName);
        return model[index];
    }
    return undefined;
};

/**
 * Looks up the index of a property in the contents of a model and returns the index.
 * Returns -1 if not found or if arguments are invalid
 */
export const getPropertyIndexOnModelByName = (
    model: DtdlInterface,
    referenceName: string
): number => {
    if (model && referenceName) {
        return model.contents.findIndex(
            (x) => x.name === referenceName && isDTDLProperty(x)
        );
    }
    return -1;
};

/**
 * Looks up the index of a property in the contents of a model and returns the index.
 * Returns -1 if not found or if arguments are invalid
 */
export const getPropertyIndexOnRelationshipByName = (
    relationship: DtdlRelationship,
    referenceName: string
): number => {
    if (relationship && referenceName) {
        return relationship.properties.findIndex(
            (x) => x.name === referenceName && isDTDLProperty(x)
        );
    }
    return -1;
};

export const setSelectedModel = (
    selection: IOATSelection,
    draft: IOatPageContextState
): void => {
    draft.selection = selection;
};

/** looks up all references of an existing model id and replaces it with the new id */
export const updateModelId = (
    oldId: string,
    newId: string,
    models: DtdlInterface[],
    modelPositions: IOATModelPosition[]
) => {
    // Find the model position with the same id
    const modelPosition = modelPositions.find((x) => x['@id'] === oldId);
    if (modelPosition) {
        modelPosition['@id'] = newId;
    }

    // update all the untargeted relationships
    modelPositions.forEach((position) => {
        // if it's an untargeted relationship
        if (isUntargeted(position['@id'])) {
            position['@id'] = position['@id'].replace(oldId, newId);
        }
    });

    // Update model
    const modelReference = models.find((x) => x['@id'] === oldId);
    if (modelReference) {
        modelReference['@id'] = newId;
    }

    // Update contents
    models.forEach((m) =>
        m.contents.forEach((c) => {
            const r = c as DtdlRelationship;
            if (r && r.target === oldId) {
                r.target = newId;
            }
            if (r && r['@id'] === oldId) {
                r['@id'] = newId;
            }

            const p = c as DtdlInterfaceContent;
            if (p && 'schema' in p && p.schema === oldId) {
                p.schema = newId as DTDLSchema;
            }

            if (m.extends) {
                const e = m.extends as string[];
                const i = e.indexOf(oldId);
                if (i >= 0) {
                    e[i] = newId;
                }
            }
        })
    );

    return { models: models, positions: modelPositions };
};

//#region Creating new relationship

/** Loops the contents of a model to find the next available name */
function getNextName(
    sourceModel: DtdlInterface,
    namePrefix: string,
    type: DTDLType
) {
    let index = 0;
    // loop the contents and look for other entries with the same name, keep going till it's unique
    while (
        sourceModel.contents &&
        sourceModel.contents.some(
            (rel) =>
                rel['@type'] === type && rel.name === `${namePrefix}_${index}`
        )
    ) {
        index++;
    }
    return `${namePrefix}_${index}`;
}
const getNewComponent = (name: string, targetModelId: string) => {
    const component: DtdlComponent = {
        '@type': DTDLType.Component,
        name: name,
        schema: targetModelId
    };
    return component;
};
const getNewRelationship = (
    args:
        | {
              type: 'Targeted';
              name: string;
              targetModelId: string;
          }
        | { type: 'Untargeted'; name: string }
): DtdlRelationship => {
    if (args.type === 'Targeted') {
        return {
            '@type': DTDLType.Relationship,
            name: args.name,
            target: args.targetModelId
        };
    } else {
        return {
            '@type': DTDLType.Relationship,
            name: args.name
        };
    }
};

const getNextRelationshipName = (sourceModel: DtdlInterface) => {
    const prefix = OAT_GRAPH_REFERENCE_TYPE;
    return getNextName(sourceModel, prefix, DTDLType.Relationship);
};
/** gets a unique name for the relationship (scoped to the target model) */
const getNextComponentName = (
    sourceModel: DtdlInterface,
    targetModel: DtdlInterface
) => {
    const prefix = getDisplayName(targetModel.displayName);
    return getNextName(sourceModel, prefix, DTDLType.Component);
};
export const addTargetedRelationship = (
    state: IOatPageContextState,
    sourceModelId: string,
    targetModelId: string,
    relationshipType: OatReferenceType
) => {
    // get the target model
    const sourceModel = state.currentOntologyModels.find(
        (x) => x['@id'] === sourceModelId
    );
    logDebugConsole(
        'debug',
        '[START] Add targeted relationship to model. {source, target, relationshipType, originalModel}',
        sourceModelId,
        targetModelId,
        relationshipType,
        deepCopy(sourceModel)
    );
    if (!sourceModel) {
        console.error(
            'Could not find source node for creating new relationship. {source, target}',
            sourceModelId,
            targetModelId
        );
        return;
    }

    let newRelationship: DtdlInterfaceContent | string;
    if (
        relationshipType === DTDLType.Component ||
        relationshipType === DTDLType.Relationship
    ) {
        // component or relationship
        const targetModel = state.currentOntologyModels.find(
            (x) => x['@id'] === targetModelId
        );
        const modelName =
            relationshipType === 'Component'
                ? getNextComponentName(sourceModel, targetModel)
                : getNextRelationshipName(sourceModel);
        newRelationship =
            relationshipType === DTDLType.Component
                ? getNewComponent(modelName, targetModelId)
                : getNewRelationship({
                      type: 'Targeted',
                      name: modelName,
                      targetModelId
                  });
        sourceModel.contents = [...sourceModel.contents, newRelationship];
    } else if (relationshipType === 'Extend') {
        // extends
        const existing = new Set(sourceModel.extends);
        existing.add(targetModelId);
        sourceModel.extends = Array.from(existing).sort(sortCaseInsensitive());
        newRelationship = targetModelId;
    }
    logDebugConsole(
        'debug',
        '[END] Add targeted relationship to model. {source, target, relationshipType, finalModel}',
        sourceModelId,
        targetModelId,
        relationshipType,
        deepCopy(sourceModel)
    );
    return newRelationship;
};
export const addUntargetedRelationship = (
    state: IOatPageContextState,
    sourceModelId: string,
    position: IOATNodePosition
) => {
    // get the target model
    const sourceModel = state.currentOntologyModels.find(
        (x) => x['@id'] === sourceModelId
    );
    logDebugConsole(
        'debug',
        '[START] Add untargeted relationship to model. {source, originalModel}',
        sourceModelId,
        deepCopy(sourceModel)
    );
    if (!sourceModel) {
        console.error(
            'Could not find source node for creating new relationship. {source}',
            sourceModelId
        );
        return;
    }

    const modelName = getNextRelationshipName(sourceModel);
    const newRelationship = getNewRelationship({
        type: 'Untargeted',
        name: modelName
    });
    sourceModel.contents = [...sourceModel.contents, newRelationship];

    // capture the location information where the user dropped it so that the virtual node gets positioned at that location
    const nodeId = getUntargetedRelationshipNodeId(
        sourceModelId,
        newRelationship
    );
    const newPosition: IOATModelPosition = {
        '@id': nodeId,
        position: position
    };
    if (state.currentOntologyModelPositions) {
        state.currentOntologyModelPositions.push(newPosition);
    } else {
        state.currentOntologyModelPositions = [newPosition];
    }

    logDebugConsole(
        'debug',
        '[END] Add untargeted relationship to model. {source, finalModel}',
        sourceModelId,
        deepCopy(sourceModel)
    );
    return newRelationship;
};

//#endregion

//#region Project management

export function createProject(
    name: string,
    namespace: string,
    draft: IOatPageContextState
) {
    const id = createGUID();
    const project = new ProjectData(
        name,
        namespace.replace(/ /g, ''),
        [],
        [],
        [],
        []
    );
    draft.ontologyFiles.push({ id: id, data: project });

    saveData(draft);
    switchCurrentProject(id, draft);

    logDebugConsole(
        'debug',
        `Created new project with id: ${id}, {project}`,
        project
    );
}

export function switchCurrentProject(
    projectId: string,
    draft: IOatPageContextState
) {
    // do the swap
    draft.currentOntologyId = projectId;
    saveLastProjectId(draft.currentOntologyId);
    const selectedFile = draft.ontologyFiles.find(
        (x) => x.id === draft.currentOntologyId
    );
    if (selectedFile) {
        const data = selectedFile.data;
        const projectToOpen = new ProjectData(
            data.projectName,
            data.namespace,
            convertDtdlInterfacesToModels(data.models),
            data.modelPositions,
            data.modelsMetadata,
            data.templates
        );
        mapProjectOntoState(draft, projectToOpen);
        logDebugConsole(
            'debug',
            `Switched to project: ${draft.currentOntologyProjectName} (${draft.currentOntologyId}). {project}`,
            projectToOpen
        );
    } else {
        logDebugConsole(
            'warn',
            `Project not found in storage. Unable to find the current project to ${draft.currentOntologyId}`
        );
    }
}

/** TODO: remove this helper when we move the project data into a sub object on the state */
export function convertStateToProject(
    draft: IOatPageContextState
): ProjectData {
    // NOTE: need to recreate the arrays to break proxy links that were causing issues downstream
    const project = new ProjectData(
        draft.currentOntologyProjectName || '',
        draft.currentOntologyNamespace,
        convertDtdlInterfacesToModels(draft.currentOntologyModels),
        Array.from(draft.currentOntologyModelPositions),
        Array.from(draft.currentOntologyModelMetadata),
        Array.from(draft.currentOntologyTemplates)
    );

    return project;
}

export function mapProjectOntoState(
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

//#endregion

//#region Local storage

/** saves all the data to local storage */
export function saveData(draft: IOatPageContextState): void {
    const selectedOntology = draft.ontologyFiles.find(
        (x) => x.id === draft.currentOntologyId
    );
    if (selectedOntology) {
        selectedOntology.data = convertStateToProject(draft); // update the files list with the latest data
        const localDraft = deepCopy(draft); // copy to avoid the delayed proxy references
        saveOntologyFiles(localDraft.ontologyFiles);
        saveLastProjectId(localDraft.currentOntologyId);
    } else {
        logDebugConsole(
            'warn',
            `Unable to persist the state data to local storage. Onotology with id: ${draft.currentOntologyId} wasn't found in storage.`
        );
    }
}

export function saveLastProjectId(projectId: string): void {
    logDebugConsole(
        'debug',
        'Saving current project id to storage.',
        projectId
    );
    isOatContextStorageEnabled && storeLastUsedProjectId(projectId);
}

/**
 * Writes the collection of files to storage
 * @param files all files to be stored
 */
export function saveOntologyFiles(files: IOATFile[]): void {
    if (isOatContextStorageEnabled) {
        storeOntologiesToStorage(files);
        logDebugConsole(
            'debug',
            `Saved ${files.length} files to storage. {files}`,
            files
        );
    } else {
        logDebugConsole(
            'warn',
            'Storage disabled. Skipping saving files. {files}',
            files
        );
    }
}

//#endregion
