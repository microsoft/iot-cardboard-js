import React, { memo, useCallback, useEffect, useState } from 'react';
import { SceneListProps } from './SceneList.types';
import './SceneList.scss';
import { useAdapter } from '../../Models/Hooks';
import { useTranslation } from 'react-i18next';
import {
    SelectionMode,
    DetailsListLayoutMode,
    ActionButton,
    DetailsList,
    IColumn,
    IconButton,
    Dialog,
    DialogFooter,
    PrimaryButton,
    DefaultButton,
    DialogType,
    TextField,
    IDetailsListProps,
    DetailsRow,
    IButtonProps
} from '@fluentui/react';
import { withErrorBoundary } from '../../Models/Context/ErrorBoundary';
import { IAsset, IScenesConfig, IScene } from '../../Models/Classes/3DVConfig';
import { createGUID } from '../../Models/Services/Utils';
import ViewerConfigUtility from '../../Models/Classes/ViewerConfigUtility';
import { IComponentError } from '../../Models/Constants/Interfaces';
import {
    ComponentErrorType,
    Supported3DFileTypes
} from '../../Models/Constants/Enums';
import BaseComponent from '../../Components/BaseComponent/BaseComponent';
import BlobDropdown from '../BlobDropdown/BlobDropdown';

const SceneList: React.FC<SceneListProps> = ({
    adapter,
    theme,
    locale,
    localeStrings,
    onSceneClick,
    additionalActions
}) => {
    const scenesConfig = useAdapter({
        adapterMethod: () => adapter.getScenesConfig(),
        refetchDependencies: [adapter]
    });

    const addScene = useAdapter({
        adapterMethod: (params: { config: IScenesConfig; scene: IScene }) =>
            adapter.putScenesConfig(
                ViewerConfigUtility.addScene(params.config, params.scene)
            ),
        refetchDependencies: [adapter],
        isAdapterCalledOnMount: false
    });

    const editScene = useAdapter({
        adapterMethod: (params: {
            config: IScenesConfig;
            sceneId: string;
            scene: IScene;
        }) =>
            adapter.putScenesConfig(
                ViewerConfigUtility.editScene(
                    params.config,
                    params.sceneId,
                    params.scene
                )
            ),
        refetchDependencies: [adapter],
        isAdapterCalledOnMount: false
    });

    const deleteScene = useAdapter({
        adapterMethod: (params: { config: IScenesConfig; sceneId: string }) =>
            adapter.putScenesConfig(
                ViewerConfigUtility.deleteScene(params.config, params.sceneId)
            ),
        refetchDependencies: [adapter],
        isAdapterCalledOnMount: false
    });

    const [errors, setErrors] = useState<Array<IComponentError>>([]);
    const [config, setConfig] = useState<IScenesConfig>(null);
    const [sceneList, setSceneList] = useState<Array<IScene>>([]);
    const [selectedScene, setSelectedScene] = useState<IScene>(undefined);
    const [isSceneDialogOpen, setIsSceneDialogOpen] = useState(false);
    const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] = useState(
        false
    );

    useEffect(() => {
        if (!scenesConfig.adapterResult.hasNoData()) {
            const config: IScenesConfig = scenesConfig.adapterResult.getData();
            setConfig(config);
            setSceneList(() => {
                let scenes;
                try {
                    scenes = config?.viewerConfiguration?.scenes?.sort(
                        (a: IScene, b: IScene) =>
                            a.displayName?.localeCompare(
                                b.displayName,
                                undefined,
                                {
                                    sensitivity: 'base'
                                }
                            )
                    );
                } catch {
                    scenes = config?.viewerConfiguration?.scenes;
                }
                return scenes ?? [];
            });
        } else {
            setSceneList([]);
        }
        if (scenesConfig?.adapterResult.getErrors()) {
            const errors: Array<IComponentError> = scenesConfig?.adapterResult.getErrors();
            setErrors(errors);
        } else {
            setErrors([]);
        }
    }, [scenesConfig?.adapterResult]);

    useEffect(() => {
        if (addScene.adapterResult.result) {
            scenesConfig.callAdapter();
            setIsSceneDialogOpen(false);
        }
    }, [addScene?.adapterResult]);

    useEffect(() => {
        if (editScene.adapterResult.result) {
            scenesConfig.callAdapter();
            setIsSceneDialogOpen(false);
            setSelectedScene(null);
        }
    }, [editScene?.adapterResult]);

    useEffect(() => {
        if (deleteScene.adapterResult.result) {
            scenesConfig.callAdapter();
            setIsConfirmDeleteDialogOpen(false);
            setSelectedScene(null);
        }
    }, [deleteScene?.adapterResult]);

    const { t } = useTranslation();

    const confirmDeletionDialogProps = {
        type: DialogType.normal,
        title: t('confirmDeletion'),
        closeButtonAriaLabel: t('close'),
        subText: t('confirmDeletionDesc')
    };

    const confirmDeletionDialogStyles = {
        main: { maxWidth: 450, minHeight: 165 }
    };

    const confirmDeletionModalProps = React.useMemo(
        () => ({
            isBlocking: false,
            styles: confirmDeletionDialogStyles,
            className: 'cb-scene-list-dialog-wrapper'
        }),
        []
    );

    const renderListRow: IDetailsListProps['onRenderRow'] = (props) => (
        <div
            onClick={() => {
                if (typeof onSceneClick === 'function') {
                    onSceneClick(props.item);
                }
            }}
        >
            <DetailsRow className={'cb-scene-list-row'} {...props} />
        </div>
    );

    const renderItemColumn: IDetailsListProps['onRenderItemColumn'] = (
        item: any,
        _itemIndex: number,
        column: IColumn
    ) => {
        const fieldContent = item[column.fieldName] as string;
        switch (column.key) {
            case 'scene-action':
                return (
                    <>
                        <IconButton
                            iconProps={{ iconName: 'Edit' }}
                            title={t('edit')}
                            ariaLabel={t('edit')}
                            onClick={(event) => {
                                event.stopPropagation();
                                setSelectedScene(item);
                                setIsSceneDialogOpen(true);
                            }}
                            className={'cb-scenes-action-button'}
                        />
                        <IconButton
                            iconProps={{ iconName: 'Delete' }}
                            title={t('delete')}
                            ariaLabel={t('delete')}
                            onClick={(event) => {
                                event.stopPropagation();
                                setSelectedScene(item);
                                setIsConfirmDeleteDialogOpen(true);
                            }}
                            className={'cb-scenes-action-button'}
                        />
                    </>
                );
            default:
                return <span>{fieldContent}</span>;
        }
    };

    const renderBlobDropdown = useCallback(
        (onChange?: (blobUrl: string) => void) => (
            <BlobDropdown
                adapter={adapter}
                theme={theme}
                locale={locale}
                localeStrings={localeStrings}
                fileTypes={Object.values(Supported3DFileTypes)}
                selectedBlobUrl={(selectedScene?.assets?.[0] as IAsset)?.url}
                onChange={onChange}
                width={492}
                isRequired
            />
        ),
        [adapter, theme, locale, localeStrings, selectedScene]
    );

    return (
        <BaseComponent
            theme={theme}
            locale={locale}
            localeStrings={localeStrings}
            isLoading={scenesConfig.isLoading}
            containerClassName={'cb-scene-list-card-wrapper'}
        >
            {sceneList.length > 0 ? (
                <>
                    <div className="cb-scene-list-action-buttons">
                        <ActionButton
                            iconProps={{ iconName: 'Add' }}
                            onClick={() => {
                                setIsSceneDialogOpen(true);
                            }}
                            disabled={
                                errors[0]?.type ===
                                ComponentErrorType.UnauthorizedAccess
                                    ? true
                                    : false
                            }
                        >
                            {t('addNew')}
                        </ActionButton>
                        {additionalActions?.map((a: IButtonProps, idx) => (
                            <ActionButton
                                key={idx}
                                iconProps={a.iconProps}
                                onClick={a.onClick}
                            >
                                {a.text}
                            </ActionButton>
                        ))}
                    </div>

                    <div className="cb-scenes-list">
                        <DetailsList
                            selectionMode={SelectionMode.none}
                            items={sceneList}
                            columns={[
                                {
                                    key: 'scene-name',
                                    name: t('name'),
                                    minWidth: 100,
                                    isResizable: true,
                                    onRender: (item: IScene) => (
                                        <span>{item.displayName}</span>
                                    )
                                },
                                {
                                    key: 'scene-urls',
                                    name: t('scenes.blobUrl'),
                                    minWidth: 400,
                                    isResizable: true,
                                    onRender: (item: IScene) => (
                                        <ul className="cb-scene-list-blob-urls">
                                            {item.assets.map(
                                                (a: IAsset, idx) => {
                                                    return (
                                                        <li
                                                            key={`blob-url-${idx}`}
                                                        >
                                                            {a.url}
                                                        </li>
                                                    );
                                                }
                                            )}
                                        </ul>
                                    )
                                },
                                {
                                    key: 'scene-latitude',
                                    name: t('scenes.sceneLatitude'),
                                    minWidth: 100,
                                    onRender: (item: IScene) => item.latitude
                                },
                                {
                                    key: 'scene-longitude',
                                    name: t('scenes.sceneLongitude'),
                                    minWidth: 100,
                                    onRender: (item: IScene) => item.longitude
                                },
                                {
                                    key: 'scene-action',
                                    name: t('action'),
                                    fieldName: 'action',
                                    minWidth: 100
                                }
                            ]}
                            setKey="set"
                            layoutMode={DetailsListLayoutMode.justified}
                            onRenderRow={renderListRow}
                            onRenderItemColumn={renderItemColumn}
                            styles={{
                                root: {
                                    overflowY: 'auto',
                                    overflowX: 'hidden'
                                }
                            }}
                        />
                    </div>

                    <Dialog
                        hidden={!isConfirmDeleteDialogOpen}
                        onDismiss={() => setIsConfirmDeleteDialogOpen(false)}
                        dialogContentProps={confirmDeletionDialogProps}
                        modalProps={confirmDeletionModalProps}
                    >
                        <DialogFooter>
                            <DefaultButton
                                onClick={() =>
                                    setIsConfirmDeleteDialogOpen(false)
                                }
                                text={t('cancel')}
                            />
                            <PrimaryButton
                                onClick={() => {
                                    deleteScene.callAdapter({
                                        config: config,
                                        sceneId: selectedScene.id
                                    });
                                }}
                                text={t('delete')}
                            />
                        </DialogFooter>
                    </Dialog>
                </>
            ) : (
                <div className="cb-scene-list-empty">
                    <p>{t('scenes.noScenes')}</p>
                    <PrimaryButton
                        className="cb-scene-list-empty-button"
                        onClick={() => {
                            setIsSceneDialogOpen(true);
                        }}
                        disabled={errors[0]?.type ? true : false}
                        text={t('scenes.addScene')}
                    />
                </div>
            )}

            <SceneListDialog
                isOpen={isSceneDialogOpen}
                onClose={() => {
                    setIsSceneDialogOpen(false);
                    setSelectedScene(null);
                }}
                sceneToEdit={selectedScene}
                onEditScene={(updatedScene) => {
                    editScene.callAdapter({
                        config: config,
                        sceneId: updatedScene.id,
                        scene: updatedScene
                    });
                }}
                onAddScene={(newScene) => {
                    let newId = createGUID(false);
                    const existingIds = sceneList.map((s) => s.id);
                    while (existingIds.includes(newId)) {
                        newId = createGUID(false);
                    }
                    addScene.callAdapter({
                        config: config,
                        scene: { id: newId, ...newScene }
                    });
                }}
                renderBlobDropdown={renderBlobDropdown}
            ></SceneListDialog>
        </BaseComponent>
    );
};

