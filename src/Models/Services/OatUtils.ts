import { i18n } from 'i18next';
import { ProjectData } from '../../Pages/OATEditorPage/Internal/Classes';
import { IOATFile } from '../../Pages/OATEditorPage/Internal/Classes/OatTypes';
import { IOATModelPosition } from '../../Pages/OATEditorPage/OATEditorPage.types';
import { DTDLModel } from '../Classes/DTDL';
import {
    OAT_DATA_STORAGE_KEY,
    DtdlInterface,
    DtdlRelationship,
    DtdlInterfaceContent,
    OAT_FILES_STORAGE_KEY,
    OAT_UNTARGETED_RELATIONSHIP_NAME,
    OAT_LAST_PROJECT_STORAGE_KEY
} from '../Constants';
import { deepCopy, isDefined } from './Utils';

/**
 * Stores the last used project to local storage
 * @param id id for the project
 */
export const storeLastUsedProjectId = (id: string) => {
    localStorage.setItem(
        OAT_LAST_PROJECT_STORAGE_KEY,
        id ? JSON.stringify(id) : undefined
    );
};

/**
 * Gets the last used project id
 * @returns
 */
export const getLastUsedProjectId = (): string => {
    const data = localStorage.getItem(OAT_LAST_PROJECT_STORAGE_KEY);
    return data ? JSON.parse(data) : {};
};

// Store OAT-data
export const storeEditorData = (oatEditorData: ProjectData) => {
    localStorage.setItem(
        OAT_DATA_STORAGE_KEY,
        oatEditorData ? JSON.stringify(oatEditorData) : undefined
    );
};

// Get stored OAT-data
export const getStoredEditorData = (): ProjectData => {
    const data = localStorage.getItem(OAT_DATA_STORAGE_KEY);
    return data ? JSON.parse(data) : {};
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
    return oatData && oatData.modelPositions ? oatData.modelPositions : [];
};

export const getStoredEditorModelMetadata = () => {
    const oatData = getStoredEditorData();
    return oatData && oatData.modelsMetadata ? oatData.modelsMetadata : [];
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

    return { models: modelsCopy, positions: modelsPositionsCopy };
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
        dtdlInterface.contents.filter((x) => x['@type'] === 'Property'),
        dtdlInterface.contents.filter((x) => x['@type'] === 'Relationship'),
        dtdlInterface.contents.filter((x) => x['@type'] === 'Component')
    );
};

// Load files from local storage
export const getOntologiesFromStorage = (): IOATFile[] =>
    JSON.parse(localStorage.getItem(OAT_FILES_STORAGE_KEY)) || [];

// Save files from local storage
export const storeOntologiesToStorage = (files: IOATFile[]) => {
    localStorage.setItem(OAT_FILES_STORAGE_KEY, JSON.stringify(files));
};

// Delete model
export const deleteOatModel = (
    id: string,
    data: DtdlInterface,
    models: DtdlInterface[]
) => {
    const modelsCopy = deepCopy(models);
    if (data['@type'] === OAT_UNTARGETED_RELATIONSHIP_NAME) {
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

/**
 * Tries to parse a string to an object of type `T`. Returns null and eats any exception thrown in case of an error.
 * @param value string value to parse
 * @returns an object
 */
export const safeJsonParse = <T>(value: string): T | null => {
    if (!isDefined(value)) {
        return null;
    }
    try {
        const parsedJson = JSON.parse(value);
        return parsedJson;
    } catch (e) {
        return null;
    }
};

export function getAvailableLanguages(i18n: i18n) {
    return Object.keys(i18n.options.resources).map((language) => {
        return {
            key: (i18n.options.resources[language].translation as any)
                .languageCode,
            text: (i18n.options.resources[language].translation as any)
                .languageName
        };
    });
}

export function buildModelName(
    namespace: string,
    modelName: string,
    version: number
): string {
    return `dtmi:${namespace?.replace(/ /g, '')}:${modelName?.replace(
        / /g,
        ''
    )}:${version}`;
}
