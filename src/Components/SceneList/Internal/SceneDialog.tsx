import React, {
    useEffect,
    useCallback,
    useState,
    useMemo,
    useRef
} from 'react';
import { useTranslation } from 'react-i18next';
import { ISceneDialogProps, SelectionModeOf3DFile } from '../SceneList.types';
import {
    DefaultButton,
    Dialog,
    DialogFooter,
    DialogType,
    Icon,
    IDialogContentProps,
    IModalProps,
    IModalStyles,
    ITooltipHostStyles,
    Label,
    memoizeFunction,
    Pivot,
    PivotItem,
    PrimaryButton,
    TextField,
    TooltipHost
} from '@fluentui/react';
import File3DUploader from './3DFileUploader';
import { Supported3DFileTypes } from '../../../Models/Constants/Enums';
import { IBlobFile } from '../../../Models/Constants/Interfaces';
import useAdapter from '../../../Models/Hooks/useAdapter';
import { IScene } from '../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';

const fileUploadLabelTooltipStyles: ITooltipHostStyles = {
    root: {
        display: 'inline-block',
        cursor: 'pointer',
        height: 16
    }
};

const getDialogStyles = memoizeFunction(
    (selected3DFilePivotItem: SelectionModeOf3DFile): Partial<IModalStyles> => {
        return {
            scrollableContent: {
                selectors: {
                    '> div': {
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%'
                    },
                    '.ms-Dialog-inner': {
                        ...(selected3DFilePivotItem ===
                            SelectionModeOf3DFile.FromComputer && {
                            animation: 'show-scroll-y 1s'
                        }),
                        display: 'flex',
                        flexDirection: 'column',
                        flexGrow: 1,
                        height:
                            selected3DFilePivotItem ===
                            SelectionModeOf3DFile.FromContainer
                                ? '338px'
                                : '578px',
                        justifyContent: 'space-between',
                        overflowX: 'hidden',
                        transition: 'height .6s ease'
                    },
                    '.ms-Dialog-title': {
                        paddingBottom: 8
                    },
                    '.ms-Dialog-subText': {
                        marginBottom: 20
                    },
                    '.ms-Dialog-content': {
                        ...(selected3DFilePivotItem ===
                            SelectionModeOf3DFile.FromComputer && {
                            animation: 'show-scroll-y 1s'
                        }),
                        overflowX: 'hidden'
                    }
                }
            }
        };
    }
);

