/** File for exporting common testing utilities for the context */

import { IOATFile } from '../../../Pages/OATEditorPage/Internal/Classes/OatTypes';
import { ProjectData } from '../../../Pages/OATEditorPage/Internal/Classes/ProjectData';
import {
    IOATModelPosition,
    IOATModelsMetadata
} from '../../../Pages/OATEditorPage/OATEditorPage.types';
import { DTDLModel, DTDLProperty } from '../../Classes/DTDL';
import { IOatPageContextState } from './OatPageContext.types';

const getMetadataItem = (id: string): IOATModelsMetadata => {
    return {
        '@id': id,
        directoryPath: `directory1/${id.substring(0, 3)}`,
        fileName: `file-${id.substring(0, 3)}`
    };
};

const getPositionItem = (id: string): IOATModelPosition => {
    return {
        '@id': id,
        position: {
            x: 10,
            y: 20
        }
    };
};

const getModelItem = (id: string): DTDLModel => {
    return new DTDLModel(
        id,
        `model-${id}`,
        'mock-description',
        'mock-comment',
        [],
        [],
        []
    );
};

const getTemplateItem = (id: string): DTDLProperty => {
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

const getFile = (index: number, subId1: string, subId2: string): IOATFile => {
    return {
        id: 'test-ontology-' + index,
        data: new ProjectData(
            [getPositionItem(subId1), getPositionItem(subId2)],
            [getModelItem(subId1), getModelItem(subId2)],
            'test-ontology-name-' + index,
            [getTemplateItem('0'), getTemplateItem(subId2)],
            'test-ontology-namespace-' + index,
            [getMetadataItem(subId1), getMetadataItem(subId2)]
        )
    };
};

export const GET_MOCK_OAT_CONTEXT_STATE = (): IOatPageContextState => {
    const files = [
        getFile(0, '123456', '234567'),
        getFile(1, '345678', '456789'),
        getFile(2, '5678910', '6789101')
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
        error: null,
        importModels: [],
        isJsonUploaderOpen: false,
        modified: false,
        ontologyFiles: files,
        selectedModelTarget: null,
        selection: null,
        templatesActive: false
    };
};
