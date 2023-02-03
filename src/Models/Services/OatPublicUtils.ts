import { createParser, ModelParsingOption } from 'azure-iot-dtdl-parser';
import JSZip from 'jszip';
import { DtdlInterface } from '../Constants/dtdlInterfaces';
import { convertModelToDtdl, safeJsonParse } from './OatUtils';
import { getDebugLogger } from './Utils';

const debugLogging = true;
const logDebugConsole = getDebugLogger('OATPublicUtils', debugLogging);

// #region Import

/**
 * Runs the collection of models through the `azure-iot-dtdl-parser` package and returns a string containing the errors (if any) or empty string if successful.
 * @param models The collection of models that make up the entire ontology
 * @returns a string containing the errors or empty string if successful
 */
export async function parseModels(models: DtdlInterface[]): Promise<string> {
    const modelParser = createParser(
        ModelParsingOption.PermitAnyTopLevelElement
    );
    try {
        await modelParser.parse([JSON.stringify(models)]);
        return '';
    } catch (err) {
        console.error('Error while parsing models {input, error}', models, err);
        if (err.name === 'ParsingException') {
            console.error('Parsing errors {errors}', err._parsingErrors);
            return err._parsingErrors
                .map((e) => `${e.cause} ${e.action}`)
                .join('\n');
        }

        return err.message;
    }
}

// defined our own type since the i18next type was breaking rollup for some reason
type TranslateFunction = (key: string, args?: Record<string, string>) => string;
type ImportStatus = 'Success' | 'Failed';
export interface IImportLocalizationKeys {
    FileFormatNotSupportedMessage: string;
    FileInvalidJson: string;
    FileFormatNotSupportedTitle: string;
    ImportFailedTitle: string;
    ImportFailedMessage: string;
    ExceptionTitle: string;
    ExceptionMessage: string;
}
interface IImportFileArgs {
    /** the collection of model files being uploaded */
    files: File[];
    /** the existing models in the ontology to merge with */
    currentModels: DtdlInterface[];
    /** localization translation function */
    translate: TranslateFunction;
    localizationKeys: IImportLocalizationKeys;
}
interface IImportError {
    title: string;
    message: string;
}
interface IImportFileResult {
    models: DtdlInterface[];
    errors: IImportError[];
    status: ImportStatus;
}

/**
 * Takes a collection of uploaded files, reads the contents and the validates the models to ensure they are valid DTDL and the ontology is in a valid state.
 * @param args the arguments for the function
 * @returns an object containing the resulting valid model collection or a collection of errors.
 */
export const parseFilesToModels = async (
    args: IImportFileArgs
): Promise<IImportFileResult> => {
    const { files, currentModels = [], localizationKeys, translate } = args;
    const result: IImportFileResult = {
        errors: [],
        models: [],
        status: 'Success'
    };
    try {
        if (files?.length === 0) {
            logDebugConsole(
                'warn',
                `[IMPORT] No files provided, aborting.`,
                files
            );
            return result;
        }

        logDebugConsole(
            'debug',
            `[IMPORT] [START] Files upload. (${files.length} files) {files}`,
            files
        );
        const fileValidationResult = validateFiles(files);
        if (fileValidationResult.failedFileNames.length > 0) {
            result.errors = [
                {
                    title: translate(
                        localizationKeys.FileFormatNotSupportedTitle
                    ),
                    message: translate(
                        localizationKeys.FileFormatNotSupportedMessage,
                        {
                            fileNames: fileValidationResult.failedFileNames
                                .map((x) => `'${x}'`)
                                .join('\n')
                        }
                    )
                }
            ];
            result.status = 'Failed';
        } else {
            const parseResult = await getModelsFromFiles(
                fileValidationResult.validFiles,
                currentModels,
                translate,
                localizationKeys
            );
            result.errors = parseResult.errors;
            result.models = parseResult.models;
            result.status =
                parseResult.errors?.length > 0 ? 'Failed' : 'Success';
        }
        logDebugConsole(
            'debug',
            '[IMPORT] [END] Files upload. {result}',
            result
        );
        return result;
    } catch (error) {
        result.status = 'Failed';
        result.errors.push({
            title: translate(localizationKeys.ExceptionTitle),
            message: translate(localizationKeys.ExceptionMessage)
        });
        console.error('Exception occured while importing.', error);
        logDebugConsole(
            'debug',
            '[IMPORT] [END] Files upload. {result}',
            result
        );
        return result;
    }
};

const validateFiles = (
    files: File[]
): { validFiles: File[]; failedFileNames: string[] } => {
    const newFiles = [];
    const failedFileNames = [];

    for (const file of files) {
        if (file.type === 'application/json') {
            newFiles.push(file);
        } else {
            failedFileNames.push(file.name);
        }
    }
    return { validFiles: newFiles, failedFileNames: failedFileNames };
};

