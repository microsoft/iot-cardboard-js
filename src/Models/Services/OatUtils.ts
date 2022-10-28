import { i18n } from 'i18next';
import { IOATFile } from '../../Pages/OATEditorPage/Internal/Classes/OatTypes';
import { IOATModelPosition } from '../../Pages/OATEditorPage/OATEditorPage.types';
import { DTDLModel } from '../Classes/DTDL';
import {
    DtdlInterface,
    DtdlRelationship,
    DtdlInterfaceContent,
    OAT_FILES_STORAGE_KEY,
    OAT_LAST_PROJECT_STORAGE_KEY,
    OAT_MODEL_ID_PREFIX,
    OAT_INTERFACE_TYPE
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

/** Gets the last used project id */
export const getLastUsedProjectId = (): string => {
    const data = localStorage.getItem(OAT_LAST_PROJECT_STORAGE_KEY);
    return data ? JSON.parse(data) : '';
};

// Load files from local storage
export const getOntologiesFromStorage = (): IOATFile[] => {
    const files: IOATFile[] =
        JSON.parse(localStorage.getItem(OAT_FILES_STORAGE_KEY)) || [];
    files.sort((a, b) => {
        const aVal = a.data?.projectName?.toLowerCase();
        const bVal = b.data?.projectName?.toLowerCase();
        return aVal > bVal ? 1 : -1;
    });
    return files;
};
// Save files from local storage
export const storeOntologiesToStorage = (files: IOATFile[]) => {
    localStorage.setItem(OAT_FILES_STORAGE_KEY, JSON.stringify(files));
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
    const model = deepCopy(dtdlInterface);
    return new DTDLModel(
        model['@id'],
        model.displayName,
        model.description,
        model.comment,
        model.contents?.filter((x) => x['@type'] === 'Property'),
        model.contents?.filter((x) => x['@type'] === 'Relationship'),
        model.contents?.filter((x) => x['@type'] === 'Component'),
        model.extends as string[] // we know it's an array since we only ever set it to array
    );
};

/**
 * Looks at the existing models and generates a new name until it finds a unique name
 * @param existingModels current set of models in the graph
 * @param namespace the namespace for the current ontology
 * @param defaultNamePrefix the name prefix for models (ex: "Model")
 * @returns the id string for the new model
 */
export const getNextModel = (
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
        nextModelId = buildModelId(
            namespace,
            `${defaultNamePrefix.toLowerCase()}${nextModelIdIndex}`
        );
        index = existingModels.findIndex(
            (element) => element['@id'] === nextModelId
        );
    }

    const name = `${defaultNamePrefix}${nextModelIdIndex}`;
    return { id: nextModelId, name: name };
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

export function ensureIsArray(property: string | string[]): string[] {
    return Array.isArray(property) ? property : [property] || [];
}

/** does some cleanup on the entities to make them properly shaped for DTDL since we need some extra stuff to manage the lifecycle within the app */
export function convertModelToDtdl(model: DtdlInterface): DtdlInterface {
    const newModel = deepCopy(model);
    newModel.contents?.forEach((x) => {
        if (x['@type'] !== OAT_INTERFACE_TYPE) {
            delete x['@id'];
        }
    });
    // console.log(`***Converted ${model['@id']}. {model}`, newModel);
    return newModel;
}

const DEFAULT_VERSION_NUMBER = 1;
/**
 * builds out the version id string for a model
 * @param namespace namespace for the current ontology
 * @param modelName name of the model
 * @param version version number for the model. If omitted, will use the default value
 * @returns string for the id of the model
 */
export function buildModelId(
    namespace: string,
    modelName: string,
    version?: number
): string {
    const versionNumber = isDefined(version) ? version : DEFAULT_VERSION_NUMBER;
    return `${OAT_MODEL_ID_PREFIX}:${namespace?.replace(
        / /g,
        ''
    )}:${modelName?.replace(/ /g, '')};${versionNumber}`;
}
