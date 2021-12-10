import React, { memo, useEffect, useState } from 'react';
import {
    ADTPatch,
    IADTScene,
    IADTSceneList
} from '../../../Models/Constants/Interfaces';
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

const SceneBlobUrl =
    'https://cardboardresources.blob.core.windows.net/3dv-workspace-1/vconfig-MattRework.json';

const SceneListCard: React.FC<SceneListCardProps> = ({
    adapter,
    title,
    theme,
    locale,
    localeStrings,
    onSceneClick
}) => {
    const scenes = useAdapter({
        adapterMethod: () =>
            adapter.getScenesConfig({
                url: SceneBlobUrl
            }),
        refetchDependencies: [adapter]
    });

    const addScene = useAdapter({
        adapterMethod: (scenes: Array<IADTScene>) => adapter.setScene(scenes),
        refetchDependencies: [adapter],
        isAdapterCalledOnMount: false
    });

    //TODO: finish reworking create/update/delete to work with blob adapter
    const editScene = useAdapter({
        adapterMethod: (patches: Array<ADTPatch>) =>
            adapter.updateScene(selectedScene.id, patches),
        refetchDependencies: [adapter],
        isAdapterCalledOnMount: false
    });

    const deleteScene = useAdapter({
        adapterMethod: () => adapter.deleteScene(selectedScene.id),
        refetchDependencies: [adapter],
        isAdapterCalledOnMount: false
    });

    const [sceneList, setSceneList] = useState<Array<IADTSceneList>>([]);
    const [selectedScene, setSelectedScene] = useState<IADTScene>(undefined);
    const [isSceneDialogOpen, setIsSceneDialogOpen] = useState(false);
    const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] = useState(
        false
    );

    useEffect(() => {
        if (!scenes.adapterResult.hasNoData()) {
            setSceneList(
                scenes.adapterResult.getData().value?.sort((a, b) =>
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
                adapterResults={[scenes.adapterResult]}
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
                                        key: 'scene-name',
                                        name: t('scenes.sceneName'),
                                        minWidth: 100,
                                        isResizable: true,
                                        onRender: (item) => (
                                            <span>
                                                {item.name?.en ?? item.name}
                                            </span>
                                        )
                                    },
                                    {
                                        key: 'scene-url',
                                        name: t('url'),
                                        minWidth: 350,
                                        maxWidth: 450,
                                        isResizable: true,
                                        onRender: (item) => (
                                            <span>{item.assets[0]['url']}</span>
                                        )
                                    },
                                    {
                                        key: 'scene-latitude',
                                        name: t('scenes.sceneLatitude'),
                                        minWidth: 100,
                                        onRender: (item) => item['latitude']
                                    },
                                    {
                                        key: 'scene-longitude',
                                        name: t('scenes.sceneLongitude'),
                                        minWidth: 100,
                                        onRender: (item) => item['longitude']
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
                                        deleteScene.callAdapter([
                                            selectedScene.id
                                        ]);
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
                    onEditScene={(updateBlobPatch) => {
                        editScene.callAdapter(updateBlobPatch);
                    }}
                    onAddScene={(newScene) => {
                        addScene.callAdapter(newScene);
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
    sceneToEdit: any;
    setSceneToEdit: any;
    onAddScene: any;
    onEditScene: any;
}) => {
    const [newSceneId, setNewSceneId] = useState('');
    const [newSceneBlobUrl, setNewSceneBlobUrl] = useState('');
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
            setNewSceneId('');
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
                title={newSceneId}
                value={sceneToEdit ? sceneToEdit?.id : newSceneId}
                onChange={(e) => {
                    if (sceneToEdit) {
                        const selectedSceneCopy = Object.assign(
                            {},
                            sceneToEdit
                        );
                        selectedSceneCopy.id = e.currentTarget.value;
                        setSceneToEdit(selectedSceneCopy);
                    } else {
                        setNewSceneId(e.currentTarget.value);
                    }
                }}
                disabled={sceneToEdit ? true : false}
            />
            <TextField
                label={t('scenes.blobUrl')}
                title={newSceneBlobUrl}
                value={
                    sceneToEdit
                        ? sceneToEdit?.['assets']['url']
                        : newSceneBlobUrl
                }
                onChange={(e) => {
                    if (sceneToEdit) {
                        const selectedSceneCopy = Object.assign(
                            {},
                            sceneToEdit
                        );
                        selectedSceneCopy['assets']['url'] =
                            e.currentTarget.value;
                        setSceneToEdit(selectedSceneCopy);
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
                            const updateBlobPatch: ADTPatch = {
                                op: 'replace',
                                path: '/assets',
                                value: sceneToEdit['assets']['url']
                            };
                            onEditScene([updateBlobPatch]);
                        } else {
                            const newScene: IADTScene = {
                                name: newSceneId,
                                id: 'Id',
                                assets: [
                                    {
                                        url: newSceneBlobUrl
                                    }
                                ]
                            };
                            onAddScene([newScene]);
                        }
                    }}
                    text={sceneToEdit ? t('update') : t('connect')}
                />
            </DialogFooter>
        </Dialog>
    );
};

export default withErrorBoundary(memo(SceneListCard));
