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
    IDetailsListProps,
    DetailsRow,
    IButtonProps,
    IModalStyles,
    IButtonStyles
} from '@fluentui/react';
import { withErrorBoundary } from '../../Models/Context/ErrorBoundary';
import { createGUID } from '../../Models/Services/Utils';
import ViewerConfigUtility from '../../Models/Classes/ViewerConfigUtility';
import {
    IStorageBlob,
    IComponentError
} from '../../Models/Constants/Interfaces';
import {
    ComponentErrorType,
    Supported3DFileTypes
} from '../../Models/Constants/Enums';
import BaseComponent from '../../Components/BaseComponent/BaseComponent';
import BlobDropdown from '../BlobDropdown/BlobDropdown';
import SceneDialog from './Internal/SceneDialog';
import {
    I3DScenesConfig,
    IAsset,
    IScene
} from '../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import IllustrationMessage from '../IllustrationMessage/IllustrationMessage';
import NoResults from '../../Resources/Static/noResults.svg';
import useTelemetry from '../../Models/Hooks/useTelemetry';
import {
    AppRegion,
    ComponentName,
    TelemetryEvents,
    TelemetryTrigger
} from '../../Models/Constants/TelemetryConstants';

const ROW_BUTTON_STYLES: IButtonStyles = {
    root: {
        alignItems: 'start',
        border: 0,
        height: 'auto',
        padding: 0,
        width: '100%'
    },
    flexContainer: {
        justifyContent: 'start'
    }
};

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
    const { sendEventTelemetry } = useTelemetry();

    const addScene = useAdapter({
        adapterMethod: (params: { config: I3DScenesConfig; scene: IScene }) =>
            adapter.putScenesConfig(
                ViewerConfigUtility.addScene(params.config, params.scene)
            ),
        refetchDependencies: [adapter],
        isAdapterCalledOnMount: false
    });

    const editScene = useAdapter({
        adapterMethod: (params: {
            config: I3DScenesConfig;
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
        adapterMethod: (params: { config: I3DScenesConfig; sceneId: string }) =>
            adapter.putScenesConfig(
                ViewerConfigUtility.deleteScene(params.config, params.sceneId)
            ),
        refetchDependencies: [adapter],
        isAdapterCalledOnMount: false
    });

    const [errors, setErrors] = useState<Array<IComponentError>>([]);
    const [config, setConfig] = useState<I3DScenesConfig>(null);
    const [sceneList, setSceneList] = useState<Array<IScene>>([]);
    const [selectedScene, setSelectedScene] = useState<IScene>(undefined);
    const [isSceneDialogOpen, setIsSceneDialogOpen] = useState(false);
    const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] = useState(
        false
    );

    useEffect(() => {
        if (!scenesConfig.adapterResult.hasNoData()) {
            const config: I3DScenesConfig = scenesConfig.adapterResult.getData();
            setConfig(config);
            setSceneList(() => {
                let scenes;
                try {
                    scenes = config?.configuration?.scenes?.sort(
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
                    scenes = config?.configuration?.scenes;
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

    const confirmDeletionDialogStyles: Partial<IModalStyles> = {
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

    const renderListRow: IDetailsListProps['onRenderRow'] = (props) => {
        const clickHandler = () => {
            if (typeof onSceneClick === 'function') {
                const telemetryEvent =
                    TelemetryEvents.Builder.SceneList.UserAction.SelectScene;
                sendEventTelemetry({
                    name: telemetryEvent.eventName,
                    appRegion: AppRegion.SceneLobby,
                    componentName: ComponentName.SceneList,
                    triggerType: TelemetryTrigger.UserAction
                });
                onSceneClick(props.item);
            }
        };
        return (
            <DefaultButton
                onClick={clickHandler}
                onKeyPress={(event) => {
                    if (event.code === 'Enter' || event.code === 'Space') {
                        clickHandler();
                    }
                }}
                styles={ROW_BUTTON_STYLES}
            >
                <DetailsRow className={'cb-scene-list-row'} {...props} />
            </DefaultButton>
        );
    };

    const renderItemColumn: IDetailsListProps['onRenderItemColumn'] = (
        item: any,
        itemIndex: number,
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
                                const telemetryEvent =
                                    TelemetryEvents.Builder.SceneList.UserAction
                                        .EditScene.Initiate;
                                sendEventTelemetry({
                                    name: telemetryEvent.eventName,
                                    customProperties: {
                                        [telemetryEvent.properties
                                            .itemIndex]: itemIndex
                                    },
                                    appRegion: AppRegion.SceneLobby,
                                    componentName: ComponentName.SceneList,
                                    triggerType: TelemetryTrigger.UserAction
                                });
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
                                const telemetryEvent =
                                    TelemetryEvents.Builder.SceneList.UserAction
                                        .DeleteScene.Initiate;
                                sendEventTelemetry({
                                    name: telemetryEvent.eventName,
                                    customProperties: {
                                        [telemetryEvent.properties
                                            .itemIndex]: itemIndex
                                    },
                                    appRegion: AppRegion.SceneLobby,
                                    componentName: ComponentName.SceneList,
                                    triggerType: TelemetryTrigger.UserAction
                                });
                            }}
                            className={'cb-scenes-action-button'}
                        />
                    </>
                );
            default:
                return <span>{fieldContent}</span>;
        }
    };
    const columns: IColumn[] = [
        {
            key: 'scene-name',
            name: t('name'),
            minWidth: 100,
            isResizable: true,
            onRender: (item: IScene) => <span>{item.displayName}</span>
        },
        {
            key: 'scene-description',
            name: t('scenes.description'),
            minWidth: 280,
            isResizable: true,
            onRender: (item: IScene) => <span>{item.description}</span>
        },
        {
            key: 'scene-urls',
            name: t('scenes.blobUrl'),
            minWidth: 280,
            isResizable: true,
            onRender: (item: IScene) => (
                <ul className="cb-scene-list-blob-urls">
                    {item.assets.map((a: IAsset, idx) => {
                        return (
                            <li key={`blob-url-${idx}`} title={a.url}>
                                {a.url}
                            </li>
                        );
                    })}
                </ul>
            )
        },
        {
            key: 'scene-action',
            name: t('actions'),
            fieldName: 'action',
            minWidth: 100
        }
    ];

    const getColumns = React.useMemo(() => {
        if (ViewerConfigUtility.hasGlobeCoordinates(sceneList)) {
            columns.splice(
                3,
                0,
                {
                    key: 'scene-latitude',
                    name: t('scenes.latitude'),
                    minWidth: 100,
                    onRender: (item: IScene) => item.latitude
                },
                {
                    key: 'scene-longitude',
                    name: t('scenes.longitude'),
                    minWidth: 100,
                    onRender: (item: IScene) => item.longitude
                }
            );
        }
        return columns;
    }, [sceneList]);
    const renderBlobDropdown = useCallback(
        (
            onChange?: (blobUrl: string) => void,
            onLoad?: (blobs: Array<IStorageBlob>) => void
        ) => {
            return (
                <BlobDropdown
                    adapter={adapter}
                    theme={theme}
                    locale={locale}
                    localeStrings={localeStrings}
                    fileTypes={Object.values(Supported3DFileTypes)}
                    selectedBlobUrl={
                        (selectedScene?.assets?.[0] as IAsset)?.url
                    }
                    hasLabel={false}
                    onChange={onChange}
                    onLoad={onLoad}
                    width={592}
                    isRequired
                />
            );
        },
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
                                const telemetryEvent =
                                    TelemetryEvents.Builder.SceneList.UserAction
                                        .CreateScene.Initiate;
                                sendEventTelemetry({
                                    name: telemetryEvent.eventName,
                                    appRegion: AppRegion.SceneLobby,
                                    componentName: ComponentName.SceneList,
                                    triggerType: TelemetryTrigger.UserAction
                                });
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
                            columns={getColumns}
                            setKey="set"
                            layoutMode={DetailsListLayoutMode.justified}
                            onRenderRow={renderListRow}
                            onRenderItemColumn={renderItemColumn}
                            styles={{
                                root: {
                                    overflowY: 'auto',
                                    overflowX: 'hidden',
                                    '.ms-DetailsHeader': {
                                        paddingTop: 4
                                    }
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
                                onClick={() => {
                                    const telemetryEvent =
                                        TelemetryEvents.Builder.SceneList
                                            .UserAction.DeleteScene.Cancel;
                                    sendEventTelemetry({
                                        name: telemetryEvent.eventName,
                                        appRegion: AppRegion.SceneLobby,
                                        componentName: ComponentName.SceneList,
                                        triggerType: TelemetryTrigger.UserAction
                                    });
                                    setIsConfirmDeleteDialogOpen(false);
                                }}
                                text={t('cancel')}
                            />
                            <PrimaryButton
                                onClick={() => {
                                    const telemetryEvent =
                                        TelemetryEvents.Builder.SceneList
                                            .UserAction.DeleteScene.Confirm;
                                    sendEventTelemetry({
                                        name: telemetryEvent.eventName,
                                        appRegion: AppRegion.SceneLobby,
                                        componentName: ComponentName.SceneList,
                                        triggerType: TelemetryTrigger.UserAction
                                    });
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
                    <IllustrationMessage
                        headerText={t('scenes.noScenes')}
                        type={'error'}
                        width={'wide'}
                        buttonProps={{
                            text: t('scenes.addScene'),
                            onClick: () => {
                                setIsSceneDialogOpen(true);
                            },
                            disabled: errors[0]?.type ? true : false
                        }}
                        imageProps={{
                            src: NoResults,
                            height: 200
                        }}
                        styles={{
                            container: {
                                padding: 0
                            }
                        }}
                    />
                </div>
            )}
            {isSceneDialogOpen && (
                <SceneDialog
                    adapter={adapter}
                    isOpen={isSceneDialogOpen}
                    onClose={() => {
                        setIsSceneDialogOpen(false);
                        setSelectedScene(null);
                        addScene.cancelAdapter();
                        editScene.cancelAdapter();
                    }}
                    sceneToEdit={selectedScene}
                    onEditScene={(updatedScene) => {
                        const telemetryEvent =
                            TelemetryEvents.Builder.SceneList.UserAction
                                .EditScene.Confirm;
                        sendEventTelemetry({
                            name: telemetryEvent.eventName,
                            appRegion: AppRegion.SceneLobby,
                            componentName: ComponentName.SceneList,
                            triggerType: TelemetryTrigger.UserAction
                        });
                        editScene.callAdapter({
                            config: config,
                            sceneId: updatedScene.id,
                            scene: updatedScene
                        });
                    }}
                    onAddScene={(newScene) => {
                        const telemetryEvent =
                            TelemetryEvents.Builder.SceneList.UserAction
                                .CreateScene.Confirm;
                        sendEventTelemetry({
                            name: telemetryEvent.eventName,
                            appRegion: AppRegion.SceneLobby,
                            componentName: ComponentName.SceneList,
                            triggerType: TelemetryTrigger.UserAction
                        });
                        let newId = createGUID();
                        const existingIds = sceneList.map((s) => s.id);
                        while (existingIds.includes(newId)) {
                            newId = createGUID();
                        }
                        addScene.callAdapter({
                            config: config,
                            scene: { ...newScene, id: newId }
                        });
                    }}
                    renderBlobDropdown={renderBlobDropdown}
                />
            )}
        </BaseComponent>
    );
};

export default withErrorBoundary(memo(SceneList));
