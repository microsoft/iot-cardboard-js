import { ProjectData } from '../../Pages/OATEditorPage/Internal/Classes';
import { IOATFile } from '../../Pages/OATEditorPage/Internal/Classes/OatTypes';
import { IOATModelPosition } from '../../Pages/OATEditorPage/OATEditorPage.types';
import { DTDLModel } from '../Classes/DTDL';
import {
    OATDataStorageKey,
    DtdlInterface,
    DtdlRelationship,
    DtdlInterfaceContent,
    OATFilesStorageKey,
    OATUntargetedRelationshipName
} from '../Constants';
import { deepCopy } from './Utils';

// Store OAT-data
export const storeEditorData = (oatEditorData: ProjectData) => {
    localStorage.setItem(OATDataStorageKey, JSON.stringify(oatEditorData));
};

// Get stored OAT-data
export const getStoredEditorData = (): ProjectData => {
    return JSON.parse(localStorage.getItem(OATDataStorageKey));
};

// Get stored template OAT-data
export const getStoredEditorTemplateData = () => {
    const oatData = getStoredEditorData();
    return oatData && oatData.templates ? oatData.templates : [];
};

// Get stored models OAT-data
export const getStoredEditorModelsData = () => {
    const oatData = getStoredEditorData();
    return oatData && oatData.models ? oatData.models : [];
};

// Get stored models' positions OAT-data
export const getStoredEditorModelPositionsData = () => {
    const oatData = getStoredEditorData();
    return oatData && oatData.modelsData && oatData.modelsData.modelPositions
        ? oatData.modelsData.modelPositions
        : [];
};

export const getStoredEditorModelMetadata = () => {
    const oatData = getStoredEditorData();
    return oatData && oatData.modelsData && oatData.modelsData.modelsMetadata
        ? oatData.modelsData.modelsMetadata
        : [];
};

// Get stored models' namespace OAT-data
export const getStoredEditorNamespaceData = () => {
    const oatData = getStoredEditorData();
    return oatData && oatData.namespace ? oatData.namespace : null;
};

export const updateModelId = (
    oldId: string,
    newId: string,
    models: DtdlInterface[],
    modelPositions: IOATModelPosition[]
) => {
    // Update the modelPositions
    const modelsPositionsCopy = deepCopy(modelPositions);

    // Find the model position with the same id
    const modelPosition = modelsPositionsCopy.find((x) => x['@id'] === oldId);
    if (modelPosition) {
        modelPosition['@id'] = newId;
    }

    // Update models
    const modelsCopy = deepCopy(models);
    const modelCopy = modelsCopy.find((x) => x['@id'] === oldId);
    if (modelCopy) {
        modelCopy['@id'] = newId;
    }

    // Update contents
    modelsCopy.forEach((m) =>
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

    return [modelsCopy, modelsPositionsCopy];
};

// Get fileName from DTMI
export const getFileNameFromDTMI = (dtmi: string) => {
    // Get id path - Get section between last ":" and ";"
    const initialPosition = dtmi.lastIndexOf(':') + 1;
    const finalPosition = dtmi.lastIndexOf(';');

    if (initialPosition !== 0 && finalPosition !== -1) {
        const idPath = dtmi.substring(initialPosition, finalPosition);
        const idVersion = dtmi.substring(
            dtmi.lastIndexOf(';') + 1,
            dtmi.length
        );
        return `${idPath}-${idVersion}`;
    }
};

// Get directoryPath from DTMI
export const getDirectoryPathFromDTMI = (dtmi: string) => {
    const initialPosition = dtmi.indexOf(':') + 1;
    const finalPosition = dtmi.lastIndexOf(':');

    if (initialPosition !== 0 && finalPosition !== -1) {
        const directoryPath = dtmi.substring(initialPosition, finalPosition);
        // Scheme - replace ":" with "\"
        return directoryPath.replace(':', '\\');
    }
};

/**
 * takes in a group of dtdl interfaces and builds the models objects.
 * since the properties overlap, we simply map them between objects
 */
export const convertDtdlInterfacesToModels = (
    dtdlInterfaces: DtdlInterface[]
): DTDLModel[] => {
    return dtdlInterfaces.map(convertDtdlInterfaceToModel);
};
export const convertDtdlInterfaceToModel = (
    dtdlInterface: DtdlInterface
): DTDLModel => {
    return new DTDLModel(
        dtdlInterface['@id'],
        dtdlInterface.displayName,
        dtdlInterface.description,
        dtdlInterface.comment,
        [],
        [],
        []
    );
};

// Load files from local storage
export const loadOatFiles = (): IOATFile[] =>
    JSON.parse(localStorage.getItem(OATFilesStorageKey)) || [];

// Save files from local storage
export const saveOatFiles = (files: IOATFile[]) => {
    localStorage.setItem(OATFilesStorageKey, JSON.stringify(files));
};

// Delete model
export const deleteOatModel = (id, data, models) => {
    const modelsCopy = deepCopy(models);
    if (data['@type'] === OATUntargetedRelationshipName) {
        const match = modelsCopy.find(
            (element) => element['@id'] === data['@id']
        );
        if (match) {
            match.contents = match.contents.filter(
                (content) => content['@id'] !== id
            );
        }
    } else {
        const index = modelsCopy.findIndex((m) => m['@id'] === data['@id']);
        if (index >= 0) {
            modelsCopy.splice(index, 1);
            modelsCopy.forEach((m) => {
                m.contents = m.contents.filter(
                    (content) =>
                        content.target !== data['@id'] &&
                        content.schema !== data['@id']
                );
                if (m.extends) {
                    m.extends = (m.extends as string[]).filter(
                        (ex) => ex !== data['@id']
                    );
                }
            });
        }
    }

    return modelsCopy;
};
