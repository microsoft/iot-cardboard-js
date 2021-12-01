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
    IIconProps,
    Dialog,
    DialogFooter,
    PrimaryButton,
    DefaultButton,
    DialogType,
    TextField
} from '@fluentui/react';
import { Text } from '@fluentui/react/lib/Text';
import { withErrorBoundary } from '../../../Models/Context/ErrorBoundary';

const editIcon: IIconProps = { iconName: 'Edit' };
const deleteIcon: IIconProps = { iconName: 'Delete' };
const sceneTwinModelId = 'dtmi:com:visualontology:scenee;1';

const SceneListCard: React.FC<SceneListCardProps> = ({
    adapter,
    title,
    theme,
    locale,
    localeStrings
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
            setSceneList(scenes.adapterResult.getData().value);
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
            className: 'cb-scenes-list-dialog-wrapper'
        }),
        []
    );

    function renderItemColumn(item: any, itemIndex: number, column: IColumn) {
        const fieldContent = item[column.fieldName] as string;
        switch (column.key) {
            case 'scene-action':
                return (
                    <>
                        <IconButton
                            iconProps={editIcon}
                            title={t('edit')}
                            ariaLabel={t('edit')}
                            onClick={() => {
                                setSelectedTwin(item);
                                setIsSceneDialogOpen(true);
                            }}
                        />
                        <IconButton
                            iconProps={deleteIcon}
                            title={t('delete')}
                            ariaLabel={t('delete')}
                            onClick={() => {
                                setSelectedTwin(item);
                                setIsConfirmDeleteDialogOpen(true);
                            }}
                        />
                    </>
                );
            default:
                return <span>{fieldContent}</span>;
        }
    }

    return (
        <div className="cb-scenes-list-card-wrapper">
            <BaseCompositeCard
                theme={theme}
                title={title}
                locale={locale}
                localeStrings={localeStrings}
            >
                {sceneList.length > 0 ? (
                    <>
                        <div className="cb-scenes-list-action-buttons">
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
                                        onRender: (item) => (
                                            <span>
                                                {item.$dtId?.en ?? item.$dtId}
                                            </span>
                                        )
                                    },
                                    {
                                        key: 'scene-model',
                                        name: t('model'),
                                        minWidth: 100,
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
                                <PrimaryButton
                                    onClick={() => {
                                        deleteScene.callAdapter([
                                            selectedTwin.$dtId
                                        ]);
                                    }}
                                    text={t('delete')}
                                />
                                <DefaultButton
                                    onClick={() =>
                                        setIsConfirmDeleteDialogOpen(false)
                                    }
                                    text={t('cancel')}
                                />
                            </DialogFooter>
                        </Dialog>
                    </>
                ) : (
                    <div className="cb-scenes-list-empty">
                        <Text>{t('scenes.noScenes')}</Text>
                        <ActionButton
                            className="cb-scenes-list-empty-button"
                            onClick={() => {
                                setIsSceneDialogOpen(true);
                            }}
                        >
                            {t('scenes.addScene')}
                        </ActionButton>
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
            className: 'cb-scenes-list-dialog-wrapper'
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
                className={`${
                    (twinToEdit ? twinToEdit?.$dtId : !newTwinId)
                        ? 'cb-noinformation-value'
                        : ''
                }`}
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
                value={twinToEdit ? twinToEdit?.['assetFile'] : newTwinBlobUrl}
                className={`${
                    (twinToEdit ? twinToEdit?.['assetFile'] : !newTwinBlobUrl)
                        ? 'cb-noinformation-value'
                        : ''
                }`}
                onChange={(e) => {
                    if (twinToEdit) {
                        const selectedTwinCopy = Object.assign({}, twinToEdit);
                        selectedTwinCopy['assetFile'] = e.currentTarget.value;
                        setTwinToEdit(selectedTwinCopy);
                    } else {
                        setNewTwinBlobUrl(e.currentTarget.value);
                    }
                }}
            />
            <DialogFooter>
                <PrimaryButton
                    className="cb-scenes-list-dialog-buttons"
                    onClick={() => {
                        if (twinToEdit) {
                            const updateBlobPatch: ADTPatch = {
                                op: 'replace',
                                path: '/assetFile',
                                value: twinToEdit['assetFile']
                            };
                            onEditScene([updateBlobPatch]);
                        } else {
                            const newTwin: DTwin = {
                                $dtId: newTwinId,
                                $metadata: {
                                    $model: sceneTwinModelId
                                },
                                assetFile: newTwinBlobUrl
                            };
                            onAddScene([newTwin]);
                        }
                    }}
                    text={twinToEdit ? t('update') : t('connect')}
                />
                <DefaultButton
                    className="cb-scenes-list-modal-buttons"
                    onClick={() => onClose()}
                    text={t('cancel')}
                />
            </DialogFooter>
        </Dialog>
    );
};

export default withErrorBoundary(memo(SceneListCard));
