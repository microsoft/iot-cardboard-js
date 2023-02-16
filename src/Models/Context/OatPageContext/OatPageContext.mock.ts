/** File for exporting common testing utilities for the context */

import i18n from '../../../i18n';
import {
    IOATFile,
    IOatPropertyEditorTabKey
} from '../../../Pages/OATEditorPage/Internal/Classes/OatTypes';
import { ProjectData } from '../../../Pages/OATEditorPage/Internal/Classes/ProjectData';
import {
    IOATModelPosition,
    IOATModelsMetadata
} from '../../../Pages/OATEditorPage/OATEditorPage.types';
import {
    DTDLProperty,
    DTDLType,
    DTDL_CONTEXT_VERSION_2
} from '../../Classes/DTDL';
import {
    DtdlInterface,
    DtdlInterfaceContent,
    OatReferenceType
} from '../../Constants';
import {
    buildModelId,
    getAvailableLanguages,
    parseModelId
} from '../../Services/OatUtils';
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

export const getMockModelItem = (
    id: string,
    modelVersion?: string | string[]
): DtdlInterface => {
    const modelName = parseModelId(id).name;
    return {
        '@id': id,
        '@context': modelVersion ?? DTDL_CONTEXT_VERSION_2,
        '@type': DTDLType.Interface,
        comment: 'mock-comment',
        contents: [],
        description: 'mock-description',
        displayName: modelName || `mock_name_${id}`, // simplify life for places in the tests we don't care about the actual parsing.,
        extends: [],
        schemas: []
    };
};

export const getMockReference = (
    id: string,
    type: OatReferenceType
): DtdlInterfaceContent => {
    return {
        '@type': type,
        name: 'mock_relationship_' + id,
        schema: 'boolean'
    };
};

const getMockTemplateItem = (id: string): DTDLProperty => {
    return new DTDLProperty(
        `template-${id}`,
        'string',
        id,
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
        path: `${namespace}:folder1:folder2`,
        version: 2
    });
    const modelId2 = buildModelId({
        modelName: 'model' + subId2,
        path: `${namespace}:folder1:folder2`,
        version: 2
    });
    return {
        id: 'test-ontology-' + index,
        data: new ProjectData(
            'test-ontology-name-' + index,
            namespace,
            null,
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
        confirmDialog: { open: false },
        currentOntologyId: files[0].id,
        currentOntologyModelMetadata: currentFile.modelsMetadata,
        currentOntologyModelPositions: currentFile.modelPositions,
        currentOntologyModels: currentFile.models,
        currentOntologyDefaultPath: currentFile.defaultPath,
        currentOntologyDefaultContext: currentFile.defaultContext,
        currentOntologyProjectName: currentFile.projectName,
        currentOntologyTemplates: currentFile.templates,
        languageOptions: getAvailableLanguages(i18n),
        triggerGraphLayout: false,
        importState: { state: 'closed' },
        error: undefined,
        graphUpdatesToSync: { actionType: 'None' },
        isJsonUploaderOpen: false,
        modified: false,
        ontologyFiles: files,
        selection: undefined,
        selectedPropertyEditorTab: IOatPropertyEditorTabKey.Properties,
        templatesActive: false,
        openUploadFileCallback: null,
        openUploadFolderCallback: null
    };
};
