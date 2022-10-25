import { getTargetFromSelection } from '../../../Components/OATPropertyEditor/Utils';
import { ProjectData } from '../../../Pages/OATEditorPage/Internal/Classes';
import { IOATFile } from '../../../Pages/OATEditorPage/Internal/Classes/OatTypes';
import {
    IOATModelPosition,
    IOATSelection
} from '../../../Pages/OATEditorPage/OATEditorPage.types';
import {
    DtdlInterface,
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