const SceneListDialog = ({
    isOpen,
    onClose,
    sceneToEdit,
    onAddScene,
    onEditScene,
    renderBlobDropdown
}: {
    isOpen: any;
    onClose: any;
    sceneToEdit: IScene;
    onAddScene: any;
    onEditScene: any;
    renderBlobDropdown: (onChange?: (blobUrl: string) => void) => JSX.Element;
}) => {
    const [newSceneName, setNewSceneName] = useState('');
    const [newSceneBlobUrl, setNewSceneBlobUrl] = useState('');
    const [scene, setScene] = useState(sceneToEdit);
    const { t } = useTranslation();

    const isDialogOpenContent = {
        type: DialogType.normal,
        title: sceneToEdit
            ? t('scenes.editDialogTitle')
            : t('scenes.addDialogTitle'),
        closeButtonAriaLabel: t('close'),
        subText: sceneToEdit
            ? t('scenes.editDialogSubText')
            : t('scenes.addDialogSubText')
    };

    const isDialogOpenStyles = {
        main: {
            minWidth: '540px !important',
            minHeight: '350px'
        }
    };

    const isDialogOpenProps = React.useMemo(
        () => ({
            isBlocking: true,
            styles: isDialogOpenStyles,
            className: 'cb-scene-list-dialog-wrapper'
        }),
        []
    );

    useEffect(() => {
        setScene(sceneToEdit);
    }, [sceneToEdit]);

    useEffect(() => {
        if (isOpen) {
            setNewSceneName('');
            setNewSceneBlobUrl('');
        }
    }, [isOpen]);

    const handleBlobUrlChange = (blobUrl: string) => {
        if (sceneToEdit) {
            const selectedSceneCopy = Object.assign({}, scene);
            selectedSceneCopy.assets[0].url = blobUrl;
            setScene(selectedSceneCopy);
        } else {
            setNewSceneBlobUrl(blobUrl);
        }
    };

    return (
        <Dialog
            hidden={!isOpen}
            onDismiss={() => onClose()}
            dialogContentProps={isDialogOpenContent}
            modalProps={isDialogOpenProps}
        >
            <TextField
                className="cb-scene-list-form-dialog-text-field"
                label={t('name')}
                title={newSceneName}
                value={sceneToEdit ? scene?.displayName : newSceneName}
                onChange={(e) => {
                    if (sceneToEdit) {
                        const selectedSceneCopy: IScene = Object.assign(
                            {},
                            sceneToEdit
                        );
                        selectedSceneCopy.displayName = e.currentTarget.value;
                        setScene(selectedSceneCopy);
                    } else {
                        setNewSceneName(e.currentTarget.value);
                    }
                }}
            />
            {renderBlobDropdown(handleBlobUrlChange)}
            <DialogFooter>
                <DefaultButton
                    className="cb-scene-list-modal-buttons"
                    onClick={() => onClose()}
                    text={t('cancel')}
                />
                <PrimaryButton
                    className="cb-scene-list-dialog-buttons"
                    onClick={() => {
                        if (sceneToEdit) {
                            onEditScene(scene);
                        } else {
                            const newScene = {
                                displayName: newSceneName,
                                type: 'Scene',
                                assets: [
                                    {
                                        type: 'Asset3D',
                                        name: 'Asset',
                                        url: newSceneBlobUrl
                                    }
                                ],
                                behaviors: []
                            };
                            onAddScene(newScene);
                        }
                    }}
                    text={sceneToEdit ? t('update') : t('create')}
                />
            </DialogFooter>
        </Dialog>
    );
};

export default withErrorBoundary(memo(SceneList));
