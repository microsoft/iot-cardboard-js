import { i18n } from 'i18next';
import { IOATFile } from '../../Pages/OATEditorPage/Internal/Classes/OatTypes';
import { IOATModelPosition } from '../../Pages/OATEditorPage/OATEditorPage.types';
import { DTDLModel } from '../Classes/DTDL';
import {
    DtdlInterface,
    DtdlRelationship,
    DtdlInterfaceContent,
    OAT_FILES_STORAGE_KEY,
    OAT_UNTARGETED_RELATIONSHIP_NAME,
    OAT_LAST_PROJECT_STORAGE_KEY,
    OAT_MODEL_ID_PREFIX
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
    return data ? data : '';
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
        model.contents?.filter((x) => x['@type'] === 'Component')
    );
};

// Delete model
export const deleteOatModel = (
    id: string,
    data: DtdlInterface,
    models: DtdlInterface[],
    positions: IOATModelPosition[]
) => {
    const modelsCopy = deepCopy(models);
    const positionsCopy = deepCopy(positions);
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

    const index = positionsCopy.findIndex((x) => x['@id'] === id);
    positionsCopy.splice(index, 1);

    return { models: modelsCopy, positions: positionsCopy };
};

/**
 * Looks at the existing models and generates a new name until it finds a unique name
 * @param existingModels current set of models in the graph
 * @param namespace the namespace for the current ontology
 * @param defaultNamePrefix the name prefix for models (ex: "Model")
 * @returns the id string for the new model
 */
export const getNextModelId = (
    existingModels: DtdlInterface[],
    namespace: string,
    defaultNamePrefix: string
): string => {
    // Identifies which is the next model Id on creating new nodes
    let nextModelIdIndex = -1;
    let nextModelId = '';
    let index = 0;
    while (index !== -1) {
        nextModelIdIndex++;
        nextModelId = buildModelId(
            namespace,
            `${defaultNamePrefix}${nextModelIdIndex}`
        );
        index = existingModels.findIndex(
            (element) => element['@id'] === nextModelId
        );
    }

    return nextModelId;
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
