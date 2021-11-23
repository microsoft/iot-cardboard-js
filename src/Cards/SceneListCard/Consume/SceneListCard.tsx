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
import { FormMode } from '../../../Models/Constants/Enums';
import { Text } from '@fluentui/react/lib/Text';
import { withErrorBoundary } from '../../../Models/Context/ErrorBoundary';

const editIcon: IIconProps = { iconName: 'Edit' };
const deleteIcon: IIconProps = { iconName: 'Delete' };

const SceneListCard: React.FC<SceneListCardProps> = ({
    adapter,
    title,
    theme,
    locale,
    localeStrings,
    formControlMode = FormMode.Edit
}) => {
    const scenes = useAdapter({
        adapterMethod: () =>
            adapter.getADTTwinsByModelId({
                modelId: 'dtmi:com:visualontology:scene;1'
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
    const [twinToEdit, setTwinToEdit] = useState<DTwin>(undefined);
    const [newTwinId, setNewTwinId] = useState('');
    const [newTwinBlobUrl, setNewTwinBlobUrl] = useState('');

    const [addNewSceneDialogOpen, setAddNewSceneDialogOpen] = useState(false);
    const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] = useState(
        false
    );
    const [updateSceneDialogOpen, setUpdateSceneDialogOpen] = useState(false);

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
                setAddNewSceneDialogOpen(false);
            }, 3000);
        } else {
            setSceneList([]);
        }
    }, [addScene?.adapterResult]);

    useEffect(() => {
        if (editScene.adapterResult.result) {
            setTimeout(() => {
                scenes.callAdapter();
                setUpdateSceneDialogOpen(false);
            }, 3000);
        } else {
            setSceneList([]);
        }
    }, [editScene?.adapterResult]);

    useEffect(() => {
        if (deleteScene.adapterResult.result) {
            setTimeout(() => {
                scenes.callAdapter();
                setIsConfirmDeleteDialogOpen(false);
            }, 3000);
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

    const isAddNewSceneDialogOpenContent = {
        type: DialogType.normal,
        title: t('scenes.addDialogTitle'),
        closeButtonAriaLabel: t('close'),
        subText: t('scenes.addDialogSubText')
    };

    const isAddNewSceneDialogOpenStyle = {
        main: { maxWidth: 450, minHeight: 165 }
    };

    const isAddNewSceneDialogOpenProps = React.useMemo(
        () => ({
            isBlocking: false,
            styles: isAddNewSceneDialogOpenStyle,
            className: 'cb-scenes-list-dialog-wrapper'
        }),
        []
    );

    const editSceneDialogOpenContent = {
        type: DialogType.normal,
        title: t('scenes.editDialogTitle'),
        closeButtonAriaLabel: t('close'),
        subText: t('scenes.editDialogSubText')
    };

    const editSceneDialogOpenStyle = {
        main: { maxWidth: 450, minHeight: 165 }
    };

    const editSceneDialogOpenProps = React.useMemo(
        () => ({
            isBlocking: false,
            styles: editSceneDialogOpenStyle,
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
                                setTwinToEdit(item);
                                setUpdateSceneDialogOpen(true);
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
                                    setAddNewSceneDialogOpen(true);
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

                        <Dialog
                            hidden={!updateSceneDialogOpen}
                            onDismiss={() => setUpdateSceneDialogOpen(false)}
                            dialogContentProps={editSceneDialogOpenContent}
                            modalProps={editSceneDialogOpenProps}
                        >
                            <TextField
                                label={t('scenes.sceneName')}
                                title={newTwinId}
                                value={
                                    formControlMode === FormMode.Readonly &&
                                    (selectedTwin
                                        ? twinToEdit?.$dtId
                                        : newTwinId)
                                        ? '(' + t('noInformation') + ')'
                                        : selectedTwin
                                        ? twinToEdit?.$dtId
                                        : newTwinId
                                }
                                className={`${
                                    formControlMode === FormMode.Readonly
                                        ? 'cb-modelcreate-readonly'
                                        : ''
                                } ${
                                    formControlMode === FormMode.Readonly &&
                                    (selectedTwin
                                        ? twinToEdit?.$dtId
                                        : newTwinId)
                                        ? 'cb-noinformation-value'
                                        : ''
                                }`}
                                onChange={(e) => {
                                    if (selectedTwin) {
                                        const selectedTwinCopy = Object.assign(
                                            {},
                                            twinToEdit
                                        );
                                        selectedTwinCopy.$dtId =
                                            e.currentTarget.value;
                                        setTwinToEdit(selectedTwinCopy);
                                    } else {
                                        setNewTwinId(e.currentTarget.value);
                                    }
                                }}
                                disabled
                            />
                            <TextField
                                label={t('scenes.blobUrl')}
                                title={newTwinBlobUrl}
                                value={
                                    formControlMode === FormMode.Readonly &&
                                    (selectedTwin
                                        ? twinToEdit?.['assetFile']
                                        : newTwinBlobUrl)
                                        ? '(' + t('noInformation') + ')'
                                        : selectedTwin
                                        ? twinToEdit?.['assetFile']
                                        : newTwinBlobUrl
                                }
                                className={`${
                                    formControlMode === FormMode.Readonly
                                        ? 'cb-modelcreate-readonly'
                                        : ''
                                } ${
                                    formControlMode === FormMode.Readonly &&
                                    (selectedTwin
                                        ? twinToEdit?.['assetFile']
                                        : newTwinBlobUrl)
                                        ? 'cb-noinformation-value'
                                        : ''
                                }`}
                                onChange={(e) => {
                                    if (selectedTwin) {
                                        const selectedTwinCopy = Object.assign(
                                            {},
                                            twinToEdit
                                        );
                                        selectedTwinCopy['assetFile'] =
                                            e.currentTarget.value;
                                        setTwinToEdit(selectedTwinCopy);
                                    } else {
                                        setNewTwinBlobUrl(
                                            e.currentTarget.value
                                        );
                                    }
                                }}
                                disabled={formControlMode === FormMode.Readonly}
                            />
                            <DialogFooter>
                                <PrimaryButton
                                    onClick={() => {
                                        if (selectedTwin) {
                                            const updateBlobPatch: ADTPatch = {
                                                op: 'replace',
                                                path: '/assetFile',
                                                value: twinToEdit['assetFile']
                                            };
                                            editScene.callAdapter([
                                                updateBlobPatch
                                            ]);
                                        } else {
                                            const newTwin: DTwin = {
                                                $dtId: newTwinId,
                                                $metadata: {
                                                    $model:
                                                        'dtmi:com:visualontology:scene;1'
                                                },
                                                assetFile: newTwinBlobUrl
                                            };
                                            addScene.callAdapter([newTwin]);
                                        }
                                    }}
                                    text={t('update')}
                                />
                                <DefaultButton
                                    onClick={() =>
                                        setUpdateSceneDialogOpen(false)
                                    }
                                    text={t('cancel')}
                                />
                            </DialogFooter>
                        </Dialog>

                        <Dialog
                            hidden={!addNewSceneDialogOpen}
                            onDismiss={() => setAddNewSceneDialogOpen(false)}
                            dialogContentProps={isAddNewSceneDialogOpenContent}
                            modalProps={isAddNewSceneDialogOpenProps}
                        >
                            <TextField
                                label={t('scenes.sceneName')}
                                title={newTwinId}
                                value={
                                    formControlMode === FormMode.Readonly &&
                                    !newTwinId
                                        ? '(' + t('noInformation') + ')'
                                        : newTwinId
                                }
                                className={`${
                                    formControlMode === FormMode.Readonly
                                        ? 'cb-modelcreate-readonly'
                                        : ''
                                } ${
                                    formControlMode === FormMode.Readonly &&
                                    !newTwinId
                                        ? 'cb-noinformation-value'
                                        : ''
                                }`}
                                onChange={(e) =>
                                    setNewTwinId(e.currentTarget.value)
                                }
                                disabled={formControlMode === FormMode.Readonly}
                            />
                            <TextField
                                label={t('scenes.blobUrl')}
                                title={newTwinBlobUrl}
                                value={
                                    formControlMode === FormMode.Readonly &&
                                    !newTwinBlobUrl
                                        ? '(' + t('noInformation') + ')'
                                        : newTwinBlobUrl
                                }
                                className={`${
                                    formControlMode === FormMode.Readonly
                                        ? 'cb-modelcreate-readonly'
                                        : ''
                                } ${
                                    formControlMode === FormMode.Readonly &&
                                    !newTwinBlobUrl
                                        ? 'cb-noinformation-value'
                                        : ''
                                }`}
                                onChange={(e) =>
                                    setNewTwinBlobUrl(e.currentTarget.value)
                                }
                                disabled={formControlMode === FormMode.Readonly}
                            />
                            <DialogFooter>
                                <PrimaryButton
                                    onClick={() => {
                                        const newTwin: DTwin = {
                                            $dtId: newTwinId,
                                            $metadata: {
                                                $model:
                                                    'dtmi:com:visualontology:scene;1'
                                            },
                                            assetFile: newTwinBlobUrl
                                        };
                                        addScene.callAdapter([newTwin]);
                                    }}
                                    text={t('connect')}
                                />
                                <DefaultButton
                                    onClick={() =>
                                        setAddNewSceneDialogOpen(false)
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
                            onClick={() => {
                                setAddNewSceneDialogOpen(true);
                            }}
                        >
                            {t('scenes.addScene')}
                        </ActionButton>
                    </div>
                )}
            </BaseCompositeCard>
        </div>
    );
};

export default withErrorBoundary(memo(SceneListCard));
