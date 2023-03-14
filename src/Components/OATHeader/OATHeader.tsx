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
import { CommandHistoryContext } from '../../Pages/OATEditorPage/Internal/Context/CommandHistoryContext';
import { downloadFile, getDebugLogger } from '../../Models/Services/Utils';
import {
    HeaderModal,
    IOATHeaderProps,
    IOATHeaderStyleProps,
    IOATHeaderStyles
} from './OATHeader.types';
import { getStyles } from './OATHeader.styles';
import { useOatPageContext } from '../../Models/Context/OatPageContext/OatPageContext';
import { OatPageContextActionType } from '../../Models/Context/OatPageContext/OatPageContext.types';
import ManageOntologyModal from './internal/ManageOntologyModal/ManageOntologyModal';
import OATConfirmDialog from '../OATConfirmDialog/OATConfirmDialog';
import {
    createZipFileFromModels,
    IExportLocalizationKeys,
    IImportLocalizationKeys,
    parseFilesToModels
} from '../../Models/Services/OatPublicUtils';
import { getTotalReferenceCount } from '../../Models/Context/OatPageContext/OatPageContextUtils';
import { OAT_ONTOLOGY_MAX_REFERENCE_LIMIT } from '../../Models/Constants/Constants';
import useTelemetry from '../../Models/Hooks/useTelemetry';
import {
    AppRegion,
    ComponentName,
    TelemetryEvents
} from '../../Models/Constants/OatTelemetryConstants';
import { TelemetryTrigger } from '../../Models/Constants/TelemetryConstants';
import { getOatMetricsForModels } from '../../Models/Services/OatTelemetryUtils';

const debugLogging = false;
const logDebugConsole = getDebugLogger('OATHeader', debugLogging);

const getClassNames = classNamesFunction<
    IOATHeaderStyleProps,
    IOATHeaderStyles
>();

/** localization keys for error messages in the Import flow */
export const IMPORT_LOC_KEYS: IImportLocalizationKeys = {
    FileInvalidJson: 'OAT.ImportErrors.fileInvalidJSON',
    NoValidFilesMessage: 'OAT.ImportErrors.noValidFilesMessage',
    NoValidFilesTitle: 'OAT.ImportErrors.noValidFilesTitle',
    ImportFailedTitle: 'OAT.ImportErrors.importFailedTitle',
    ImportFailedMessage: 'OAT.ImportErrors.importFailedMessage',
    ExceptionTitle: 'OAT.Common.unhandledExceptionTitle',
    ExceptionMessage: 'OAT.Common.unhandledExceptionMessage'
};

/** localization keys for error messages in the Export flow */
export const EXPORT_LOC_KEYS: IExportLocalizationKeys = {
    ExceptionTitle: 'OAT.Common.unhandledExceptionTitle',
    ExceptionMessage: 'OAT.Common.unhandledExceptionMessage'
};

const TELEMETRY_COMPONENT_NAME = ComponentName.OAT;
const TELEMETRY_APP_REGION = AppRegion.OAT;

