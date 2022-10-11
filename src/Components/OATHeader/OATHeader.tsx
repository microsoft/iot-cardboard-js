import React, {
    useEffect,
    useContext,
    useRef,
    useCallback,
    useMemo,
    useState
} from 'react';
import {
    classNamesFunction,
    CommandBar,
    ContextualMenuItemType,
    ICommandBarItemProps,
    IContextualMenuItem,
    IContextualMenuRenderItem,
    styled,
    useTheme
} from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import JSZip from 'jszip';
import { CommandHistoryContext } from '../../Pages/OATEditorPage/Internal/Context/CommandHistoryContext';
import {
    deepCopy,
    getDebugLogger,
    parseModels
} from '../../Models/Services/Utils';
import {
    HeaderModal,
    IOATHeaderProps,
    IOATHeaderStyleProps,
    IOATHeaderStyles
} from './OATHeader.types';
import {
    buildModelId,
    getDirectoryPathFromDTMI,
    getFileNameFromDTMI,
    getNextModelId,
    safeJsonParse
} from '../../Models/Services/OatUtils';
import { getStyles } from './OATHeader.styles';
import { useOatPageContext } from '../../Models/Context/OatPageContext/OatPageContext';
import { OatPageContextActionType } from '../../Models/Context/OatPageContext/OatPageContext.types';
import ManageOntologyModal from './internal/ManageOntologyModal/ManageOntologyModal';
import OATConfirmDialog from '../OATConfirmDialog/OATConfirmDialog';
import { DtdlInterface, OAT_INTERFACE_TYPE } from '../../Models/Constants';
import { CONTEXT_CLASS_BASE } from '../OATGraphViewer/Internal/Utils';

const debugLogging = false;
const logDebugConsole = getDebugLogger('OATHeader', debugLogging);

const getClassNames = classNamesFunction<
    IOATHeaderStyleProps,
    IOATHeaderStyles
>();

