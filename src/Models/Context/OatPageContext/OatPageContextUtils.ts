import {
    getDisplayName,
    getTargetFromSelection
} from '../../../Components/OATPropertyEditor/Utils';
import { ProjectData } from '../../../Pages/OATEditorPage/Internal/Classes';
import { IOATFile } from '../../../Pages/OATEditorPage/Internal/Classes/OatTypes';
import {
    IOATModelPosition,
    IOATSelection
} from '../../../Pages/OATEditorPage/OATEditorPage.types';
import { DTDLComponent, DTDLRelationship, DTDLType } from '../../Classes/DTDL';
import {
    DtdlInterface,
    DtdlInterfaceContent,
    DtdlRelationship,
    OatRelationshipType,
    OAT_UNTARGETED_RELATIONSHIP_NAME
} from '../../Constants';
import {
    convertDtdlInterfacesToModels,
    storeLastUsedProjectId,
    storeOntologiesToStorage
} from '../../Services/OatUtils';
import { createGUID, deepCopy } from '../../Services/Utils';
import { isOatContextStorageEnabled, logDebugConsole } from './OatPageContext';
import { IOatPageContextState } from './OatPageContext.types';

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
                        content.target !== modelId && content.schema !== modelId
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

export const setSelectedModel = (
    selection: IOATSelection,
    draft: IOatPageContextState
): void => {
    draft.selection = selection;
    if (draft.currentOntologyModels && draft.selection) {
        draft.selectedModelTarget = getTargetFromSelection(
            draft.currentOntologyModels,
            draft.selection
        );
    } else {
        draft.selectedModelTarget = null;
    }
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

    // Update model
    const modelReference = models.find((x) => x['@id'] === oldId);
    if (modelReference) {
        modelReference['@id'] = newId;
    }

    console.log('***[BEFORE] Models', deepCopy(models));
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
            if (p && p.schema === oldId) {
                p.schema = newId;
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

    console.log('***[AFTER] models', deepCopy(models));

    return { models: models, positions: modelPositions };
};

const getNewComponent = (
    name: string,
    targetModelId: string
): DTDLComponent => {
    const component = new DTDLComponent(
        null, // id
        name, // name
        targetModelId //schema
    );
    // remove the property so it doesn't get stored
    delete component['@id'];
    return component;
};
const getNewRelationship = (
    name: string,
    targetModelId: string
): DtdlInterfaceContent => {
    const relationship = new DTDLRelationship(
        null, // id
        name, // name
        null, // display name
        null, // description
        null, // comment
        null, // writable
        null, // properties
        targetModelId // target
    );
    // remove the property so it doesn't get stored
    delete relationship['@id'];
    return relationship;
};

// const getNextRelationshipIndex = (
//     _sourceId: string,
//     elements: (ElementNode | ElementEdge)[]
// ) => {
//     let relationshipIndex = 0;
//     while (
//         elements.some(
//             (element) =>
//                 // TODO: reenable this. Turned it off for now because the parser needs them to be unique across all the models (which isn't supposed to be the case)
//                 // (element as ElementEdge).source === sourceId &&
//                 (element.data as DtdlRelationship).name ===
//                 `${OAT_GRAPH_RELATIONSHIP_NODE_TYPE}_${relationshipIndex}`
//         )
//     ) {
//         relationshipIndex++;
//     }
//     return relationshipIndex;
// };

/** gets a unique name for the relationship (scoped to the target model) */
const getNextComponentName = (
    sourceModel: DtdlInterface,
    targetModel: DtdlInterface
) => {
    let componentIndex = 0;
    const name = getDisplayName(targetModel.displayName);
    // loop the contents and look for other components with the same name, keep going till it's unique
    while (
        sourceModel.contents &&
        sourceModel.contents.some(
            (rel) =>
                rel['@type'] === DTDLType.Component &&
                rel.name === `${name}_${componentIndex}`
        )
    ) {
        componentIndex++;
    }
    return `${name}_${componentIndex}`;
};
export const addTargetedRelationship = (
    state: IOatPageContextState,
    sourceModelId: string,
    targetModelId: string,
    relationshipType: OatRelationshipType
) => {
    let newModel: DtdlInterfaceContent;
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

    if (
        relationshipType === 'Component' ||
        relationshipType === 'Relationship'
    ) {
        // component or relationship
        const targetModel = state.currentOntologyModels.find(
            (x) => x['@id'] === targetModelId
        );
        const modelName =
            relationshipType === 'Component'
                ? getNextComponentName(sourceModel, targetModel)
                : ''; // TODO: Add relationship
        newModel =
            relationshipType === 'Component'
                ? getNewComponent(modelName, targetModelId)
                : getNewRelationship(modelName, targetModelId);
        sourceModel.contents = [...sourceModel.contents, newModel];
    } else {
        // extends
    }
    logDebugConsole(
        'debug',
        '[END] Add targeted relationship to model. {source, target, relationshipType, finalModel}',
        sourceModelId,
        targetModelId,
        relationshipType,
        deepCopy(sourceModel)
    );
    return newModel;
};

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
    // console.log('***Converted project', project, current(draft));

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
