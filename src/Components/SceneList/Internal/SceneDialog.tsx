import React, {
    useEffect,
    useCallback,
    useState,
    useMemo,
    useRef,
    useReducer
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
import { IBlobFile } from '../../../Models/Constants/Interfaces';
import useAdapter from '../../../Models/Hooks/useAdapter';
import { IScene } from '../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { deepCopy } from '../../../Models/Services/Utils';
import {
    defaultSceneDialogState,
    SceneDialogReducer
} from './SceneDialog.state';
import {
    RESET,
    SET_BLOBS_IN_CONTAINER,
    SET_IS_OVER_WRITE_FILE,
    SET_IS_SELECTED_FILE_EXIST_IN_BLOB,
    SET_NEW_LATITUDE_VALUE,
    SET_NEW_LONGITUDE_VALUE,
    SET_NEW_SCENE_BLOB_URL,
    SET_NEW_SCENE_DESCRIPTION,
    SET_NEW_SCENE_NAME,
    SET_SELECTED_3D_FILE_PIVOT_ITEM,
    SET_SELECTED_FILE
} from '../../../Models/Constants/ActionTypes';

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
                                ? '438px'
                                : '588px',
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
        defaultSceneDialogState
    );
    const [scene, setScene] = useState<IScene>({ ...sceneToEdit });
    const sceneRef = useRef(scene);
    const [isShowOnGlobeEnabled, setIsShowOnGlobeEnabled] = useState(
        Boolean(
            !(isNaN(sceneToEdit?.latitude) || isNaN(sceneToEdit?.longitude))
        )
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
                const newScene = getNewScene(newlyAdded3DFile.Path);
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
            styles: getDialogStyles(state.selected3DFilePivotItem),
            className: 'cb-scene-list-dialog-wrapper'
        }),
        [getDialogStyles, state.selected3DFilePivotItem]
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
        if (
            state.selected3DFilePivotItem ===
            SelectionModeOf3DFile.FromContainer
        ) {
            put3DFileBlob.cancelAdapter();
            dispatch({
                type: SET_IS_SELECTED_FILE_EXIST_IN_BLOB,
                payload: false
            });
            dispatch({
                type: SET_IS_OVER_WRITE_FILE,
                payload: false
            });
            dispatch({
                type: SET_SELECTED_FILE,
                payload: null
            });
        }
    }, [state.selected3DFilePivotItem]);

    const handleNameChange = useCallback(
        (e) => {
            if (sceneToEdit) {
                const selectedSceneCopy: IScene = deepCopy(sceneRef.current);
                selectedSceneCopy.displayName = e.currentTarget.value;
                setScene(selectedSceneCopy);
            } else {
                // setNewSceneName(e.currentTarget.value);
                dispatch({
                    type: SET_NEW_SCENE_NAME,
                    payload: e.currentTarget.value
                });
            }
        },
        [sceneToEdit, scene]
    );

    const handleSceneDescriptionChange = useCallback(
        (e) => {
            if (sceneToEdit) {
                const selectedSceneCopy: IScene = deepCopy(sceneRef.current);
                selectedSceneCopy.description = e.currentTarget.value;
                setScene(selectedSceneCopy);
            } else {
                dispatch({
                    type: SET_NEW_SCENE_DESCRIPTION,
                    payload: e.currentTarget.value
                });
            }
        },
        [sceneToEdit, scene]
    );

    const handleLatitudeValueChange = useCallback(
        (e) => {
            const newValue = e.currentTarget.value;
            const lat = newValue?.length ? Number(newValue) : undefined;
            if (sceneToEdit) {
                const selectedSceneCopy: IScene = deepCopy(sceneRef.current);
                selectedSceneCopy.latitude = lat;
                setScene(selectedSceneCopy);
            } else {
                dispatch({
                    type: SET_NEW_LATITUDE_VALUE,
                    payload: lat
                });
            }
        },
        [sceneToEdit, scene]
    );
    const handleLongitudeValueChange = useCallback(
        (e) => {
            const newValue = e.currentTarget.value;
            const long = newValue?.length ? Number(newValue) : undefined;
            if (sceneToEdit) {
                const selectedSceneCopy: IScene = deepCopy(sceneRef.current);
                selectedSceneCopy.longitude = long;
                setScene(selectedSceneCopy);
            } else {
                dispatch({
                    type: SET_NEW_LONGITUDE_VALUE,
                    payload: long
                });
            }
        },
        [sceneToEdit, scene]
    );
    const handleBlobUrlChange = useCallback(
        (blobUrl: string) => {
            if (sceneToEdit) {
                const selectedSceneCopy = deepCopy(sceneRef.current);
                selectedSceneCopy.assets[0].url = blobUrl;
                setScene(selectedSceneCopy);
            } else {
                dispatch({
                    type: SET_NEW_SCENE_BLOB_URL,
                    payload: blobUrl
                });
            }
        },
        [sceneToEdit, scene]
    );

    const handleFileOverwriteChange = useCallback((_e, checked: boolean) => {
        dispatch({
            type: SET_IS_OVER_WRITE_FILE,
            payload: checked
        });
    }, []);

    const getNewScene = (assetUrl: string) => {
        return {
            id: undefined,
            displayName: state.newSceneName,
            description: state.newSceneDescription,
            latitude: state.newLatitudeValue,
            longitude: state.newLongitudeValue,
            assets: [
                {
                    type: '3DAsset',
                    url: assetUrl
                }
            ],
            elements: [],
            behaviorIDs: []
        };
    };

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
                onEditScene(scene);
            } else {
                const newScene = getNewScene(state.newSceneBlobUrl);
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
                if (
                    state.blobsInContainer
                        .map((e) => e.Name)
                        .includes(file.name)
                ) {
                    dispatch({
                        type: SET_IS_SELECTED_FILE_EXIST_IN_BLOB,
                        payload: true
                    });
                } else {
                    dispatch({
                        type: SET_IS_SELECTED_FILE_EXIST_IN_BLOB,
                        payload: false
                    });
                }
            } else {
                dispatch({
                    type: SET_IS_SELECTED_FILE_EXIST_IN_BLOB,
                    payload: false
                });
                dispatch({
                    type: SET_IS_OVER_WRITE_FILE,
                    payload: false
                });
            }
            dispatch({
                type: SET_SELECTED_FILE,
                payload: file
            });
        },
        [state.blobsInContainer]
    );

    const handleOnBlobsLoaded = (blobs: Array<IBlobFile>) => {
        dispatch({
            type: SET_BLOBS_IN_CONTAINER,
            payload: blobs
        });
    };

    const handleOnPivotClick = useCallback(
        (item) =>
            dispatch({
                type: SET_SELECTED_3D_FILE_PIVOT_ITEM,
                payload: item.props.itemKey as SelectionModeOf3DFile
            }),
        []
    );

    const resetState = useCallback(() => {
        dispatch({
            type: RESET,
            payload: defaultSceneDialogState
        });
        setIsShowOnGlobeEnabled(isShowOnGlobeEnabled);
    }, []);

    const isSubmitButtonDisabled = useMemo(() => {
        return (
            !(sceneToEdit ? scene?.displayName : state.newSceneName) ||
            (isShowOnGlobeEnabled &&
                ((sceneToEdit
                    ? isNaN(scene?.latitude)
                    : isNaN(state.newLatitudeValue)) ||
                    (sceneToEdit
                        ? isNaN(scene?.longitude)
                        : isNaN(state.newLongitudeValue)))) ||
            (state.selected3DFilePivotItem ===
                SelectionModeOf3DFile.FromContainer &&
                !(sceneToEdit
                    ? scene?.assets?.[0]?.url
                    : state.newSceneBlobUrl)) ||
            (state.selected3DFilePivotItem ===
                SelectionModeOf3DFile.FromComputer &&
                (!state.selectedFile ||
                    (state.isSelectedFileExistInBlob &&
                        !state.isOverwriteFile))) ||
            put3DFileBlob.isLoading
        );
    }, [
        sceneToEdit,
        scene,
        state.newSceneName,
        state.newSceneBlobUrl,
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
        setIsShowOnGlobeEnabled(checked);
        if (!checked) {
            if (!isNaN(sceneRef.current?.latitude)) {
                delete sceneRef.current.latitude;
            }
            if (!isNaN(sceneRef.current?.longitude)) {
                delete sceneRef.current.longitude;
            }
        }
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
                required
                title={state.newSceneName}
                value={sceneToEdit ? scene?.displayName : state.newSceneName}
                onChange={handleNameChange}
            />
            <TextField
                className="cb-scene-list-form-dialog-description-field"
                label={t('scenes.description')}
                title={state.newSceneDescription}
                value={
                    sceneToEdit ? scene?.description : state.newSceneDescription
                }
                onChange={handleSceneDescriptionChange}
            />
            <Stack horizontal styles={styleStack} tokens={{ childrenGap: 20 }}>
                <StackItem>
                    <Toggle
                        defaultChecked={isShowOnGlobeEnabled}
                        label={t('scenes.showOnGlobe')}
                        onText="On"
                        offText="Off"
                        onFocus={() => console.log('onFocus called')}
                        onBlur={() => console.log('onBlur called')}
                        onChange={handleGlobeToggle}
                    />
                </StackItem>
                {isShowOnGlobeEnabled && (
                    <>
                        <StackItem>
                            <TextField
                                styles={{ root: { width: 200 } }}
                                label={t('scenes.latitude')}
                                defaultValue={String(scene?.latitude ?? '')}
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
                                defaultValue={String(scene?.longitude ?? '')}
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
