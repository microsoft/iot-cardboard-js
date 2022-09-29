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
import { CommandHistoryContext } from '../../Pages/OATEditorPage/Internal/Context/CommandHistoryContext';
import { deepCopy, parseModels } from '../../Models/Services/Utils';
import {
    IOATHeaderProps,
    IOATHeaderStyleProps,
    IOATHeaderStyles
} from './OATHeader.types';
import {
    getDirectoryPathFromDTMI,
    getFileNameFromDTMI,
    safeJsonParse
} from '../../Models/Services/OatUtils';
import { getStyles } from './OATHeader.styles';
import { useOatPageContext } from '../../Models/Context/OatPageContext/OatPageContext';
import { OatPageContextActionType } from '../../Models/Context/OatPageContext/OatPageContext.types';

const getClassNames = classNamesFunction<
    IOATHeaderStyleProps,
    IOATHeaderStyles
>();

const OATHeader: React.FC<IOATHeaderProps> = (props) => {
    const { styles } = props;

    // hooks
    const { t } = useTranslation();
    const { onUndo, onRedo, canUndo, canRedo } = useContext(
        CommandHistoryContext
    );

    // contexts
    const { oatPageDispatch, oatPageState } = useOatPageContext();

    // state
    const uploadFolderInputRef = useRef<HTMLInputElement>(null);
    const uploadFileInputRef = useRef<HTMLInputElement>(null);
    const redoButtonRef = useRef(null);
    const undoButtonRef = useRef(null);

    const onFilesUpload = useCallback(
        async (files: Array<File>) => {
            // Populates fileNames and filePaths
            const populateMetadata = (
                file: File,
                fileContent: string,
                metaDataCopy: any
            ) => {
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
                    metaDataCopy = deepCopy(oatPageState.modelsMetadata);
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
            };
            const handleFileListChanged = async (files: Array<File>) => {
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

                    const combinedModels = [
                        ...oatPageState.models,
                        ...newModels
                    ];
                    const error = await parseModels(combinedModels);

                    const modelsCopy = deepCopy(oatPageState.models);
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
                        oatPageDispatch({
                            type:
                                OatPageContextActionType.SET_OAT_IMPORT_MODELS,
                            payload: { models: modelsCopy }
                        });
                        oatPageDispatch({
                            type:
                                OatPageContextActionType.SET_OAT_MODELS_METADATA,
                            payload: { metadata: modelsMetadataReference }
                        });
                    } else {
                        let accumulatedError = '';
                        for (const error of filesErrors) {
                            accumulatedError += `${error}\n`;
                        }

                        oatPageDispatch({
                            type: OatPageContextActionType.SET_OAT_ERROR,
                            payload: {
                                title: t('OATHeader.errorInvalidJSON'),
                                message: accumulatedError
                            }
                        });
                    }
                }
            };

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

                oatPageDispatch({
                    type: OatPageContextActionType.SET_OAT_ERROR,
                    payload: {
                        title: t('OATHeader.errorFormatNoSupported'),
                        message: accumulatedError
                    }
                });
            }
            handleFileListChanged(newFiles);
            // Reset value of input element so that it can be reused with the same file
            uploadFolderInputRef.current.value = null;
            uploadFileInputRef.current.value = null;
        },
        [
            oatPageDispatch,
            oatPageState.models,
            oatPageState.modelsMetadata,
            t,
            uploadFileInputRef
        ]
    );

    const getUploadFileHandler = (
        inputRef: HTMLInputElement
    ): React.ChangeEventHandler<HTMLInputElement> => {
        return (e: React.ChangeEvent<HTMLInputElement>) => {
            console.log('Processing files', e.target.files);
            const reader = new FileReader();
            reader.onload = () => {
                const files: File[] = [];
                for (const file of (inputRef.files as unknown) as File[]) {
                    files.push(file);
                }
                onFilesUpload(files);
            };
            reader.readAsDataURL(e.target.files[0]);
        };
    };

    const onNewFile = useCallback(() => {
        alert('on new file');
        // TODO: check if pending changes
        const pendingChanges = false;
        if (pendingChanges) {
            // TODO: prompt
            // TODO: set action for confirmation to clear
        } else {
            // TODO: call oatPageDispatch to create new project
        }
    }, []);

    const onManageFile = useCallback(() => {
        alert('on manage file');
        // TODO: check if pending changes
        const pendingChanges = false;
        if (pendingChanges) {
            // TODO: prompt
            // TODO: set action for confirmation to clear
        } else {
            // TODO: call oatPageDispatch to create new project
        }
    }, []);

    const onDuplicate = useCallback(() => {
        // TODO: the stuff
        alert('on save as');
    }, []);

    const onExportClick = useCallback(() => {
        const zip = new JSZip();
        for (const element of oatPageState.models) {
            const id = element['@id'];
            let fileName = null;
            let directoryPath = null;

            // Check if current elements exists within modelsMetadata array, if so, use the metadata
            // to determine the file name and directory path
            const modelMetadata = oatPageState.modelsMetadata.find(
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

        zip.generateAsync({ type: 'blob' }).then((content) => {
            downloadModelExportBlob(content);
        });
    }, [oatPageState.models, oatPageState.modelsMetadata]);

    const onAddModel = useCallback(() => {
        // TODO: the stuff
        alert('on add model');
    }, []);

    // Side effects
    // Set listener to undo/redo buttons on key press
    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
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
        };
        document.addEventListener('keydown', onKeyDown);
        return () => {
            document.removeEventListener('keydown', onKeyDown);
        };
    }, []);

    // Data
    const fileMenuItems: IContextualMenuItem[] = [
        {
            key: 'new',
            text: 'New',
            iconProps: { iconName: 'Add' },
            onClick: onNewFile
        },
        {
            key: 'switch',
            text: 'Switch',
            iconProps: { iconName: 'OpenFolderHorizontal' },
            subMenuProps: {
                items: [
                    {
                        key: 'file1',
                        text: 'File 1'
                    },
                    {
                        key: 'file2',
                        text: 'File 2'
                    },
                    {
                        key: 'file3',
                        text: 'File 3'
                    }
                ]
            }
        },
        {
            key: 'duplicate',
            text: 'Duplicate',
            iconProps: { iconName: 'Copy' },
            onClick: onDuplicate
        },
        {
            key: 'dividerImport',
            itemType: ContextualMenuItemType.Divider
        },
        {
            key: 'Export',
            text: t('OATHeader.export'),
            iconProps: { iconName: 'Export' },
            onClick: onExportClick
        },
        {
            key: 'dividerManage',
            itemType: ContextualMenuItemType.Divider
        },
        {
            key: 'manage',
            text: 'Manage',
            iconProps: { iconName: 'Edit' },
            onClick: onManageFile
        }
    ];
    const undoMenuItems: IContextualMenuItem[] = [
        {
            componentRef: undoButtonRef,
            disabled: !canUndo,
            iconProps: { iconName: 'Undo' },
            key: 'under',
            onClick: onUndo,
            text: 'Undo'
        },
        {
            key: 'redo',
            text: 'Redo',
            iconProps: { iconName: 'Redo' },
            onClick: onRedo,
            disabled: !canRedo,
            componentRef: redoButtonRef
        }
    ];
    const newModelMenuItems: IContextualMenuItem[] = [
        {
            key: 'newModel',
            iconProps: { iconName: 'AppIconDefaultAdd' },
            text: 'New model',
            onClick: onAddModel
        },
        {
            key: 'importFile',
            text: t('OATHeader.importFile'),
            iconProps: { iconName: 'Import' },
            onClick: () => uploadFileInputRef.current.click()
        },
        {
            key: 'importFolder',
            text: t('OATHeader.importFolder'),
            iconProps: { iconName: 'Import' },
            onClick: () => uploadFolderInputRef.current.click()
        }
    ];
    const commandBarItems: ICommandBarItemProps[] = [
        {
            key: 'file',
            iconProps: { iconName: 'FabricFolder' },
            text: t('OATHeader.ontology'),
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
            iconProps: { iconName: 'AppIconDefaultAdd' },
            split: true,
            subMenuProps: {
                items: newModelMenuItems
            },
            text: 'New model',
            onClick: onAddModel
        }
    ];

    // styles
    const classNames = getClassNames(styles, { theme: useTheme() });

    return (
        <div className={classNames.root}>
            <div className={classNames.menuComponent}>
                <CommandBar
                    items={commandBarItems}
                    styles={classNames.subComponentStyles.commandBar}
                />
                {/* Hidden inputs for file imports */}
                <div
                    aria-hidden={true}
                    style={{ display: 'none', visibility: 'hidden' }}
                >
                    {/* file upload */}
                    <input
                        type="file"
                        ref={uploadFileInputRef}
                        onChange={getUploadFileHandler(
                            uploadFileInputRef.current
                        )}
                        multiple
                    />
                    {/* folder upload */}
                    <input
                        type="file"
                        ref={uploadFolderInputRef}
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        /** @ts-ignore */
                        webkitdirectory={''}
                        mozdirectory={''}
                        onChange={getUploadFileHandler(
                            uploadFolderInputRef.current
                        )}
                    />
                </div>
            </div>
        </div>
    );
};

export default styled<IOATHeaderProps, IOATHeaderStyleProps, IOATHeaderStyles>(
    OATHeader,
    getStyles
);
