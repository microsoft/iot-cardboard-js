import { createParser, ModelParsingOption } from 'azure-iot-dtdl-parser';
import { TFunction } from 'i18next';
import { DtdlInterface } from '../Constants/dtdlInterfaces';
import { safeJsonParse } from './OatUtils';
import { getDebugLogger } from './Utils';

const debugLogging = true;
const logDebugConsole = getDebugLogger('OATPublicUtils', debugLogging);

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

type Status = 'Success' | 'Failed';
interface IImportFileArgs {
    /** the collection of model files being uploaded */
    files: File[];
    /** the existing models in the ontology to merge with */
    currentModels: DtdlInterface[];
    /** localization translation function */
    translate: TFunction;
}
interface IImportError {
    title: string;
    message: string;
}
interface IImportFileResult {
    models: DtdlInterface[];
    errors: IImportError[];
    status: Status;
}

/** localization keys for error messages */
export const IMPORT_LOC_KEYS = {
    ERRORS: {
        FileFormatNotSupportedMessage:
            'OAT.ImportErrors.fileFormatNotSupportedMessage',
        FileInvalidJson: 'OAT.ImportErrors.fileInvalidJSON',
        FileFormatNotSupportedTitle:
            'OAT.ImportErrors.fileFormatNotSupportedTitle',
        ImportFailedTitle: 'OAT.ImportErrors.importFailedTitle',
        ImportFailedMessage: 'OAT.ImportErrors.importFailedMessage'
    }
};

/**
 * Takes a collection of uploaded files, reads the contents and the validates the models to ensure they are valid DTDL and the ontology is in a valid state.
 * @param args the arguments for the function
 * @returns an object containing the resulting valid model collection or a collection of errors.
 */
export const parseFilesToModels = async (
    args: IImportFileArgs
): Promise<IImportFileResult> => {
    const { files, currentModels = [], translate } = args;
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
                        IMPORT_LOC_KEYS.ERRORS.FileFormatNotSupportedTitle
                    ),
                    message: translate(
                        IMPORT_LOC_KEYS.ERRORS.FileFormatNotSupportedMessage,
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
                translate
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
            title: translate('OAT.ImportErrors.exceptionTitle'),
            message: translate('OAT.ImportErrors.exceptionMessage')
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
    translate: TFunction
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
                translate(IMPORT_LOC_KEYS.ERRORS.FileInvalidJson, {
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
            translate(IMPORT_LOC_KEYS.ERRORS.ImportFailedMessage, {
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
            title: translate(IMPORT_LOC_KEYS.ERRORS.ImportFailedTitle),
            message: accumulatedError
        });
    }
    logDebugConsole('debug', '[IMPORT] [END] Parsing files. {files}', files);
    return result;
};