interface IParseFilesResult {
    models: DtdlInterface[];
    errors: IImportError[];
}
const getModelsFromFiles = async (
    files: Array<File>,
    currentModels: DtdlInterface[],
    translate: TranslateFunction,
    localizationKeys: IImportLocalizationKeys
): Promise<IParseFilesResult> => {
    const result: IParseFilesResult = {
        errors: [],
        models: []
    };
    if (files.length === 0) {
        logDebugConsole('warn', '[IMPORT] No files to parse, skipping');
        return result;
    }

    logDebugConsole('debug', '[IMPORT] [START] Parsing files. {files}', files);
    const newModels: DtdlInterface[] = [];
    const filesErrors: string[] = [];

    for (const current of files) {
        const content = await current.text();
        const model = safeJsonParse<DtdlInterface>(content);

        if (!model) {
            filesErrors.push(
                translate(localizationKeys.FileInvalidJson, {
                    fileName: current.name
                })
            );
            break;
        }
        newModels.push(model);
    }

    // run the parser for full validations
    const combinedModels = [...currentModels, ...newModels];
    const error = await parseModels(combinedModels);
    if (error) {
        filesErrors.push(
            translate(localizationKeys.ImportFailedMessage, {
                error
            })
        );
    }

    if (filesErrors.length === 0) {
        logDebugConsole(
            'debug',
            '[IMPORT] Files parsed. {models}',
            combinedModels
        );
        result.models = combinedModels;
    } else {
        let accumulatedError = '';
        for (const error of filesErrors) {
            accumulatedError += `${error}\n`;
        }

        logDebugConsole(
            'error',
            '[IMPORT] Errors while parsing. {error}',
            accumulatedError
        );
        result.errors.push({
            title: translate(localizationKeys.ImportFailedTitle),
            message: accumulatedError
        });
    }
    logDebugConsole('debug', '[IMPORT] [END] Parsing files. {files}', files);
    return result;
};

// #endregion

// #region Export

type ExportStatus = 'Success' | 'Failed';
export interface IExportLocalizationKeys {
    ExceptionTitle: string;
    ExceptionMessage: string;
}
interface IExportModelsArgs {
    /** the existing models in the ontology to merge with */
    models: DtdlInterface[];
    /** localization translation function */
    translate: TranslateFunction;
    /** the keys to use for localized strings */
    localizationKeys: IExportLocalizationKeys;
}
interface IExportError {
    title: string;
    message: string;
}
interface IExportModelsResult {
    file: JSZip;
    errors: IExportError[];
    status: ExportStatus;
}
/**
 * Creates a downloadable zip file containing one file for each model in the collection. The files are nested in folders that reflect the path in their DTMI.
 * @example dtmi:folder1:folder2:myModel;1 -->
 *      root.zip
 *         |--folder1
 *              |--folder2
 *                  |--myModel.json
 */
export const createZipFileFromModels = (
    args: IExportModelsArgs
): IExportModelsResult => {
    const result: IExportModelsResult = {
        errors: [],
        file: new JSZip(),
        status: 'Success'
    };
    const { models, localizationKeys, translate } = args;
    if (models?.length === 0) {
        logDebugConsole(
            'debug',
            `[EXPORT] [SKIP] Export models. No models found. `
        );
        return result;
    }
    logDebugConsole(
        'debug',
        `[EXPORT] [START] Exporting (${models.length}) models. {models}`,
        models
    );
    try {
        const zip = new JSZip();
        for (const model of models) {
            const modelId = model['@id'];
            const fileName = getFileNameFromDTMI(modelId);
            const directoryPath = getDirectoryPathFromDTMI(modelId);

            // Split every part of the directory path
            const directoryPathParts = directoryPath.split('\\');
            // Create a folder for evert directory path part and nest them
            let currentDirectory = zip;
            for (const directoryPathPart of directoryPathParts) {
                currentDirectory = currentDirectory.folder(directoryPathPart);
                // Store json file on the last directory path part
                if (
                    directoryPathPart ===
                    directoryPathParts[directoryPathParts.length - 1]
                ) {
                    const fileContent = JSON.stringify(
                        convertModelToDtdl(model)
                    );
                    currentDirectory.file(`${fileName}.json`, fileContent);
                    logDebugConsole(
                        'debug',
                        `[EXPORT] Adding file to zip for id ${modelId}. {content}`,
                        fileContent
                    );
                }
            }
        }
        result.file = zip;
        logDebugConsole(
            'debug',
            `[EXPORT] [END] Exported models. {result}`,
            result
        );
        return result;
    } catch (error) {
        console.error(
            'Failed to generate zip file with models due to an exception. {exception}',
            error
        );
        result.status = 'Failed';
        result.errors.push({
            title: translate(localizationKeys.ExceptionTitle),
            message: translate(localizationKeys.ExceptionMessage)
        });
        return result;
    }
};

/**
 * Gets the name to use for the file based on the model's DTMI id
 * @param dtmi the id for the model
 * @returns the name to use for the file
 */
const getFileNameFromDTMI = (dtmi: string): string => {
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
    return '';
};

/**
 * Get directoryPath from DTMI
 * @param dtmi ID of a model
 * @returns the string of the directory file path to use for the model
 */
const getDirectoryPathFromDTMI = (dtmi: string): string => {
    const initialPosition = dtmi.indexOf(':') + 1;
    const finalPosition = dtmi.lastIndexOf(':');

    if (initialPosition !== 0 && finalPosition !== -1) {
        const directoryPath = dtmi.substring(initialPosition, finalPosition);
        // Scheme - replace ":" with "\"
        return directoryPath.replace(':', '\\');
    }
    return '';
};

// #endregion