const SceneDialog: React.FC<ISceneDialogProps> = ({
    adapter,
    isOpen,
    onClose,
    sceneToEdit,
    onAddScene,
    onEditScene,
    renderBlobDropdown
}) => {
    const [newSceneName, setNewSceneName] = useState('');
    const [newSceneBlobUrl, setNewSceneBlobUrl] = useState('');
    const [scene, setScene] = useState<IScene>({ ...sceneToEdit });
    const sceneRef = useRef(scene);
    const [selected3DFilePivotItem, setSelected3DFilePivotItem] = useState(
        SelectionModeOf3DFile.FromContainer
    );
    const [isOverwriteFile, setIsOverwriteFile] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File>(null);
    const [blobsInContainer, setBlobsInContainer] = useState<Array<IBlobFile>>(
        []
    );
    const [isSelectedFileExistInBlob, setIsSelectedFileExistInBlob] = useState(
        false
    );
    const { t } = useTranslation();

    const put3DFileBlob = useAdapter({
        adapterMethod: (params: { fileToUpload: File }) =>
            adapter.putBlob(params.fileToUpload),
        refetchDependencies: [adapter],
        isAdapterCalledOnMount: false
    });

    useEffect(() => {
        if (!put3DFileBlob.adapterResult.hasNoData()) {
            const newlyAdded3DFile: IBlobFile =
                put3DFileBlob.adapterResult.result.data[0];
            if (sceneToEdit) {
                onEditScene({
                    ...scene,
                    assets: [
                        {
                            type: '3DAsset',
                            url: newlyAdded3DFile.Path
                        }
                    ]
                });
            } else {
                const newScene: IScene = {
                    id: undefined,
                    displayName: newSceneName,
                    assets: [
                        {
                            type: '3DAsset',
                            url: newlyAdded3DFile.Path
                        }
                    ],
                    elements: [],
                    behaviorIDs: []
                };
                onAddScene(newScene);
            }
        }
    }, [put3DFileBlob.adapterResult.result]);

    const dialogContentProps: IDialogContentProps = {
        type: DialogType.normal,
        title: sceneToEdit
            ? t('scenes.editDialogTitle')
            : t('scenes.addDialogTitle'),
        closeButtonAriaLabel: t('close'),
        subText: sceneToEdit
            ? t('scenes.editDialogSubText')
            : t('scenes.addDialogSubText')
    };

    const dialogModalProps: IModalProps = useMemo(
        () => ({
            layerProps: { eventBubblingEnabled: true }, // this is for making react-dropzone work in dialog
            isBlocking: true,
            styles: getDialogStyles(selected3DFilePivotItem),
            className: 'cb-scene-list-dialog-wrapper'
        }),
        [getDialogStyles]
    );

    useEffect(() => {
        setScene(sceneToEdit);
    }, [sceneToEdit]);

    useEffect(() => {
        sceneRef.current = scene;
    }, [scene]);

    useEffect(() => {
        if (!isOpen) {
            resetState();
        }
    }, [isOpen]);

    /**
     * When we switch between pivots and if it is "from container" tab cancel ongoing upload file operation and
     * reset file related state variables since the File3DUploader subcomponent is going to have resetted props
     * when it is mounted again when we switch tabs back to it again
     */
    useEffect(() => {
        if (selected3DFilePivotItem === SelectionModeOf3DFile.FromContainer) {
            put3DFileBlob.cancelAdapter();
            setIsSelectedFileExistInBlob(false);
            setIsOverwriteFile(false);
            setSelectedFile(null);
        }
    }, [selected3DFilePivotItem]);

    const handleNameChange = useCallback(
        (e) => {
            if (sceneToEdit) {
                const selectedSceneCopy: IScene = JSON.parse(
                    JSON.stringify(sceneRef.current)
                );
                selectedSceneCopy.displayName = e.currentTarget.value;
                setScene(selectedSceneCopy);
            } else {
                setNewSceneName(e.currentTarget.value);
            }
        },
        [sceneToEdit, scene]
    );

    const handleBlobUrlChange = useCallback(
        (blobUrl: string) => {
            if (sceneToEdit) {
                const selectedSceneCopy = JSON.parse(
                    JSON.stringify(sceneRef.current)
                );
                selectedSceneCopy.assets[0].url = blobUrl;
                setScene(selectedSceneCopy);
            } else {
                setNewSceneBlobUrl(blobUrl);
            }
        },
        [sceneToEdit, scene]
    );

    const handleFileOverwriteChange = useCallback((_e, checked: boolean) => {
        setIsOverwriteFile(checked);
    }, []);

    const handleSubmit = () => {
        if (
            selected3DFilePivotItem === SelectionModeOf3DFile.FromComputer &&
            selectedFile
        ) {
            put3DFileBlob.callAdapter({
                fileToUpload: selectedFile
            });
        } else {
            if (sceneToEdit) {
                onEditScene(scene);
            } else {
                const newScene: IScene = {
                    id: undefined,
                    displayName: newSceneName,
                    assets: [
                        {
                            type: '3DAsset',
                            url: newSceneBlobUrl
                        }
                    ],
                    elements: [],
                    behaviorIDs: []
                };
                onAddScene(newScene);
            }
        }
    };

    const handleOnClose = () => {
        if (put3DFileBlob.isLoading) {
            put3DFileBlob.cancelAdapter();
        }
        resetState();
        onClose();
    };

    const handleFileChange = useCallback(
        (file: File) => {
            if (file) {
                if (blobsInContainer.map((e) => e.Name).includes(file.name)) {
                    setIsSelectedFileExistInBlob(true);
                } else {
                    setIsSelectedFileExistInBlob(false);
                }
            } else {
                setIsSelectedFileExistInBlob(false);
                setIsOverwriteFile(false);
            }
            setSelectedFile(file);
        },
        [blobsInContainer]
    );

    const handleOnBlobsLoaded = (blobs: Array<IBlobFile>) => {
        setBlobsInContainer(blobs);
    };

    const handleOnPivotClick = useCallback(
        (item) =>
            setSelected3DFilePivotItem(
                item.props.itemKey as SelectionModeOf3DFile
            ),
        []
    );

    const resetState = useCallback(() => {
        setNewSceneName('');
        setNewSceneBlobUrl('');
        setIsSelectedFileExistInBlob(false);
        setIsOverwriteFile(false);
        setBlobsInContainer([]);
        setSelectedFile(null);
        setSelected3DFilePivotItem(SelectionModeOf3DFile.FromContainer);
    }, []);

    const isSubmitButtonDisabled = useMemo(
        () =>
            !(sceneToEdit ? scene?.displayName : newSceneName) ||
            (selected3DFilePivotItem === SelectionModeOf3DFile.FromContainer &&
                !(sceneToEdit ? scene?.assets?.[0]?.url : newSceneBlobUrl)) ||
            (selected3DFilePivotItem === SelectionModeOf3DFile.FromComputer &&
                (!selectedFile ||
                    (isSelectedFileExistInBlob && !isOverwriteFile))) ||
            put3DFileBlob.isLoading,
        [
            sceneToEdit,
            scene,
            newSceneName,
            newSceneBlobUrl,
            selected3DFilePivotItem,
            selectedFile,
            isSelectedFileExistInBlob,
            isOverwriteFile,
            put3DFileBlob
        ]
    );

    return (
        <Dialog
            minWidth={640}
            hidden={!isOpen}
            onDismiss={handleOnClose}
            dialogContentProps={dialogContentProps}
            modalProps={dialogModalProps}
        >
            <TextField
                className={"cb-scene-list-form-dialog-text-field"}
                label={t('name')}
                required
                title={newSceneName}
                value={sceneToEdit ? scene?.displayName : newSceneName}
                onChange={handleNameChange}
            />
            <div>
                <Label className={"cb-scene-list-form-dialog-3d-file-pivot-label"}>
                    {t('scenes.3dFileAsset')}
                </Label>
                <TooltipHost
                    content={t('blobDropdown.supportedFileTypes', {
                        fileTypes: Object.values(Supported3DFileTypes).join(
                            ', '
                        )
                    })}
                    styles={fileUploadLabelTooltipStyles}
                >
                    <Icon iconName={'Info'} aria-label={t('info')} />
                </TooltipHost>
            </div>

            <Pivot
                aria-label={t('scenes.3dFileSelectionMode')}
                selectedKey={selected3DFilePivotItem}
                onLinkClick={handleOnPivotClick}
                styles={{ root: { marginBottom: 16 } }}
            >
                <PivotItem
                    headerText={t('scenes.fromContainer')}
                    itemKey={SelectionModeOf3DFile.FromContainer}
                    style={{ width: '100%' }}
                >
                    {renderBlobDropdown(
                        handleBlobUrlChange,
                        handleOnBlobsLoaded
                    )}
                </PivotItem>
                <PivotItem
                    headerText={t('uploadFile')}
                    itemKey={SelectionModeOf3DFile.FromComputer}
                    style={{ width: '100%' }}
                >
                    <File3DUploader
                        isOverwriteVisible={isSelectedFileExistInBlob}
                        isOverwriteChecked={isOverwriteFile}
                        onOverwriteChange={handleFileOverwriteChange}
                        onFileChange={handleFileChange}
                        isUploadingFile={put3DFileBlob.isLoading}
                        uploadFileAdapterResult={put3DFileBlob.adapterResult}
                    />
                </PivotItem>
            </Pivot>
            <DialogFooter>
                <PrimaryButton
                    disabled={isSubmitButtonDisabled}
                    onClick={handleSubmit}
                    text={sceneToEdit ? t('update') : t('create')}
                />
                <DefaultButton onClick={handleOnClose} text={t('cancel')} />
            </DialogFooter>
        </Dialog>
    );
};

export default SceneDialog;
