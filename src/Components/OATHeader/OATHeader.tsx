import React, { useEffect, useState, useContext, useRef } from 'react';
import { CommandBar, ICommandBarItemProps } from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import { getHeaderStyles, getCommandBarStyles } from './OATHeader.styles';
import JSZip from 'jszip';

import FileSubMenu from './internal/FileSubMenu';
import Modal from './internal/Modal';
import { IOATEditorState } from '../../Pages/OATEditorPage/OATEditorPage.types';
import {
    SET_OAT_CONFIRM_DELETE_OPEN,
    SET_OAT_ERROR,
    SET_OAT_MODELS_METADATA,
    SET_OAT_PROJECT
} from '../../Models/Constants/ActionTypes';
import { ProjectData } from '../../Pages/OATEditorPage/Internal/Classes';

import {
    IOATTwinModelNodes,
    OATNamespaceDefaultValue
} from '../../Models/Constants';
import { IAction } from '../../Models/Constants/Interfaces';
import { useDropzone } from 'react-dropzone';
import { SET_OAT_IMPORT_MODELS } from '../../Models/Constants/ActionTypes';
import { CommandHistoryContext } from '../../Pages/OATEditorPage/Internal/Context/CommandHistoryContext';
import {
    deepCopy,
    getDirectoryPathFromDTMI,
    getFileNameFromDTMI,
    parseModel
} from '../../Models/Services/Utils';
import ImportSubMenu from './internal/ImportSubMenu';

const ID_FILE = 'file';
const ID_IMPORT = 'import';

type OATHeaderProps = {
    elements: IOATTwinModelNodes[];
    dispatch?: React.Dispatch<React.SetStateAction<IAction>>;
    state?: IOATEditorState;
};

const OATHeader = ({ elements, dispatch, state }: OATHeaderProps) => {
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
    const [modalOpen, setModalOpen] = useState(false);
    const [modalBody, setModalBody] = useState(null);
    const {
        modelsMetadata,
        projectName,
        modelPositions,
        models,
        templates,
        namespace
    } = state;
    const uploadInputRef = useRef(null);
    const keyDown = useRef(false);
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
        for (const element of elements) {
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
                    t('OATHeader.description'),
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
                models,
                t('OATHeader.description'),
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

    const resetProject = () => {
        const clearProject = new ProjectData(
            [],
            [],
            t('OATHeader.description'),
            t('OATHeader.untitledProject'),
            [],
            OATNamespaceDefaultValue,
            []
        );

        dispatch({
            type: SET_OAT_PROJECT,
            payload: clearProject
        });
    };

    const onFilesUpload = (files: Array<File>) => {
        const newFiles = [];
        const newFilesErrors = [];
        files.forEach((sF) => {
            if (sF.type === 'application/json') {
                newFiles.push(sF);
            } else {
                newFilesErrors.push(
                    t('OATHeader.errorFileFormatNotSupported', {
                        fileName: sF.name
                    })
                );
            }
            sF = new File([], '');
        });
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
    };

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
    };

    const onFilesChange = (e) => {
        const reader = new FileReader();
        reader.onload = () => {
            const files = [];
            for (const file of uploadInputRef.current.files) {
                files.push(file);
            }
            onFilesUpload(files);
        };
        reader.readAsDataURL(e.target.files[0]);
    };

    const handleFileListChanged = async (files: Array<File>) => {
        const items = [];
        if (files.length > 0) {
            const filesErrors = [];
            let modelsMetadataReference = null;
            for (const current of files) {
                const content = await current.text();
                const error = await parseModel(content);
                if (!error) {
                    modelsMetadataReference = populateMetadata(
                        current,
                        content,
                        modelsMetadataReference
                    );

                    items.push(JSON.parse(content));
                } else {
                    filesErrors.push(
                        t('OATHeader.errorIssueWithFile', {
                            fileName: current.name,
                            error
                        })
                    );
                }
            }
            if (filesErrors.length === 0) {
                dispatch({
                    type: SET_OAT_IMPORT_MODELS,
                    payload: items
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
    };

    useEffect(() => {
        onFilesUpload(acceptedFiles);
    }, [acceptedFiles]);

    const onKeyDown = (e) => {
        if (keyDown.current) {
            // Prevent keydown from being triggered twice
            return;
        }
        if ((e.key === 'z' && e.ctrlKey) || (e.key === 'z' && e.metaKey)) {
            if (e.shiftKey) {
                keyDown.current = true;
                redoButtonRef.current['_onClick']();
            } else {
                keyDown.current = true;
                undoButtonRef.current['_onClick']();
            }
        }

        if ((e.key === 'y' && e.ctrlKey) || (e.key === 'y' && e.metaKey)) {
            keyDown.current = true;
            redoButtonRef.current['_onClick']();
        }
    };

    useEffect(() => {
        // Set listener to undo/redo buttons on key press
        document.addEventListener('keydown', (e) => onKeyDown(e));
        return () => {
            document.removeEventListener('keydown', (e) => onKeyDown(e));
        };
    }, [onKeyDown]);

    useEffect(() => {
        // On key release, set keyDown to false
        const onKeyUp = () => {
            if (keyDown.current) {
                keyDown.current = false;
            }
        };
        document.addEventListener('keyup', onKeyUp);
        return () => {
            document.removeEventListener('keyup', onKeyUp);
        };
    }, []);

    return (
        <div className={headerStyles.container}>
            <div className={headerStyles.menuComponent}>
                <CommandBar items={items} styles={commandBarStyles} />
                <div className="cb-oat-header-menu">
                    <input
                        type="file"
                        ref={uploadInputRef}
                        className={headerStyles.uploadDirectoryInput}
                        webkitdirectory={''}
                        mozdirectory={''}
                        onChange={onFilesChange}
                    />
                    {fileSubMenuActive && (
                        <FileSubMenu
                            subMenuActive={fileSubMenuActive}
                            targetId={ID_FILE}
                            setSubMenuActive={setFileSubMenuActive}
                            setModalOpen={setModalOpen}
                            setModalBody={setModalBody}
                            dispatch={dispatch}
                            state={state}
                            resetProject={resetProject}
                        />
                    )}
                    {importSubMenuActive && (
                        <ImportSubMenu
                            subMenuActive={importSubMenuActive}
                            targetId={ID_IMPORT}
                            setSubMenuActive={setImportSubMenuActive}
                            uploadFolder={onUploadFolderClick}
                            uploadFile={onUploadFileClick}
                        />
                    )}
                    <Modal
                        modalOpen={modalOpen}
                        setModalOpen={setModalOpen}
                        setModalBody={setModalBody}
                        modalBody={modalBody}
                        dispatch={dispatch}
                        state={state}
                        resetProject={resetProject}
                    />
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
    elements: [],
    onImportClick: () => null
};

export default OATHeader;
