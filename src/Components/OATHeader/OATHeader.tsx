import React, { useEffect, useContext, useRef, useCallback } from 'react';
import {
    classNamesFunction,
    CommandBar,
    ContextualMenuItemType,
    ICommandBarItemProps,
    IContextualMenuItem,
    styled,
    useTheme
} from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import JSZip from 'jszip';

import {
    SET_OAT_ERROR,
    SET_OAT_MODELS_METADATA
} from '../../Models/Constants/ActionTypes';

import { useDropzone } from 'react-dropzone';
import { SET_OAT_IMPORT_MODELS } from '../../Models/Constants/ActionTypes';
import { CommandHistoryContext } from '../../Pages/OATEditorPage/Internal/Context/CommandHistoryContext';
import { deepCopy, parseModels } from '../../Models/Services/Utils';
import {
    IOATHeaderProps,
    IOATHeaderStyleProps,
    IOATHeaderStyles
} from './OATHeader.types';
import {
    getDirectoryPathFromDTMI,
    getFileNameFromDTMI
} from '../../Models/Services/OatUtils';
import { getStyles } from './OATHeader.styles';

const getClassNames = classNamesFunction<
    IOATHeaderStyleProps,
    IOATHeaderStyles
>();

const OATHeader: React.FC<IOATHeaderProps> = (props) => {
    const { dispatch, state, styles } = props;

    const { t } = useTranslation();
    const { undo, redo, canUndo, canRedo } = useContext(CommandHistoryContext);
    const classNames = getClassNames(styles, { theme: useTheme() });

    // state

    const {
        acceptedFiles,
        getRootProps,
        getInputProps,
        inputRef
    } = useDropzone();
    const {
        modelsMetadata,
        // projectName,
        // modelPositions,
        models
        // templates,
        // namespace
    } = state;
    const uploadInputRef = useRef(null);
    const redoButtonRef = useRef(null);
    const undoButtonRef = useRef(null);

    const downloadModelExportBlob = (blob: Blob) => {
        const blobURL = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', blobURL);
        link.setAttribute('download', 'modelExport.zip');
        link.innerHTML = '';
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
    };

    const onExportClick = () => {
        const zip = new JSZip();
        for (const element of models) {
            const id = element['@id'];
            let fileName = null;
            let directoryPath = null;

            // Check if current elements exists within modelsMetadata array, if so, use the metadata
            // to determine the file name and directory path
            const modelMetadata = modelsMetadata.find(
                (model) => model['@id'] === id
            );
            if (modelMetadata) {
                fileName = modelMetadata.fileName
                    ? modelMetadata.fileName
                    : null;
                directoryPath = modelMetadata.directoryPath
                    ? modelMetadata.directoryPath
                    : null;
            }

            // If fileName or directoryPath are null, generate values from id
            if (!fileName || !directoryPath) {
                if (!fileName) {
                    fileName = getFileNameFromDTMI(id);
                }

                if (!directoryPath) {
                    directoryPath = getDirectoryPathFromDTMI(id);
                }
            }

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
                    currentDirectory.file(
                        `${fileName}.json`,
                        JSON.stringify(element)
                    );
                }
            }
        }

        zip.generateAsync({ type: 'blob' }).then((content) => {
            downloadModelExportBlob(content);
        });
    };

    const fileMenuItems: IContextualMenuItem[] = [
        {
            key: 'new',
            text: 'New file',
            iconProps: { iconName: 'Add' },
            onClick: () => alert('Create file')
        },
        {
            key: 'rename',
            text: 'Rename',
            iconProps: { iconName: 'Edit' },
            onClick: () => alert('Rename')
        },
        {
            key: 'saveAs',
            text: 'Save as',
            iconProps: { iconName: 'Save' },
            onClick: () => alert('Save as')
        },
        {
            key: 'dividerImport',
            itemType: ContextualMenuItemType.Divider
        },
        {
            key: 'Import',
            text: t('OATHeader.importFile'),
            iconProps: { iconName: 'Import' },
            onClick: () => alert('Import file')
        },
        {
            key: 'Import',
            text: t('OATHeader.importFolder'),
            iconProps: { iconName: 'Import' },
            onClick: () => alert('Import folder')
        },
        {
            key: 'Export',
            text: t('OATHeader.export'),
            iconProps: { iconName: 'Export' },
            onClick: onExportClick
        },
        {
            key: 'dividerDelete',
            itemType: ContextualMenuItemType.Divider
        },
        {
            key: 'delete',
            text: 'Delete',
            iconProps: { iconName: 'Delete' },
            onClick: () => alert('Open settings')
        }
    ];
    const undoMenuItems: IContextualMenuItem[] = [
        {
            componentRef: undoButtonRef,
            disabled: !canUndo,
            iconProps: { iconName: 'Undo' },
            key: 'under',
            onClick: undo,
            text: 'Undo'
        },
        {
            key: 'redo',
            text: 'Redo',
            iconProps: { iconName: 'Redo' },
            onClick: redo,
            disabled: !canRedo,
            componentRef: redoButtonRef
        }
    ];
    const commandBarItems: ICommandBarItemProps[] = [
        {
            key: 'file',
            iconProps: { iconName: 'FabricFolder' },
            text: t('OATHeader.file'),
            subMenuProps: {
                items: fileMenuItems
            }
        },
        {
            key: 'Undo',
            disabled: !(canRedo || canUndo),
            iconProps: { iconName: 'Undo' },
            split: true,
            subMenuProps: {
                items: undoMenuItems
            },
            text: t('OATHeader.undo')
        },
        {
            key: 'newModel',
            iconProps: { iconName: 'Add' },
            text: 'New model',
            onClick: () => alert('create model')
        }
    ];

    const safeJsonParse = (value: string) => {
        if (!value) {
            return value;
        }
        try {
            const parsedJson = JSON.parse(value);
            return parsedJson;
        } catch (e) {
            return null;
        }
    };

    // Populates fileNames and filePaths
    const populateMetadata = useCallback(
        (file: File, fileContent: string, metaDataCopy: any) => {
            // Get model metadata
            // Get file name from file
            let fileName = file.name;
            // Get file name without extension
            fileName = fileName.substring(0, fileName.lastIndexOf('.'));
            // Get directory path from file
            let directoryPath = file.webkitRelativePath;
            // Get directory content within first and last "\"
            directoryPath = directoryPath.substring(
                directoryPath.indexOf('/') + 1,
                directoryPath.lastIndexOf('/')
            );

            if (!metaDataCopy) {
                metaDataCopy = deepCopy(modelsMetadata);
            }

            // Get JSON from content
            const json = JSON.parse(fileContent);
            // Check modelsMetadata for the existence of the model, if exists, update it, if not, add it
            const modelMetadata = metaDataCopy.find(
                (model) => model['@id'] === json['@id']
            );
            if (modelMetadata) {
                // Update model metadata
                modelMetadata.fileName = fileName;
                modelMetadata.directoryPath = directoryPath;
            } else {
                // Add model metadata
                metaDataCopy.push({
                    '@id': json['@id'],
                    fileName: fileName,
                    directoryPath: directoryPath
                });
            }

            return metaDataCopy;
        },
        [modelsMetadata]
    );

    const handleFileListChanged = useCallback(
        async (files: Array<File>) => {
            const newModels = [];
            if (files.length > 0) {
                const filesErrors = [];
                let modelsMetadataReference = null;
                for (const current of files) {
                    const content = await current.text();
                    const validJson = safeJsonParse(content);
                    if (validJson) {
                        newModels.push(validJson);
                    } else {
                        filesErrors.push(
                            t('OATHeader.errorFileInvalidJSON', {
                                fileName: current.name
                            })
                        );
                        break;
                    }
                }

                const combinedModels = [...models, ...newModels];
                const error = await parseModels(combinedModels);

                const modelsCopy = deepCopy(models);
                for (const model of newModels) {
                    // Check if model already exists
                    const modelExists = modelsCopy.find(
                        (m) => m['@id'] === model['@id']
                    );
                    if (!modelExists) {
                        modelsCopy.push(model);
                    } else {
                        filesErrors.push(
                            t('OATHeader.errorImportedModelAlreadyExists', {
                                modelId: model['@id']
                            })
                        );
                        break;
                    }
                }

                if (!error) {
                    for (let i = 0; i < files.length; i++) {
                        modelsMetadataReference = populateMetadata(
                            files[i],
                            JSON.stringify(newModels[i]),
                            modelsMetadataReference
                        );
                    }
                } else {
                    filesErrors.push(
                        t('OATHeader.errorIssueWithFile', {
                            fileName: t('OATHeader.file'),
                            error
                        })
                    );
                }

                if (filesErrors.length === 0) {
                    dispatch({
                        type: SET_OAT_IMPORT_MODELS,
                        payload: modelsCopy
                    });
                    dispatch({
                        type: SET_OAT_MODELS_METADATA,
                        payload: modelsMetadataReference
                    });
                } else {
                    let accumulatedError = '';
                    for (const error of filesErrors) {
                        accumulatedError += `${error}\n`;
                    }

                    dispatch({
                        type: SET_OAT_ERROR,
                        payload: {
                            title: t('OATHeader.errorInvalidJSON'),
                            message: accumulatedError
                        }
                    });
                }
            }
        },
        [dispatch, models, populateMetadata, t]
    );

    const onFilesUpload = useCallback(
        async (files: Array<File>) => {
            const newFiles = [];
            const newFilesErrors = [];

            for (const file of files) {
                if (file.type === 'application/json') {
                    newFiles.push(file);
                } else {
                    newFilesErrors.push(
                        t('OATHeader.errorFileFormatNotSupported', {
                            fileName: file.name
                        })
                    );
                }
            }

            if (newFilesErrors.length > 0) {
                let accumulatedError = '';
                for (const error of newFilesErrors) {
                    accumulatedError += `${error} \n `;
                }

                dispatch({
                    type: SET_OAT_ERROR,
                    payload: {
                        title: t('OATHeader.errorFormatNoSupported'),
                        message: accumulatedError
                    }
                });
            }
            handleFileListChanged(newFiles);
            // Reset value of input element so that it can be reused with the same file
            uploadInputRef.current.value = null;
            inputRef.current.value = null;
        },
        [dispatch, handleFileListChanged, inputRef, t]
    );

    const onFilesChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
        (e) => {
            const reader = new FileReader();
            reader.onload = () => {
                const files = [];
                for (const file of uploadInputRef.current.files) {
                    files.push(file);
                }
                onFilesUpload(files);
            };
            reader.readAsDataURL(e.target.files[0]);
        },
        [onFilesUpload]
    );

    useEffect(() => {
        onFilesUpload(acceptedFiles);
    }, [acceptedFiles, onFilesUpload]);

    const onKeyDown = useCallback((e: KeyboardEvent) => {
        //Prevent event automatically repeating due to key being held down
        if (e.repeat) {
            return;
        }

        if ((e.key === 'z' && e.ctrlKey) || (e.key === 'z' && e.metaKey)) {
            if (e.shiftKey) {
                redoButtonRef.current['_onClick']();
            } else {
                undoButtonRef.current['_onClick']();
            }
        }

        if ((e.key === 'y' && e.ctrlKey) || (e.key === 'y' && e.metaKey)) {
            redoButtonRef.current['_onClick']();
        }
    }, []);

    // Set listener to undo/redo buttons on key press
    useEffect(() => {
        document.addEventListener('keydown', onKeyDown);
        return () => {
            document.removeEventListener('keydown', onKeyDown);
        };
    }, [onKeyDown]);

    return (
        <div className={classNames.root}>
            <div className={classNames.menuComponent}>
                <CommandBar
                    items={commandBarItems}
                    styles={classNames.subComponentStyles.commandBar}
                />
                <div>
                    <input
                        type="file"
                        ref={uploadInputRef}
                        className={classNames.uploadDirectoryInput}
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        /** @ts-ignore */
                        webkitdirectory={''}
                        mozdirectory={''}
                        onChange={onFilesChange}
                    />
                </div>
            </div>
            <div {...getRootProps()}>
                <input {...getInputProps()} />
            </div>
        </div>
    );
};

export default styled<IOATHeaderProps, IOATHeaderStyleProps, IOATHeaderStyles>(
    OATHeader,
    getStyles
);
