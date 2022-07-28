import React, { useEffect, useCallback, useMemo, useReducer } from 'react';
import { useTranslation } from 'react-i18next';
import {
    ISceneDialogProps,
    SelectionModeOf3DFile,
    SceneDialogActionType
} from '../SceneList.types';
import {
    DefaultButton,
    Dialog,
    DialogFooter,
    DialogType,
    Icon,
    IDialogContentProps,
    IModalProps,
    IModalStyles,
    IStackStyles,
    ITooltipHostStyles,
    Label,
    memoizeFunction,
    Pivot,
    PivotItem,
    PrimaryButton,
    Stack,
    StackItem,
    TextField,
    Toggle,
    TooltipHost
} from '@fluentui/react';
import File3DUploader from './3DFileUploader';
import { Supported3DFileTypes } from '../../../Models/Constants/Enums';
import { IStorageBlob } from '../../../Models/Constants/Interfaces';
import useAdapter from '../../../Models/Hooks/useAdapter';
import {
    getDefaultSceneDialogState,
    SceneDialogReducer
} from './SceneDialog.state';
const fileUploadLabelTooltipStyles: ITooltipHostStyles = {
    root: {
        display: 'inline-block',
        cursor: 'pointer',
        height: 16
    }
};

const DEFAULT_HEIGHT_UPLOAD = 432;
const DEFAULT_HEIGHT_WITH_CONTAINER = 652;
const getDialogStyles = memoizeFunction(
    (selected3DFilePivotItem: SelectionModeOf3DFile): Partial<IModalStyles> => {
        const isContainerTab =
            selected3DFilePivotItem === SelectionModeOf3DFile.FromContainer;
        const isUploadTab =
            selected3DFilePivotItem === SelectionModeOf3DFile.FromComputer;
        const modalHeight = isContainerTab
            ? DEFAULT_HEIGHT_UPLOAD
            : DEFAULT_HEIGHT_WITH_CONTAINER;
        return {
            scrollableContent: {
                selectors: {
                    '> div': {
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%'
                    },
                    '.ms-Dialog-inner': {
                        ...(isUploadTab && {
                            animation: 'show-scroll-y 1s'
                        }),
                        display: 'flex',
                        flexDirection: 'column',
                        flexGrow: 1,
                        height: modalHeight,
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
    const [state, dispatch] = useReducer(
        SceneDialogReducer,
        getDefaultSceneDialogState(sceneToEdit)
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
            const newlyAdded3DFile: IStorageBlob =
                put3DFileBlob.adapterResult.result.data[0];
            if (sceneToEdit) {
                const sceneObjectForAddOrEdit = {
                    ...sceneToEdit,
                    assets: [
                        {
                            type: '3DAsset',
                            url: newlyAdded3DFile.Path
                        }
                    ]
                };
                onEditScene(sceneObjectForAddOrEdit);
            } else {
                const sceneObjectForAddOrEdit = {
                    ...state.scene,
                    assets: [
                        {
                            type: '3DAsset',
                            url: newlyAdded3DFile.Path
                        }
                    ]
                };
                onAddScene(sceneObjectForAddOrEdit);
            }
        }
    }, [put3DFileBlob.adapterResult.result]);

    const dialogContentProps: IDialogContentProps = {
        type: DialogType.normal,
        title: sceneToEdit
            ? t('scenes.dialogTitleEdit')
            : t('scenes.dialogTitleCreate'),
        closeButtonAriaLabel: t('close'),
        subText: t('scenes.dialogSubTitle')
    };

    const dialogModalProps: IModalProps = useMemo(
        () => ({
            layerProps: { eventBubblingEnabled: true }, // this is for making react-dropzone work in dialog
            isBlocking: true,
            styles: getDialogStyles(state.selected3DFilePivotItem),
            className: 'cb-scene-list-dialog-wrapper'
        }),
        [getDialogStyles, state.selected3DFilePivotItem]
    );

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
        if (
            state.selected3DFilePivotItem ===
            SelectionModeOf3DFile.FromContainer
        ) {
            put3DFileBlob.cancelAdapter();
            dispatch({
                type: SceneDialogActionType.RESET_FILE
            });
        }
    }, [state.selected3DFilePivotItem]);

    const handleNameChange = useCallback((e, newValue?: string) => {
        dispatch({
            type: SceneDialogActionType.SET_SCENE_NAME,
            payload: { displayName: newValue }
        });
    }, []);

    const handleSceneDescriptionChange = useCallback((e, newValue?: string) => {
        dispatch({
            type: SceneDialogActionType.SET_SCENE_DESCRIPTION,
            payload: { description: newValue }
        });
    }, []);

    const handleLatitudeValueChange = useCallback((e) => {
        const newValue = e.currentTarget.value;
        const lat = newValue?.length ? Number(newValue) : undefined;
        dispatch({
            type: SceneDialogActionType.SET_LATITUDE_VALUE,
            payload: { latitude: lat }
        });
    }, []);
    const handleLongitudeValueChange = useCallback((e) => {
        const newValue = e.currentTarget.value;
        const long = newValue?.length ? Number(newValue) : undefined;

        dispatch({
            type: SceneDialogActionType.SET_LONGITUDE_VALUE,
            payload: { longitude: long }
        });
    }, []);
    const handleBlobUrlChange = useCallback((blobUrl: string) => {
        dispatch({
            type: SceneDialogActionType.SET_SCENE_BLOB_URL,
            payload: { sceneBlobUrl: blobUrl }
        });
    }, []);

    const handleFileOverwriteChange = useCallback((_e, checked: boolean) => {
        dispatch({
            type: SceneDialogActionType.SET_IS_OVER_WRITE_FILE,
            payload: { isOverwriteFile: checked }
        });
    }, []);

    const handleSubmit = () => {
        if (
            state.selected3DFilePivotItem ===
                SelectionModeOf3DFile.FromComputer &&
            state.selectedFile
        ) {
            put3DFileBlob.callAdapter({
                fileToUpload: state.selectedFile
            });
        } else {
            if (sceneToEdit) {
                onEditScene(state.scene);
            } else {
                onAddScene(state.scene);
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
                dispatch({
                    type:
                        SceneDialogActionType.SET_IS_SELECTED_FILE_EXIST_IN_BLOB,
                    payload: {
                        isSelectedFileExistInBlob: state.blobsInContainer
                            .map((e) => e.Name)
                            .includes(file.name)
                    }
                });
            } else {
                dispatch({
                    type:
                        SceneDialogActionType.RESET_OVERWRITE_FILE_AND_EXIST_IN_BLOB,
                    payload: {
                        isSelectedFileExistInBlob: false,
                        isOverwriteFile: false
                    }
                });
            }
            dispatch({
                type: SceneDialogActionType.SET_SELECTED_FILE,
                payload: { selectedFile: file }
            });
        },
        [state.blobsInContainer]
    );

    const handleOnBlobsLoaded = (blobs: Array<IStorageBlob>) => {
        dispatch({
            type: SceneDialogActionType.SET_BLOBS_IN_CONTAINER,
            payload: { blobsInContainer: blobs }
        });
    };

    const handleOnPivotClick = useCallback(
        (item) =>
            dispatch({
                type: SceneDialogActionType.SET_SELECTED_3D_FILE_PIVOT_ITEM,
                payload: {
                    selected3DFilePivotItem: item.props
                        .itemKey as SelectionModeOf3DFile
                }
            }),
        []
    );

    const resetState = useCallback(() => {
        dispatch({
            type: SceneDialogActionType.RESET_SCENE
        });
    }, []);

    const isSubmitButtonDisabled = useMemo(() => {
        return (
            !state.scene.displayName ||
            (state.isShowOnGlobeEnabled &&
                (isNaN(state.scene.latitude) ||
                    isNaN(state.scene.longitude))) ||
            (state.selected3DFilePivotItem ===
                SelectionModeOf3DFile.FromContainer &&
                !state.sceneBlobUrl) ||
            (state.selected3DFilePivotItem ===
                SelectionModeOf3DFile.FromComputer &&
                (!state.selectedFile ||
                    (state.isSelectedFileExistInBlob &&
                        !state.isOverwriteFile))) ||
            put3DFileBlob.isLoading
        );
    }, [
        state.scene.displayName,
        state.sceneBlobUrl,
        state.selected3DFilePivotItem,
        state.selectedFile,
        state.isSelectedFileExistInBlob,
        state.isOverwriteFile,
        put3DFileBlob
    ]);
    const styleStack: IStackStyles = {
        root: {
            margin: '8px',
            marginLeft: 0
        }
    };
    const handleGlobeToggle = (
        ev: React.MouseEvent<HTMLElement>,
        checked?: boolean
    ) => {
        dispatch({
            type: SceneDialogActionType.SET_IS_SHOW_ON_GLOBE_ENABLED,
            payload: { isShowOnGlobeEnabled: checked }
        });
    };

    const getLatitudeErrorMessage = (value: string): string => {
        return !(Number(value) >= -90 && Number(value) <= 90)
            ? t('scenes.latitudeErrorMessage')
            : '';
    };

    const getLongitudeErrorMessage = (value: string): string => {
        return !(Number(value) >= -180 && Number(value) <= 180)
            ? t('scenes.longitudeErrorMessage')
            : '';
    };
    return (
        <Dialog
            minWidth={640}
            hidden={!isOpen}
            onDismiss={handleOnClose}
            dialogContentProps={dialogContentProps}
            modalProps={dialogModalProps}
        >
            <TextField
                className="cb-scene-list-form-dialog-text-field"
                label={t('name')}
                placeholder={t('scenes.sceneNamePlaceholder')}
                required
                title={state.scene.displayName}
                value={state.scene.displayName}
                onChange={handleNameChange}
            />
            <TextField
                className="cb-scene-list-form-dialog-description-field"
                label={t('scenes.description')}
                title={state.scene.description}
                value={state.scene.description}
                placeholder={t('scenes.sceneDescriptionPlaceholder')}
                onChange={handleSceneDescriptionChange}
            />
            <Stack horizontal styles={styleStack} tokens={{ childrenGap: 20 }}>
                <StackItem>
                    <Toggle
                        defaultChecked={state.isShowOnGlobeEnabled}
                        label={t('scenes.showOnGlobe')}
                        onText="On"
                        offText="Off"
                        onChange={handleGlobeToggle}
                    />
                </StackItem>
                {state.isShowOnGlobeEnabled && (
                    <>
                        <StackItem>
                            <TextField
                                styles={{ root: { width: 200 } }}
                                label={t('scenes.latitude')}
                                defaultValue={String(
                                    state.scene?.latitude ?? ''
                                )}
                                onGetErrorMessage={getLatitudeErrorMessage}
                                placeholder={t('scenes.sampleLatitude')}
                                required
                                onChange={handleLatitudeValueChange}
                                validateOnLoad={false}
                            />
                        </StackItem>
                        <StackItem>
                            <TextField
                                styles={{ root: { width: 200 } }}
                                label={t('scenes.longitude')}
                                defaultValue={String(
                                    state.scene?.longitude ?? ''
                                )}
                                placeholder={t('scenes.sampleLongitude')}
                                onGetErrorMessage={getLongitudeErrorMessage}
                                required
                                onChange={handleLongitudeValueChange}
                                validateOnLoad={false}
                            />
                        </StackItem>
                    </>
                )}
            </Stack>
            <div>
                <Label className="cb-scene-list-form-dialog-3d-file-pivot-label">
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
                selectedKey={state.selected3DFilePivotItem}
                onLinkClick={handleOnPivotClick}
                styles={{ root: { marginBottom: 16 } }}
            >
                <PivotItem
                    headerText={t('scenes.tabNameFromContainer')}
                    itemKey={SelectionModeOf3DFile.FromContainer}
                    style={{ width: '100%' }}
                >
                    {renderBlobDropdown(
                        handleBlobUrlChange,
                        handleOnBlobsLoaded
                    )}
                </PivotItem>
                <PivotItem
                    headerText={t('scenes.tabNameUploadFile')}
                    itemKey={SelectionModeOf3DFile.FromComputer}
                    style={{ width: '100%' }}
                >
                    <File3DUploader
                        isOverwriteVisible={state.isSelectedFileExistInBlob}
                        isOverwriteChecked={state.isOverwriteFile}
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
