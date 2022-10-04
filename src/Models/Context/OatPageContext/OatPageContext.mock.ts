/** File for exporting common testing utilities for the context */

import {
    IOATModelPosition,
    IOATModelsMetadata
} from '../../../Pages/OATEditorPage/OATEditorPage.types';
import { DTDLProperty } from '../../Classes/DTDL';
import { DtdlInterface } from '../../Constants/dtdlInterfaces';
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

const getModelItem = (id: string): DtdlInterface => {
    return {
        '@context': `test-context-${id.substring(0, 4)}`,
        '@id': id,
        '@type': `test-type-${id.substring(0, 2)}`,
        displayName: `model-${id}`
    };
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

const MOCK_ID_1 = '123456';
const MOCK_ID_2 = '234567';
export const GET_MOCK_OAT_CONTEXT_STATE = (): IOatPageContextState => ({
    confirmDeleteOpen: { open: false },
    currentOntologyId: 'test-ontology-0',
    currentOntologyModelMetadata: [
        getMetadataItem(MOCK_ID_1),
        getMetadataItem(MOCK_ID_2)
    ],
    currentOntologyModelPositions: [
        getPositionItem(MOCK_ID_1),
        getPositionItem(MOCK_ID_2)
    ],
    currentOntologyModels: [getModelItem(MOCK_ID_1), getModelItem(MOCK_ID_2)],
    currentOntologyNamespace: 'test-ontology-namespace-0',
    currentOntologyProjectName: 'test-ontology-name-0',
    currentOntologyTemplates: [
        getTemplateItem('0'),
        getTemplateItem(MOCK_ID_2)
    ],
    error: null,
    importModels: [],
    isJsonUploaderOpen: false,
    modified: false,
    selectedModelTarget: null,
    selection: null,
    templatesActive: false
});