const OATHeader: React.FC<IOATHeaderProps> = (props) => {
    const { styles } = props;

    // hooks
    const { t } = useTranslation();
    const commandContex = useContext(CommandHistoryContext);
    const { undo, redo, canUndo, canRedo } = commandContex;
    const { sendEventTelemetry } = useTelemetry();

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
            logDebugConsole(
                'debug',
                `[IMPORT] [START] Files upload. (${files.length} files) {files}`,
                files
            );
            oatPageDispatch({
                type: OatPageContextActionType.UPDATE_IMPORT_PROGRESS,
                payload: {
                    state: 'loading',
                    fileCount: files.length
                }
            });
            const result = await parseFilesToModels({
                files: files,
                currentModels: oatPageState.currentOntologyModels,
                localizationKeys: IMPORT_LOC_KEYS,
                translate: t
            });
            // temporarily force an error while we resolve the performance issues
            if (
                getTotalReferenceCount(result.data) >=
                OAT_ONTOLOGY_MAX_REFERENCE_LIMIT
            ) {
                result.status = 'Failed';
                result.errors = [
                    {
                        title: t('OAT.ImportLimits.title'),
                        message: t('OAT.ImportLimits.message', {
                            count: OAT_ONTOLOGY_MAX_REFERENCE_LIMIT
                        })
                    }
                ];
                // Log limit exceeded
                sendEventTelemetry({
                    name: TelemetryEvents.import,
                    triggerType: TelemetryTrigger.UserAction,
                    appRegion: TELEMETRY_APP_REGION,
                    componentName: TELEMETRY_COMPONENT_NAME,
                    customProperties: {
                        success: false,
                        reason: 'Limit exceeded',
                        ...getOatMetricsForModels(result.data)
                    }
                });
            }
            if (result.status === 'Success') {
                oatPageDispatch({
                    type: OatPageContextActionType.UPDATE_IMPORT_PROGRESS,
                    payload: {
                        state: 'success',
                        modelCount: result.stats.newModelCount
                    }
                });
                oatPageDispatch({
                    type: OatPageContextActionType.IMPORT_MODELS,
                    payload: { models: result.data }
                });
                // Log success
                sendEventTelemetry({
                    name: TelemetryEvents.import,
                    triggerType: TelemetryTrigger.UserAction,
                    appRegion: TELEMETRY_APP_REGION,
                    componentName: TELEMETRY_COMPONENT_NAME,
                    customProperties: {
                        success: true,
                        ...getOatMetricsForModels(result.data)
                    }
                });
            } else if (result.status === 'Failed') {
                // show error
                const error =
                    result.errors?.length > 0
                        ? result.errors[0]
                        : {
                              title: t('OAT.Common.unhandledExceptionTitle'),
                              message: t('OAT.Common.unhandledexceptionMessage')
                          };
                oatPageDispatch({
                    type: OatPageContextActionType.SET_OAT_ERROR,
                    payload: {
                        title: error.title,
                        message: error.message
                    }
                });
                oatPageDispatch({
                    type: OatPageContextActionType.UPDATE_IMPORT_PROGRESS,
                    payload: {
                        state: 'closed'
                    }
                });
                // Log import error
                sendEventTelemetry({
                    name: TelemetryEvents.import,
                    triggerType: TelemetryTrigger.UserAction,
                    appRegion: TELEMETRY_APP_REGION,
                    componentName: TELEMETRY_COMPONENT_NAME,
                    customProperties: {
                        success: false,
                        reason: 'Unhandled exception'
                    }
                });
            }
            // Reset value of input element so that it can be reused with the same file
            uploadFolderInputRef.current.value = null;
            uploadFileInputRef.current.value = null;
            logDebugConsole('debug', '[IMPORT] [END] Files upload.', result);
        },
        [
            oatPageDispatch,
            oatPageState.currentOntologyModels,
            sendEventTelemetry,
            t
        ]
    );

    const onExportClick = useCallback(() => {
        logDebugConsole(
            'info',
            '[START] Export models to file. {models}',
            oatPageState.currentOntologyModels
        );

        const zipResult = createZipFileFromModels({
            models: oatPageState.currentOntologyModels,
            localizationKeys: EXPORT_LOC_KEYS,
            translate: t
        });
        if (zipResult.status === 'Success') {
            zipResult.file.generateAsync({ type: 'blob' }).then((content) => {
                logDebugConsole(
                    'info',
                    '[END] Export models to file. {content}',
                    content
                );
                // valid filename with no special characters
                const rgx = new RegExp(
                    /^[a-zA-Z0-9](?:[ a-zA-Z0-9._-]*[a-zA-Z0-9])?$/g
                );
                let fileName = 'ontology-models.zip';
                if (rgx.test(oatPageState.currentOntologyProjectName)) {
                    fileName = `${oatPageState.currentOntologyProjectName}-models.zip`;
                }
                downloadFile(content, fileName);
                // Log success
                sendEventTelemetry({
                    name: TelemetryEvents.export,
                    triggerType: TelemetryTrigger.UserAction,
                    appRegion: TELEMETRY_APP_REGION,
                    componentName: TELEMETRY_COMPONENT_NAME,
                    customProperties: {
                        success: true,
                        ...getOatMetricsForModels(
                            oatPageState.currentOntologyModels
                        )
                    }
                });
            });
        } else {
            // show error
            const error =
                zipResult.errors?.length > 0
                    ? zipResult.errors[0]
                    : {
                          title: t('OAT.Common.unhandledExceptionTitle'),
                          message: t('OAT.Common.unhandledexceptionMessage')
                      };
            oatPageDispatch({
                type: OatPageContextActionType.SET_OAT_ERROR,
                payload: {
                    title: error.title,
                    message: error.message
                }
            });
            // Log error
            sendEventTelemetry({
                name: TelemetryEvents.export,
                triggerType: TelemetryTrigger.UserAction,
                appRegion: TELEMETRY_APP_REGION,
                componentName: TELEMETRY_COMPONENT_NAME,
                customProperties: {
                    success: false,
                    reason: 'Unhandled exception',
                    ...getOatMetricsForModels(
                        oatPageState.currentOntologyModels
                    )
                }
            });
        }
    }, [
        oatPageState.currentOntologyModels,
        oatPageState.currentOntologyProjectName,
        t,
        sendEventTelemetry,
        oatPageDispatch
    ]);

    const getUploadFileHandler = (
        inputRef: HTMLInputElement
    ): React.ChangeEventHandler<HTMLInputElement> => {
        return (e: React.ChangeEvent<HTMLInputElement>) => {
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

    const onAddModel = useCallback(() => {
        oatPageDispatch({
            type: OatPageContextActionType.ADD_NEW_MODEL
        });
    }, [oatPageDispatch]);

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
    useEffect(() => {
        oatPageDispatch({
            type: OatPageContextActionType.SET_UPLOAD_FILE_CALLBACK,
            payload: {
                callback: () => uploadFileInputRef.current.click()
            }
        });
    }, [oatPageDispatch, uploadFileInputRef]);
    useEffect(() => {
        oatPageDispatch({
            type: OatPageContextActionType.SET_UPLOAD_FOLDER_CALLBACK,
            payload: {
                callback: () => uploadFolderInputRef.current.click()
            }
        });
    }, [oatPageDispatch, uploadFolderInputRef]);

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
            key: 'import',
            text: t('OATHeader.import'),
            iconProps: { iconName: 'Import' },
            subMenuProps: {
                items: [
                    {
                        key: 'importFile',
                        text: t('OATHeader.importFile'),
                        iconProps: { iconName: 'FileCode' },
                        onClick: oatPageState.openUploadFileCallback,
                        'data-testid': 'oat-header-new-menu-import-file'
                    },
                    {
                        key: 'importFolder',
                        text: t('OATHeader.importFolder'),
                        iconProps: { iconName: 'FabricFolder' },
                        onClick: oatPageState.openUploadFolderCallback,
                        'data-testid': 'oat-header-new-menu-import-folder'
                    }
                ]
            }
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
            text: t('OATHeader.configure'),
            iconProps: { iconName: 'Settings' },
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
                <ManageOntologyModal
                    isOpen={openModal !== HeaderModal.None}
                    onClose={() => setOpenModal(HeaderModal.None)}
                    ontologyId={
                        openModal === HeaderModal.CreateOntology
                            ? ''
                            : oatPageState.currentOntologyId
                    }
                />
                {/* Confirmation dialog for deletes */}
                <OATConfirmDialog />
            </div>

            {/* Hidden inputs for file imports */}
            <div aria-hidden="true" className={classNames.uploadInputContainer}>
                {/* file upload */}
                <input
                    title={t('OATHeader.importFile')}
                    type="file"
                    ref={uploadFileInputRef}
                    onChange={getUploadFileHandler(uploadFileInputRef.current)}
                    multiple
                />
                {/* folder upload */}
                <input
                    title={t('OATHeader.importFolder')}
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
