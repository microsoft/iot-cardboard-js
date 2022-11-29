/** File for exporting common testing utilities for the context */

import { IOATFile } from '../../../Pages/OATEditorPage/Internal/Classes/OatTypes';
import { ProjectData } from '../../../Pages/OATEditorPage/Internal/Classes/ProjectData';
import {
    IOATModelPosition,
    IOATModelsMetadata
} from '../../../Pages/OATEditorPage/OATEditorPage.types';
import { DTDLModel, DTDLProperty } from '../../Classes/DTDL';
import { buildModelId, parseModelId } from '../../Services/OatUtils';
import { IOatPageContextState } from './OatPageContext.types';

const getMockMetadataItem = (id: string): IOATModelsMetadata => {
    return {
        '@id': id,
        directoryPath: `directory1/${id.substring(0, 3)}`,
        fileName: `file-${id.substring(0, 3)}`
    };
};

const getMockPositionItem = (id: string): IOATModelPosition => {
    return {
        '@id': id,
        position: {
            x: 10,
            y: 20
        }
    };
};

export const getMockModelItem = (id: string): DTDLModel => {
    const modelName = parseModelId(id).name;
    return new DTDLModel(
        id,
        modelName || `mock_name_${id}`, // simplify life for places in the tests we don't care about the actual parsing.
        'mock-description',
        'mock-comment',
        [],
        [],
        [],
        []
    );
};

const getMockTemplateItem = (id: string): DTDLProperty => {
    return new DTDLProperty(
        id,
        `template-${id}`,
        'string',
        `template-comment-${id}`,
        `description-${id.substring(2)}`,
        `template-name-${id}`,
        'unit 1',
        false
    );
};

export const getMockFile = (
    index: number,
    subId1: string,
    subId2: string
): IOATFile => {
    const namespace = 'test-ontology-namespace-' + index;
    const modelId1 = buildModelId({
        modelName: 'model' + subId1,
        namespace: namespace,
        path: 'folder1:folder2',
        version: 2
    });
    const modelId2 = buildModelId({
        modelName: 'model' + subId2,
        namespace: namespace,
        path: 'folder1:folder2',
        version: 2
    });
    return {
        id: 'test-ontology-' + index,
        data: new ProjectData(
            'test-ontology-name-' + index,
            namespace,
            [getMockModelItem(modelId1), getMockModelItem(modelId2)],
            [getMockPositionItem(modelId1), getMockPositionItem(modelId2)],
            [getMockMetadataItem(modelId1), getMockMetadataItem(modelId2)],
            [getMockTemplateItem(modelId1), getMockTemplateItem(modelId2)]
        )
    };
};

export const GET_MOCK_OAT_CONTEXT_STATE = (): IOatPageContextState => {
    const files = [
        getMockFile(0, '123456', '234567'),
        getMockFile(1, '345678', '456789'),
        getMockFile(2, '5678910', '6789101')
    ];
    const currentFile = files[0].data;
    return {
        confirmDeleteOpen: { open: false },
        currentOntologyId: files[0].id,
        currentOntologyModelMetadata: currentFile.modelsMetadata,
        currentOntologyModelPositions: currentFile.modelPositions,
        currentOntologyModels: currentFile.models,
        currentOntologyNamespace: currentFile.namespace,
        currentOntologyProjectName: currentFile.projectName,
        currentOntologyTemplates: currentFile.templates,
        triggerGraphLayout: false,
        error: null,
        graphUpdatesToSync: { actionType: 'None' },
        isJsonUploaderOpen: false,
        modified: false,
        ontologyFiles: files,
        selectedModelTarget: null,
        selection: null,
        templatesActive: false
    };
};
