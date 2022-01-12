import React, { memo, useEffect, useState } from 'react';
import BaseCompositeCard from '../../CompositeCards/BaseCompositeCard/Consume/BaseCompositeCard';
import { SceneListCardProps } from './SceneListCard.types';
import './SceneListCard.scss';
import { useAdapter } from '../../../Models/Hooks';
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
    DetailsRow
} from '@fluentui/react';
import { withErrorBoundary } from '../../../Models/Context/ErrorBoundary';
import { Asset, ScenesConfig, Scene } from '../../../Models/Classes/3DVConfig';
import { TaJson } from 'ta-json';
import { Utils } from '../../../Models/Services';

const SceneListCard: React.FC<SceneListCardProps> = ({
    adapter,
    title,
    theme,
    locale,
    localeStrings,
    onSceneClick
}) => {
    const scenesConfig = useAdapter({
        adapterMethod: () => adapter.getScenesConfig(),
        refetchDependencies: [adapter]
    });

    // TODO: implement other necessary methods for the adapter
    const addScene = useAdapter({
        adapterMethod: (params: { config: ScenesConfig; scene: Scene }) =>
            adapter.addScene(params.config, params.scene),
        refetchDependencies: [adapter],
        isAdapterCalledOnMount: false
    });

    // TODO: implement other necessary methods for the adapter
    const editScene = useAdapter({
        adapterMethod: (params: {
            config: ScenesConfig;
            sceneId: string;
            scene: Scene;
        }) => adapter.editScene(params.config, params.sceneId, params.scene),
        refetchDependencies: [adapter],
        isAdapterCalledOnMount: false
    });

    // TODO: implement other necessary methods for the adapter
    const deleteScene = useAdapter({
        adapterMethod: (params: { config: ScenesConfig; sceneId: string }) =>
            adapter.deleteScene(params.config, params.sceneId),
        refetchDependencies: [adapter],
        isAdapterCalledOnMount: false
    });

    const [config, setConfig] = useState<ScenesConfig>(null);
    const [sceneList, setSceneList] = useState<Array<Scene>>([]);
    const [selectedScene, setSelectedScene] = useState<Scene>(undefined);
    const [isSceneDialogOpen, setIsSceneDialogOpen] = useState(false);
    const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] = useState(
        false
    );

    useEffect(() => {
        if (!scenesConfig.adapterResult.hasNoData()) {
            const config: ScenesConfig = scenesConfig.adapterResult.getData();
            setConfig(config);
            setSceneList(
                config.viewerConfiguration?.scenes?.sort((a: Scene, b: Scene) =>
                    a.displayName?.localeCompare(b.displayName, undefined, {
                        sensitivity: 'base'
                    })
                )
            );
        } else {
            setSceneList([]);
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

    return (
        <div className="cb-scene-list-card-wrapper">
            <BaseCompositeCard
                theme={theme}
                title={title}
                locale={locale}
                localeStrings={localeStrings}
                adapterResults={[scenesConfig.adapterResult]}
                isLoading={scenesConfig.isLoading}
            >
                {sceneList.length > 0 ? (
                    <>
                        <div className="cb-scene-list-action-buttons">
                            <ActionButton
                                iconProps={{ iconName: 'Add' }}
                                onClick={() => {
                                    setIsSceneDialogOpen(true);
                                }}
                            >
                                {t('addNew')}
                            </ActionButton>
                        </div>

                        <div className="cb-scenes-list">
                            <DetailsList
                                selectionMode={SelectionMode.none}
                                items={sceneList}
                                columns={[
                                    {
                                        key: 'scene-name',
                                        name: t('scenes.sceneName'),
                                        minWidth: 100,
                                        isResizable: true,
                                        onRender: (item: Scene) => (
                                            <span>{item.displayName}</span>
                                        )
                                    },
                                    {
                                        key: 'scene-urls',
                                        name: t('scenes.blobUrl'),
                                        minWidth: 300,
                                        isResizable: true,
                                        onRender: (item: Scene) => (
                                            <ul className="cb-scene-list-blob-urls">
                                                {item.assets.map(
                                                    (a: Asset, idx) => {
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
                                        onRender: (item: Scene) => item.latitude
                                    },
                                    {
                                        key: 'scene-longitude',
                                        name: t('scenes.sceneLongitude'),
                                        minWidth: 100,
                                        onRender: (item: Scene) =>
                                            item.longitude
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
                            />
                        </div>

                        <Dialog
                            hidden={!isConfirmDeleteDialogOpen}
                            onDismiss={() =>
                                setIsConfirmDeleteDialogOpen(false)
                            }
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
                        addScene.callAdapter({
                            config: config,
                            scene: newScene
                        });
                    }}
                ></SceneListDialog>
            </BaseCompositeCard>
        </div>
    );
};

const SceneListDialog = ({
    isOpen,
    onClose,
    sceneToEdit,
    onAddScene,
    onEditScene
}: {
    isOpen: any;
    onClose: any;
    sceneToEdit: Scene;
    onAddScene: any;
    onEditScene: any;
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
        main: { maxWidth: 450, minHeight: 165 }
    };

    const isDialogOpenProps = React.useMemo(
        () => ({
            isBlocking: false,
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

    return (
        <Dialog
            hidden={!isOpen}
            onDismiss={() => onClose()}
            dialogContentProps={isDialogOpenContent}
            modalProps={isDialogOpenProps}
        >
            <TextField
                label={t('scenes.sceneName')}
                title={newSceneName}
                value={sceneToEdit ? scene?.displayName : newSceneName}
                onChange={(e) => {
                    if (sceneToEdit) {
                        const selectedSceneCopy: Scene = Object.assign(
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
            <TextField
                multiline
                rows={3}
                label={t('scenes.blobUrl')}
                title={newSceneBlobUrl}
                value={
                    sceneToEdit
                        ? scene?.assets.map((a: Asset) => a.url).join('\n')
                        : newSceneBlobUrl
                }
                onChange={(e) => {
                    if (sceneToEdit) {
                        const selectedSceneCopy = Object.assign({}, scene);
                        const urls = e.currentTarget.value?.split('\n');
                        urls.map((url, idx) => {
                            selectedSceneCopy.assets[idx].url = url;
                        });
                        setScene(selectedSceneCopy);
                    } else {
                        setNewSceneBlobUrl(e.currentTarget.value);
                    }
                }}
            />
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
                            const updatedScene = TaJson.parse<Scene>(
                                JSON.stringify(scene),
                                Scene
                            );
                            onEditScene(updatedScene);
                        } else {
                            const newScene = TaJson.parse<Scene>(
                                JSON.stringify({
                                    id: Utils.createGUID(),
                                    displayName: newSceneName,
                                    type: 'Scene',
                                    assets: [
                                        {
                                            type: 'Asset3D',
                                            name: 'Asset',
                                            url: newSceneBlobUrl
                                        }
                                    ]
                                }),
                                Scene
                            );
                            onAddScene(newScene);
                        }
                    }}
                    text={sceneToEdit ? t('update') : t('connect')}
                />
            </DialogFooter>
        </Dialog>
    );
};

export default withErrorBoundary(memo(SceneListCard));
