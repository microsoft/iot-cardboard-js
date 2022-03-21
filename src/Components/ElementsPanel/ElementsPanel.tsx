import React, { memo, useEffect, useMemo, useState } from 'react';
import { IADT3DViewerAdapter } from '../../Models/Constants/Interfaces';
import BaseComponent from '../BaseComponent/BaseComponent';
import {
    I3DScenesConfig,
    ITwinToObjectMapping,
    IVisual
} from '../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import useAdapter from '../../Models/Hooks/useAdapter';
import {
    ColoredMeshItem,
    SceneVisual
} from '../../Models/Classes/SceneView.types';
import { VisualType } from '../../Models/Classes/3DVConfig';
import { parseExpression } from '../../Models/Services/Utils';
import ViewerConfigUtility from '../../Models/Classes/ViewerConfigUtility';
import ElementList, { ElementsPanelItem } from './Internal/ElementList';
import { Locale, Theme } from '../../Models/Constants/Enums';
import {
    ContextualMenu,
    Dialog,
    DialogType,
    Icon,
    IDialogContentProps,
    IModalProps,
    IModalStyles,
    Spinner,
    SpinnerSize
} from '@fluentui/react';
import { useTranslation } from 'react-i18next';

interface ElementsPanelProps {
    adapter: IADT3DViewerAdapter;
    theme?: Theme;
    locale?: Locale;
    localeStrings?: Record<string, any>;
    sceneId: string;
    sceneConfig: I3DScenesConfig;
    pollingInterval: number;
    onItemClick: (
        item: ITwinToObjectMapping | IVisual,
        meshIds: Array<string>
    ) => void;
    onItemHover: (item: ITwinToObjectMapping | IVisual) => void;
}

const ElementsPanel: React.FC<ElementsPanelProps> = ({
    adapter,
    theme,
    locale,
    localeStrings,
    sceneId,
    sceneConfig,
    pollingInterval,
    onItemClick,
    onItemHover
}) => {
    const { t } = useTranslation();

    const { sceneVisuals, isLoading } = use3DViewerRuntime(
        adapter,
        sceneId,
        sceneConfig,
        pollingInterval
    );

    const panelItems: Array<ElementsPanelItem> = useMemo(
        () =>
            sceneVisuals.map((sceneVisual) => ({
                element: sceneVisual.element,
                visuals: sceneVisual.visuals,
                twins: sceneVisual.twins,
                meshIds: sceneVisual.meshIds
            })),
        [sceneVisuals]
    );

    const dialogContentProps: IDialogContentProps = useMemo(
        () => ({
            type: DialogType.normal,
            title: (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Icon iconName="Ringer" style={{ paddingRight: 8 }} />
                    <span style={{ flexGrow: 1 }}>
                        {t('elementsPanel.elementAlerts')}
                    </span>
                    {isLoading && <Spinner size={SpinnerSize.xSmall} />}
                </div>
            )
        }),
        [isLoading]
    );

    const modalStyles: Partial<IModalStyles> = {
        root: {
            width: 'unset',
            justifyContent: 'start',
            left: 20,
            '.ms-Dialog-title': { padding: '16px 24px 20px 24px' }
        },
        main: {
            maxWidth: '400px !important'
            // background: 'var(--cb-color-overlay-panel-bg)'
        },
        scrollableContent: {
            width: '100%',
            height: '100%',
            '.ms-Dialog-inner': { padding: '0px 0px 24px' }
        }
    };

    const modalProps: IModalProps = {
        styles: modalStyles,
        isModeless: true,
        dragOptions: {
            moveMenuItemText: 'Move',
            closeMenuItemText: 'Close',
            menu: ContextualMenu
        }
    };

    return (
        <BaseComponent
            theme={theme}
            locale={locale}
            localeStrings={localeStrings}
        >
            <Dialog
                dialogContentProps={dialogContentProps}
                modalProps={modalProps}
                hidden={false}
                onDismiss={() => {
                    console.log('clicked outside');
                }}
            >
                <ElementList
                    panelItems={panelItems}
                    onItemClick={onItemClick}
                    onItemHover={onItemHover}
                />
            </Dialog>
        </BaseComponent>
    );
};

export const use3DViewerRuntime = (
    adapter: IADT3DViewerAdapter,
    sceneId: string,
    sceneConfig: I3DScenesConfig,
    pollingInterval: number
) => {
    const [modelUrl, setModelUrl] = useState('');
    const [sceneVisuals, setSceneVisuals] = useState<Array<SceneVisual>>([]);

    const sceneViewerData = useAdapter({
        adapterMethod: () => adapter.getSceneData(sceneId, sceneConfig),
        refetchDependencies: [sceneId, sceneConfig],
        isLongPolling: true,
        pollingIntervalMillis: pollingInterval
    });

    useEffect(() => {
        if (sceneViewerData?.adapterResult?.result?.data) {
            const sceneVisuals = [
                ...sceneViewerData.adapterResult.result.data.sceneVisuals
            ];

            sceneVisuals.forEach((sceneVisual) => {
                const coloredMeshItems: Array<ColoredMeshItem> = [];
                sceneVisual.visuals?.map((visual) => {
                    switch (visual.type) {
                        case VisualType.StatusColoring: {
                            const value = parseExpression(
                                visual.statusValueExpression,
                                sceneVisual.twins
                            );
                            const color = ViewerConfigUtility.getColorOrNullFromStatusValueRange(
                                visual.statusValueRanges,
                                value
                            );
                            if (color) {
                                sceneVisual.meshIds?.map((meshId) => {
                                    const coloredMesh: ColoredMeshItem = {
                                        meshId: meshId,
                                        color: color
                                    };
                                    if (
                                        !coloredMeshItems.find(
                                            (item) =>
                                                item.meshId ===
                                                coloredMesh.meshId
                                        )
                                    ) {
                                        coloredMeshItems.push(coloredMesh);
                                    }
                                });
                            }
                            break;
                        }
                        case VisualType.Alert: {
                            if (
                                parseExpression(
                                    visual.triggerExpression,
                                    sceneVisual.twins
                                )
                            ) {
                                const color = visual.color;

                                sceneVisual.meshIds?.map((meshId) => {
                                    const coloredMesh: ColoredMeshItem = {
                                        meshId: meshId,
                                        color: color
                                    };
                                    if (
                                        !coloredMeshItems.find(
                                            (item) =>
                                                item.meshId ===
                                                coloredMesh.meshId
                                        )
                                    ) {
                                        coloredMeshItems.push(coloredMesh);
                                    }
                                });
                            }
                            break;
                        }
                    }
                });
                sceneVisual.coloredMeshItems = coloredMeshItems;
            });

            setModelUrl(sceneViewerData.adapterResult.result.data.modelUrl);
            setSceneVisuals(sceneVisuals);
        }
    }, [sceneViewerData.adapterResult.result]);

    return { modelUrl, sceneVisuals, isLoading: sceneViewerData.isLoading };
};

export default memo(ElementsPanel);
