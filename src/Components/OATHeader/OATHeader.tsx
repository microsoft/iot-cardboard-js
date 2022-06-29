import React, { useEffect, useRef, useState } from 'react';
import { CommandBar, ICommandBarItemProps } from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import { getHeaderStyles } from './OATHeader.styles';
import JSZip from 'jszip';

import FileSubMenu from './internal/FileSubMenu';
import Modal from './internal/Modal';
import { IOATEditorState } from '../../Pages/OATEditorPage/OATEditorPage.types';
import {
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
import { SET_OAT_IMPORT_MODELS } from '../../Models/Constants/ActionTypes';
import { deepCopy, parseModel } from '../../Models/Services/Utils';

const ID_FILE = 'file';

type OATHeaderProps = {
    elements: IOATTwinModelNodes[];
    dispatch?: React.Dispatch<React.SetStateAction<IAction>>;
    state?: IOATEditorState;
};

const OATHeader = ({ elements, dispatch, state }: OATHeaderProps) => {
    const { t } = useTranslation();
    const headerStyles = getHeaderStyles();
    const [subMenuActive, setSubMenuActive] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalBody, setModalBody] = useState(null);
    const { modelsMetadata } = state;
    const uploadInputRef = useRef(null);

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
                // Get id path - Get section between last ":" and ";"
                const idPath = id.substring(
                    id.lastIndexOf(':') + 1,
                    id.lastIndexOf(';')
                );
                const idVersion = id.substring(
                    id.lastIndexOf(';') + 1,
                    id.length
                );

                let scheme = id.substring(
                    id.indexOf(':') + 1,
                    id.lastIndexOf(':')
                );
                // Scheme - replace ":" with "\"
                scheme = scheme.replace(':', '\\');

                if (!fileName) {
                    fileName = `${idPath}-${idVersion}`;
                }

                if (!directoryPath) {
                    directoryPath = scheme;
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

    const onImportClick = () => {
        uploadInputRef.current.click();
    };

    useEffect(() => {
        if (uploadInputRef.current) {
            // Add webkitdirectory and attributes to input element
            uploadInputRef.current.setAttribute('webkitdirectory', '');
            uploadInputRef.current.setAttribute('mozdirectory', '');
        }
    }, [uploadInputRef]);

    const items: ICommandBarItemProps[] = [
        {
            key: 'Save',
            text: t('OATHeader.file'),
            iconProps: { iconName: 'Save' },
            onClick: () => setSubMenuActive(!subMenuActive),
            id: ID_FILE
        },
        {
            key: 'Import',
            text: t('OATHeader.import'),
            iconProps: { iconName: 'Import' },
            onClick: onImportClick
        },
        {
            key: 'Export',
            text: t('OATHeader.export'),
            iconProps: { iconName: 'Export' },
            onClick: onExportClick
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

    return (
        <div className={headerStyles.container}>
            <div className={headerStyles.menuComponent}>
                <div className="cb-oat-header-model"></div>
                <div className="cb-oat-header-menu">
                    <input
                        type="file"
                        ref={uploadInputRef}
                        className={headerStyles.uploadDirectoryInput}
                        onChange={(e) => {
                            const reader = new FileReader();
                            reader.onload = () => {
                                const files = [];
                                for (const file of uploadInputRef.current
                                    .files) {
                                    files.push(file);
                                }
                                onFilesUpload(files);
                            };
                            reader.readAsDataURL(e.target.files[0]);
                        }}
                    />
                    <CommandBar items={items} />
                    {subMenuActive && (
                        <FileSubMenu
                            subMenuActive={subMenuActive}
                            targetId={ID_FILE}
                            setSubMenuActive={setSubMenuActive}
                            setModalOpen={setModalOpen}
                            setModalBody={setModalBody}
                            dispatch={dispatch}
                            state={state}
                            resetProject={resetProject}
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
            </div>
        </div>
    );
};

OATHeader.defaultProps = {
    elements: [],
    onImportClick: () => null
};

export default OATHeader;