const OATHeader: React.FC<IOATHeaderProps> = (props) => {
    const { styles } = props;

    // hooks
    const { t } = useTranslation();
    const commandContex = useContext(CommandHistoryContext);
    const { undo, redo, canUndo, canRedo } = commandContex;

    // contexts
    const { oatPageDispatch, oatPageState } = useOatPageContext();

    // state
    const [openModal, setOpenModal] = useState<HeaderModal>(HeaderModal.None);
    const uploadFolderInputRef = useRef<HTMLInputElement>(null);
    const uploadFileInputRef = useRef<HTMLInputElement>(null);
    const redoButtonRef = useRef<IContextualMenuRenderItem>(null);
    const undoButtonRef = useRef<IContextualMenuRenderItem>(null);

    // styles
    const classNames = getClassNames(styles, { theme: useTheme() });

    // callbacks
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
                    metaDataCopy = deepCopy(
                        oatPageState.currentOntologyModelMetadata
                    );
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
                        ...oatPageState.currentOntologyModels,
                        ...newModels
                    ];
                    const error = await parseModels(combinedModels);

                    const modelsCopy = deepCopy(
                        oatPageState.currentOntologyModels
                    );
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
                                OatPageContextActionType.SET_CURRENT_MODELS_METADATA,
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
            oatPageState.currentOntologyModels,
            oatPageState.currentOntologyModelMetadata,
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
        setOpenModal(HeaderModal.CreateOntology);
    }, []);

    const onManageFile = useCallback(() => {
        setOpenModal(HeaderModal.EditOntology);
    }, []);

    const onDuplicate = useCallback(() => {
        oatPageDispatch({
            type: OatPageContextActionType.DUPLICATE_PROJECT
        });
    }, [oatPageDispatch]);

    const onExportClick = useCallback(() => {
        const zip = new JSZip();
        for (const element of oatPageState.currentOntologyModels) {
            const id = element['@id'];
            let fileName = null;
            let directoryPath = null;

            // Check if current elements exists within modelsMetadata array, if so, use the metadata
            // to determine the file name and directory path
            const modelMetadata = oatPageState.currentOntologyModelMetadata.find(
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
    }, [
        oatPageState.currentOntologyModels,
        oatPageState.currentOntologyModelMetadata
    ]);

    const onAddModel = useCallback(() => {
        const nextModelId = getNextModelId(
            oatPageState.currentOntologyModels,
            oatPageState.currentOntologyNamespace,
            t('OATCommon.defaultModelNamePrefix')
        );
        const name = `Model${nextModelId}`;
        const newModel: DtdlInterface = {
            '@context': CONTEXT_CLASS_BASE,
            '@id': nextModelId,
            '@type': OAT_INTERFACE_TYPE,
            displayName: name,
            contents: []
        };
        oatPageDispatch({
            type: OatPageContextActionType.SET_OAT_MODELS_TO_ADD,
            payload: {
                models: [newModel]
            }
        });
    }, [
        oatPageDispatch,
        oatPageState.currentOntologyModels,
        oatPageState.currentOntologyNamespace,
        t
    ]);

    // Side effects
    // Set listener to undo/redo buttons on key press
    useEffect(() => {
        const onKeyDown = getKeyboardShortcutHandler(
            redoButtonRef,
            undoButtonRef
        );
        document.addEventListener('keydown', onKeyDown);
        return () => {
            document.removeEventListener('keydown', onKeyDown);
        };
    }, []);

    // Data
    const switchSubMenuItems = useMemo(() => {
        const storedFiles = oatPageState.ontologyFiles;
        if (storedFiles.length > 0) {
            const formattedFiles: IContextualMenuItem[] = storedFiles.map(
                (file) => {
                    const onClick = () => {
                        oatPageDispatch({
                            type:
                                OatPageContextActionType.SWITCH_CURRENT_PROJECT,
                            payload: { projectId: file.id }
                        });
                    };
                    const MAX_LENGTH = 35;
                    let fileName = file.data.projectName || '';
                    if (fileName.length > MAX_LENGTH) {
                        fileName = fileName.substring(0, MAX_LENGTH) + '...';
                    }
                    return {
                        key: file.id,
                        text: fileName,
                        title: file.data.projectName,
                        onClick: onClick
                    };
                }
            );

            return formattedFiles;
        }
        return [];
    }, [oatPageDispatch, oatPageState.ontologyFiles]);

    const fileMenuItems: IContextualMenuItem[] = [
        {
            key: 'new',
            text: 'New',
            iconProps: { iconName: 'Add' },
            onClick: onNewFile,
            'data-testid': 'oat-header-ontology-menu-new'
        },
        {
            key: 'switch',
            text: 'Switch',
            disabled: switchSubMenuItems?.length <= 1,
            iconProps: { iconName: 'OpenFolderHorizontal' },
            subMenuProps: {
                items: switchSubMenuItems
            },
            'data-testid': 'oat-header-ontology-menu-switch'
        },
        {
            key: 'duplicate',
            text: 'Duplicate',
            iconProps: { iconName: 'Copy' },
            onClick: onDuplicate,
            'data-testid': 'oat-header-ontology-menu-copy'
        },
        {
            key: 'dividerImport',
            itemType: ContextualMenuItemType.Divider
        },
        {
            key: 'Export',
            text: t('OATHeader.export'),
            iconProps: { iconName: 'Export' },
            onClick: onExportClick,
            'data-testid': 'oat-header-ontology-menu-export'
        },
        {
            key: 'dividerManage',
            itemType: ContextualMenuItemType.Divider
        },
        {
            key: 'manage',
            text: 'Manage',
            iconProps: { iconName: 'Edit' },
            onClick: onManageFile,
            'data-testid': 'oat-header-ontology-menu-manage'
        }
    ];
    const undoMenuItems: IContextualMenuItem[] = [
        {
            componentRef: undoButtonRef,
            disabled: !canUndo,
            iconProps: { iconName: 'Undo' },
            key: 'under',
            onClick: undo,
            text: t('OATHeader.undo'),
            'data-testid': 'oat-header-undo-menu-undo'
        },
        {
            key: 'redo',
            text: t('OATHeader.redo'),
            iconProps: { iconName: 'Redo' },
            onClick: redo,
            disabled: !canRedo,
            componentRef: redoButtonRef,
            'data-testid': 'oat-header-undo-menu-redo'
        }
    ];
    const newModelMenuItems: IContextualMenuItem[] = [
        {
            key: 'newModel',
            iconProps: { iconName: 'AppIconDefaultAdd' },
            text: 'New model',
            onClick: onAddModel,
            'data-testid': 'oat-header-new-menu-new'
        },
        {
            key: 'importFile',
            text: t('OATHeader.importFile'),
            iconProps: { iconName: 'Import' },
            onClick: () => uploadFileInputRef.current.click(),
            'data-testid': 'oat-header-new-menu-import-file'
        },
        {
            key: 'importFolder',
            text: t('OATHeader.importFolder'),
            iconProps: { iconName: 'Import' },
            onClick: () => uploadFolderInputRef.current.click(),
            'data-testid': 'oat-header-new-menu-import-folder'
        }
    ];
    const commandBarItems: ICommandBarItemProps[] = [
        {
            key: 'file',
            iconProps: { iconName: 'FabricFolder' },
            text: t('OATHeader.ontology'),
            subMenuProps: {
                items: fileMenuItems
            },
            'data-testid': 'oat-header-ontology-menu'
        },
        {
            key: 'Undo',
            disabled: !(canRedo || canUndo),
            iconProps: { iconName: 'Undo' },
            onClick: undo,
            split: true,
            subMenuProps: {
                items: undoMenuItems
            },
            text: t('OATHeader.undo'),
            'data-testid': 'oat-header-undo-menu'
        },
        {
            key: 'newModel',
            iconProps: { iconName: 'AppIconDefaultAdd' },
            split: true,
            subMenuProps: {
                items: newModelMenuItems
            },
            text: 'New model',
            onClick: onAddModel,
            'data-testid': 'oat-header-new-menu'
        }
    ];

    logDebugConsole('debug', 'Render');
    return (
        <>
            <div className={classNames.root}>
                <h2 className={classNames.projectName}>
                    {oatPageState.currentOntologyProjectName}
                </h2>
                <CommandBar
                    items={commandBarItems}
                    styles={classNames.subComponentStyles.commandBar}
                />
                {/* Create ontology */}
                <ManageOntologyModal
                    isOpen={openModal === HeaderModal.CreateOntology}
                    onClose={() => setOpenModal(HeaderModal.None)}
                    ontologyId={''}
                />
                {/* Edit ontology */}
                <ManageOntologyModal
                    isOpen={openModal === HeaderModal.EditOntology}
                    onClose={() => setOpenModal(HeaderModal.None)}
                    ontologyId={oatPageState.currentOntologyId}
                />
                {/* Confirmation dialog for deletes */}
                <OATConfirmDialog />
            </div>

            {/* Hidden inputs for file imports */}
            <div
                aria-hidden={true}
                style={{ display: 'none', visibility: 'hidden' }}
            >
                {/* file upload */}
                <input
                    type="file"
                    ref={uploadFileInputRef}
                    onChange={getUploadFileHandler(uploadFileInputRef.current)}
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
        </>
    );
};

function getKeyboardShortcutHandler(
    redoButtonRef: React.MutableRefObject<IContextualMenuRenderItem>,
    undoButtonRef: React.MutableRefObject<IContextualMenuRenderItem>
) {
    return (e: KeyboardEvent) => {
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
}

export default styled<IOATHeaderProps, IOATHeaderStyleProps, IOATHeaderStyles>(
    OATHeader,
    getStyles
);
