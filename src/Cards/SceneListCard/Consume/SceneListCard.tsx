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
import { Text } from '@fluentui/react/lib/Text';
import { withErrorBoundary } from '../../../Models/Context/ErrorBoundary';
import { Asset, Scene } from '../../../Models/Classes/3DVConfig';
import { TaJson } from 'ta-json';

const SceneListCard: React.FC<SceneListCardProps> = ({
    adapter,
    title,
    theme,
    locale,
    localeStrings,
    onSceneClick
}) => {
    const scenes = useAdapter({
        adapterMethod: () => adapter.getScenes(),
        refetchDependencies: [adapter]
    });

    // TODO: implement other necessary methods for the adapter
    const addScene = useAdapter({
        adapterMethod: (params: { scene: Scene }) => adapter.getScenes(),
        refetchDependencies: [adapter],
        isAdapterCalledOnMount: false
    });

    // TODO: implement other necessary methods for the adapter
    const editScene = useAdapter({
        adapterMethod: (params: { sceneId: string; scene: Scene }) =>
            adapter.getScenes(),
        refetchDependencies: [adapter],
        isAdapterCalledOnMount: false
    });

    // TODO: implement other necessary methods for the adapter
    const deleteScene = useAdapter({
        adapterMethod: (params: { sceneId: string }) => adapter.getScenes(),
        refetchDependencies: [adapter],
        isAdapterCalledOnMount: false
    });

    const [sceneList, setSceneList] = useState<Array<Scene>>([]);
    const [selectedScene, setSelectedScene] = useState<Scene>(undefined);
    const [isSceneDialogOpen, setIsSceneDialogOpen] = useState(false);
    const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] = useState(
        false
    );

    useEffect(() => {
        if (!scenes.adapterResult.hasNoData()) {
            setSceneList(
                scenes.adapterResult.getData().sort((a: Scene, b: Scene) =>
                    a.name.localeCompare(b.name, undefined, {
                        sensitivity: 'base'
                    })
                )
            );
        } else {
            setSceneList([]);
        }
    }, [scenes?.adapterResult]);

    useEffect(() => {
        if (addScene.adapterResult.result) {
            setTimeout(() => {
                scenes.callAdapter();
                setIsSceneDialogOpen(false);
            }, 5000);
        } else {
            setSceneList([]);
        }
    }, [addScene?.adapterResult]);

    useEffect(() => {
        if (editScene.adapterResult.result) {
            setTimeout(() => {
                scenes.callAdapter();
                setIsSceneDialogOpen(false);
                setSelectedScene(null);
            }, 5000);
        } else {
            setSceneList([]);
        }
    }, [editScene?.adapterResult]);

    useEffect(() => {
        if (deleteScene.adapterResult.result) {
            setTimeout(() => {
                scenes.callAdapter();
                setIsConfirmDeleteDialogOpen(false);
                setSelectedScene(null);
            }, 5000);
        } else {
            setSceneList([]);
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
                isLoading={scenes.isLoading}
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
                                        key: 'scene-model',
                                        name: t('id'),
                                        minWidth: 100,
                                        maxWidth: 400,
                                        isResizable: true,
                                        onRender: (item: Scene) => (
                                            <span>{item.id}</span>
                                        )
                                    },
                                    {
                                        key: 'scene-name',
                                        name: t('scenes.sceneName'),
                                        minWidth: 100,
                                        onRender: (item: Scene) => (
                                            <span>{item.name}</span>
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
                        <Text>{t('scenes.noScenes')}</Text>
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
                    setSceneToEdit={setSelectedScene}
                    sceneToEdit={selectedScene}
                    onEditScene={(updatedScene) => {
                        editScene.callAdapter({
                            sceneId: updatedScene.id,
                            scene: updatedScene
                        });
                    }}
                    onAddScene={(newScene) => {
                        addScene.callAdapter({ scene: newScene });
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
    setSceneToEdit,
    onAddScene,
    onEditScene
}: {
    isOpen: any;
    onClose: any;
    sceneToEdit: Scene;
    setSceneToEdit: any;
    onAddScene: any;
    onEditScene: any;
}) => {
    const [newSceneId, setNewTwinId] = useState('');
    const [newTwinBlobUrl, setNewTwinBlobUrl] = useState('');
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
        if (isOpen) {
            setNewTwinId('');
            setNewTwinBlobUrl('');
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
                title={newSceneId}
                value={sceneToEdit ? sceneToEdit?.id : newSceneId}
                onChange={(e) => {
                    if (sceneToEdit) {
                        const selectedSceneCopy: Scene = Object.assign(
                            {},
                            sceneToEdit
                        );
                        selectedSceneCopy.name = e.currentTarget.value;
                        setSceneToEdit(selectedSceneCopy);
                    } else {
                        setNewTwinId(e.currentTarget.value);
                    }
                }}
                disabled={sceneToEdit ? true : false}
            />
            <TextField
                label={t('scenes.blobUrl')}
                title={newTwinBlobUrl}
                value={
                    sceneToEdit
                        ? JSON.stringify(
                              sceneToEdit?.assets.map((a: Asset) => a.url)
                          )
                        : newTwinBlobUrl
                }
                onChange={(e) => {
                    if (sceneToEdit) {
                        const selectedSceneCopy = Object.assign(
                            {},
                            sceneToEdit
                        );
                        selectedSceneCopy.assets[0].url = e.currentTarget.value;
                        setSceneToEdit(selectedSceneCopy);
                    } else {
                        setNewTwinBlobUrl(e.currentTarget.value);
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
                            const newScene = TaJson.parse<Scene>(
                                JSON.stringify(sceneToEdit),
                                Scene
                            );
                            onEditScene(newScene);
                        } else {
                            onAddScene();
                        }
                    }}
                    text={sceneToEdit ? t('update') : t('connect')}
                />
            </DialogFooter>
        </Dialog>
    );
};

export default withErrorBoundary(memo(SceneListCard));
