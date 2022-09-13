import React, {
    useEffect,
    useState,
    useContext,
    useRef,
    useCallback
} from 'react';
import { CommandBar, ICommandBarItemProps } from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import { getHeaderStyles, getCommandBarStyles } from './OATHeader.styles';
import JSZip from 'jszip';

import FileSubMenu from './internal/FileSubMenu';
import {
    SET_OAT_CONFIRM_DELETE_OPEN,
    SET_OAT_ERROR,
    SET_OAT_MODELS_METADATA,
    SET_OAT_PROJECT
} from '../../Models/Constants/ActionTypes';
import { ProjectData } from '../../Pages/OATEditorPage/Internal/Classes';

import { OATNamespaceDefaultValue } from '../../Models/Constants';
import { useDropzone } from 'react-dropzone';
import { SET_OAT_IMPORT_MODELS } from '../../Models/Constants/ActionTypes';
import { CommandHistoryContext } from '../../Pages/OATEditorPage/Internal/Context/CommandHistoryContext';
import { deepCopy, parseModels } from '../../Models/Services/Utils';
import ImportSubMenu from './internal/ImportSubMenu';
import { OATHeaderProps } from './OATHeader.types';
import {
    convertDtdlInterfacesToModels,
    getDirectoryPathFromDTMI,
    getFileNameFromDTMI
} from '../../Models/Services/OatUtils';

const ID_FILE = 'file';
const ID_IMPORT = 'import';

const OATHeader = ({ dispatch, state }: OATHeaderProps) => {
    const { t } = useTranslation();
    const { execute, undo, redo, canUndo, canRedo } = useContext(
        CommandHistoryContext
    );
    const headerStyles = getHeaderStyles();
    const commandBarStyles = getCommandBarStyles();
    const {
        acceptedFiles,
        getRootProps,
        getInputProps,
        inputRef
    } = useDropzone();
    const [fileSubMenuActive, setFileSubMenuActive] = useState(false);
    const [importSubMenuActive, setImportSubMenuActive] = useState(false);
    const {
        modelsMetadata,
        projectName,
        modelPositions,
        models,
        templates,
        namespace
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

    const onUploadFolderClick = () => {
        uploadInputRef.current.click();
    };

    const onUploadFileClick = () => {
        inputRef.current.click();
    };

    const onDeleteAll = () => {
        const deletion = () => {
            const dispatchDelete = () => {
                const newProject = new ProjectData(
                    [],
                    [],
                    projectName,
                    [],
                    OATNamespaceDefaultValue,
                    []
                );

                dispatch({
                    type: SET_OAT_PROJECT,
                    payload: newProject
                });
            };

            dispatch({
                type: SET_OAT_CONFIRM_DELETE_OPEN,
                payload: { open: true, callback: dispatchDelete }
            });
        };

        const undoDeletion = () => {
            const project = new ProjectData(
                modelPositions,
                convertDtdlInterfacesToModels(models),
                projectName,
                templates,
                namespace,
                modelsMetadata
            );

            dispatch({
                type: SET_OAT_PROJECT,
                payload: project
            });
        };

        execute(deletion, undoDeletion);
    };

    const items: ICommandBarItemProps[] = [
        {
            key: 'Save',
            text: t('OATHeader.file'),
            iconProps: { iconName: 'Save' },
            onClick: () => setFileSubMenuActive(!fileSubMenuActive),
            id: ID_FILE
        },
        {
            key: 'Import',
            text: t('OATHeader.import'),
            iconProps: { iconName: 'Import' },
            onClick: () => setImportSubMenuActive(!importSubMenuActive),
            id: ID_IMPORT
        },
        {
            key: 'Export',
            text: t('OATHeader.export'),
            iconProps: { iconName: 'Export' },
            onClick: onExportClick
        },
        {
            key: 'Undo',
            text: t('OATHeader.undo'),
            iconProps: { iconName: 'Undo' },
            onClick: undo,
            disabled: !canUndo,
            componentRef: undoButtonRef
        },
        {
            key: 'Redo',
            text: t('OATHeader.redo'),
            iconProps: { iconName: 'Redo' },
            onClick: redo,
            disabled: !canRedo,
            componentRef: redoButtonRef
        },
        {
            key: 'DeleteAll',
            text: t('OATHeader.deleteAll'),
            iconProps: { iconName: 'Delete' },
            onClick: onDeleteAll
        }
    ];

    const safeJsonParse = (value: string) => {
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

    const onFileSubMenuClose = () => {
        setFileSubMenuActive(false);
    };

    useEffect(() => {
        onFilesUpload(acceptedFiles);
    }, [acceptedFiles, onFilesUpload]);

    const onKeyDown = useCallback((e) => {
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

    useEffect(() => {
        // Set listener to undo/redo buttons on key press
        document.addEventListener('keydown', onKeyDown);
        return () => {
            document.removeEventListener('keydown', onKeyDown);
        };
    }, [onKeyDown]);

    return (
        <div className={headerStyles.container}>
            <div className={headerStyles.menuComponent}>
                <CommandBar items={items} styles={commandBarStyles} />
                <div className="cb-oat-header-menu">
                    <input
                        type="file"
                        ref={uploadInputRef}
                        className={headerStyles.uploadDirectoryInput}
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        /** @ts-ignore */
                        webkitdirectory={''}
                        mozdirectory={''}
                        onChange={onFilesChange}
                    />
                    <FileSubMenu
                        isActive={fileSubMenuActive}
                        targetId={ID_FILE}
                        onFileSubMenuClose={onFileSubMenuClose}
                        dispatch={dispatch}
                        state={state}
                    />

                    {importSubMenuActive && (
                        <ImportSubMenu
                            subMenuActive={importSubMenuActive}
                            targetId={ID_IMPORT}
                            setSubMenuActive={setImportSubMenuActive}
                            uploadFolder={onUploadFolderClick}
                            uploadFile={onUploadFileClick}
                        />
                    )}
                </div>
                <div className="cb-oat-header-model"></div>
            </div>
            <div {...getRootProps()}>
                <input {...getInputProps()} />
            </div>
        </div>
    );
};

OATHeader.defaultProps = {
    onImportClick: () => null
};

export default OATHeader;
