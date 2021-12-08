import React, { memo, useEffect, useState } from 'react';
import {
    ADTPatch,
    DTwin,
    IADTTwin
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

const sceneTwinModelId = 'dtmi:com:visualontology:scene;1';

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
            adapter.getADTTwinsByModelId({
                modelId: sceneTwinModelId
            }),
        refetchDependencies: [adapter]
    });

    const addScene = useAdapter({
        adapterMethod: (twins: Array<DTwin>) => adapter.createTwins(twins),
        refetchDependencies: [adapter],
        isAdapterCalledOnMount: false
    });

    const editScene = useAdapter({
        adapterMethod: (patches: Array<ADTPatch>) =>
            adapter.updateTwin(selectedTwin.$dtId, patches),
        refetchDependencies: [adapter],
        isAdapterCalledOnMount: false
    });

    const deleteScene = useAdapter({
        adapterMethod: () => adapter.deleteADTTwin(selectedTwin.$dtId),
        refetchDependencies: [adapter],
        isAdapterCalledOnMount: false
    });

    const [sceneList, setSceneList] = useState<Array<IADTTwin>>([]);
    const [selectedTwin, setSelectedTwin] = useState<DTwin>(undefined);
    const [isSceneDialogOpen, setIsSceneDialogOpen] = useState(false);
    const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] = useState(
        false
    );

    useEffect(() => {
        if (!scenes.adapterResult.hasNoData()) {
            setSceneList(
                scenes.adapterResult.getData().value?.sort((a, b) =>
                    a.$dtId.localeCompare(b.$dtId, undefined, {
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
                setSelectedTwin(null);
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
                setSelectedTwin(null);
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
                                setSelectedTwin(item);
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
                                setSelectedTwin(item);
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
                                                {item.$dtId?.en ?? item.$dtId}
                                            </span>
                                        )
                                    },
                                    {
                                        key: 'scene-model',
                                        name: t('model'),
                                        minWidth: 200,
                                        maxWidth: 400,
                                        onRender: (item) => (
                                            <span>
                                                {item.$metadata?.$model}
                                            </span>
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
                                            selectedTwin.$dtId
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
                        setSelectedTwin(null);
                    }}
                    setTwinToEdit={setSelectedTwin}
                    twinToEdit={selectedTwin}
                    onEditScene={(updateBlobPatch) => {
                        editScene.callAdapter(updateBlobPatch);
                    }}
                    onAddScene={(newTwin) => {
                        addScene.callAdapter(newTwin);
                    }}
                ></SceneListDialog>
            </BaseCompositeCard>
        </div>
    );
};

const SceneListDialog = ({
    isOpen,
    onClose,
    twinToEdit,
    setTwinToEdit,
    onAddScene,
    onEditScene
}: {
    isOpen: any;
    onClose: any;
    twinToEdit: any;
    setTwinToEdit: any;
    onAddScene: any;
    onEditScene: any;
}) => {
    const [newTwinId, setNewTwinId] = useState('');
    const [newTwinBlobUrl, setNewTwinBlobUrl] = useState('');
    const { t } = useTranslation();

    const isDialogOpenContent = {
        type: DialogType.normal,
        title: twinToEdit
            ? t('scenes.editDialogTitle')
            : t('scenes.addDialogTitle'),
        closeButtonAriaLabel: t('close'),
        subText: twinToEdit
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
                title={newTwinId}
                value={twinToEdit ? twinToEdit?.$dtId : newTwinId}
                onChange={(e) => {
                    if (twinToEdit) {
                        const selectedTwinCopy = Object.assign({}, twinToEdit);
                        selectedTwinCopy.$dtId = e.currentTarget.value;
                        setTwinToEdit(selectedTwinCopy);
                    } else {
                        setNewTwinId(e.currentTarget.value);
                    }
                }}
                disabled={twinToEdit ? true : false}
            />
            <TextField
                label={t('scenes.blobUrl')}
                title={newTwinBlobUrl}
                value={twinToEdit ? twinToEdit?.['MediaSrc'] : newTwinBlobUrl}
                onChange={(e) => {
                    if (twinToEdit) {
                        const selectedTwinCopy = Object.assign({}, twinToEdit);
                        selectedTwinCopy['MediaSrc'] = e.currentTarget.value;
                        setTwinToEdit(selectedTwinCopy);
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
                        if (twinToEdit) {
                            const updateBlobPatch: ADTPatch = {
                                op: 'replace',
                                path: '/MediaSrc',
                                value: twinToEdit['MediaSrc']
                            };
                            onEditScene([updateBlobPatch]);
                        } else {
                            const newTwin: DTwin = {
                                $dtId: newTwinId,
                                $metadata: {
                                    $model: sceneTwinModelId
                                },
                                MediaSrc: newTwinBlobUrl
                            };
                            onAddScene([newTwin]);
                        }
                    }}
                    text={twinToEdit ? t('update') : t('connect')}
                />
            </DialogFooter>
        </Dialog>
    );
};

export default withErrorBoundary(memo(SceneListCard));
