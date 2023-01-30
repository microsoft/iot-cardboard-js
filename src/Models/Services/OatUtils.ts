import { i18n } from 'i18next';
import { IOATFile } from '../../Pages/OATEditorPage/Internal/Classes/OatTypes';
import {
    DtdlInterface,
    OAT_FILES_STORAGE_KEY,
    OAT_LAST_PROJECT_STORAGE_KEY,
    OAT_MODEL_ID_PREFIX,
    OAT_INTERFACE_TYPE,
    DtdlInterfaceContent,
    OAT_UNTARGETED_RELATIONSHIP_ID_PREFIX
} from '../Constants';
import { deepCopy, isDefined } from './Utils';

//#region Local storage

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

//#endregion

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

export function getUniqueModelName(model: DtdlInterface): string {
    if (!model) {
        return '';
    }
    return parseModelId(model['@id']).name || '';
}

export function getAvailableLanguages(i18n: i18n) {
    if (i18n?.options?.resources) {
        return Object.keys(i18n.options.resources).map((language) => {
            return {
                key: (i18n.options.resources[language].translation as any)
                    .languageCode,
                text: (i18n.options.resources[language].translation as any)
                    .languageName
            };
        });
    } else {
        return [];
    }
}

export function ensureIsArray(property: string | string[]): string[] {
    return property ? (Array.isArray(property) ? property : [property]) : [];
}

/** does some cleanup on the entities to make them properly shaped for DTDL since we need some extra stuff to manage the lifecycle within the app */
export function convertModelToDtdl(model: DtdlInterface): DtdlInterface {
    const newModel = deepCopy(model);
    newModel.contents?.forEach((x) => {
        if (x['@type'] !== OAT_INTERFACE_TYPE) {
            delete x['@id'];
        }
    });
    return newModel;
}

/** returns the id for the node of an untargeted relationship */
export function getUntargetedRelationshipNodeId(
    sourceModelId: string,
    relationship: DtdlInterfaceContent
): string {
    const id =
        relationship['@id'] || // use the given id if present
        `${OAT_UNTARGETED_RELATIONSHIP_ID_PREFIX}_${sourceModelId}_${relationship.name}`; // generate a name from the relationship name
    return id;
}

/** looks at the id of a given entity and returns whether that is an untargeted entity */
export function isUntargeted(id: string) {
    return id?.startsWith(OAT_UNTARGETED_RELATIONSHIP_ID_PREFIX);
}

//#region Model ID

const DEFAULT_VERSION_NUMBER = 1;
interface IBuildModelIdArgs {
    /** namespace for the current ontology */
    namespace: string;
    /** name of the model */
    modelName: string;
    /** the sub path for the model (optional) */
    path?: string;
    /** version number for the model. If omitted, will use the default value */
    version?: number;
}
/**
 * builds out the version id string for a model
 * @returns string for the id of the model
 */
export function buildModelId({
    namespace,
    modelName,
    path,
    version
}: IBuildModelIdArgs): string {
    const prefix = OAT_MODEL_ID_PREFIX;
    const namespaceValue = namespace?.replace(/ /g, '');
    const pathValue = path?.replace(/ /g, '');
    const nameValue = modelName?.replace(/ /g, '');
    const versionNumber = isDefined(version) ? version : DEFAULT_VERSION_NUMBER;

    let uniqueName = nameValue;
    if (pathValue) {
        uniqueName = pathValue + ':' + nameValue;
    }
    return `${prefix}:${namespaceValue}:${uniqueName};${versionNumber}`;
}

export function parseModelId(
    id: string
): {
    namespace: string;
    name: string;
    path: string;
    version: string;
} {
    if (!id) {
        return {
            name: '',
            namespace: '',
            path: '',
            version: ''
        };
    }
    const getNamespace = (id: string) => {
        return id.substring(0, id.indexOf(':'));
    };
    const getPath = (id: string) => {
        // if we still have any : then they must be part of the path or the separator
        if (id.split(':').length > 0) {
            return id.substring(0, id.lastIndexOf(':'));
        }
        return '';
    };
    const getName = (id: string) => {
        return id.substring(0, id.lastIndexOf(';'));
    };
    const getVersion = (id: string) => {
        return id.substring(id.indexOf(';') + 1, id.length);
    };

    const idWithoutPrefix = id.replace(`${OAT_MODEL_ID_PREFIX}:`, '');
    const namespace = getNamespace(idWithoutPrefix);

    const idWithoutNamespace = idWithoutPrefix.replace(`${namespace}:`, '');
    const path = getPath(idWithoutNamespace);

    const idWithoutPath = path
        ? idWithoutNamespace.replace(`${path}:`, '')
        : idWithoutNamespace;
    const name = getName(idWithoutPath);

    const idWithoutName = idWithoutPath.replace(`${name}:`, '');
    const version = getVersion(idWithoutName);

    return {
        namespace: namespace,
        name: name,
        path: path,
        version: version
    };
}

//#endregion

export function getSchemaType(schema: string | Record<string, any>): string {
    if (typeof schema === 'object') {
        return schema['@type'];
    } else {
        return schema;
    }
}
