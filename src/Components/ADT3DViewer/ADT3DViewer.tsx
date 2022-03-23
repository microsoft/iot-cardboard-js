import React, { useEffect, useRef, useState } from 'react';
import {
    DTwin,
    IADT3DViewerProps,
    IADT3DViewerRenderMode
} from '../../Models/Constants/Interfaces';
import { useAdapter, useGuid } from '../../Models/Hooks';
import './ADT3DViewer.scss';
import { withErrorBoundary } from '../../Models/Context/ErrorBoundary';
import {
    CustomMeshItem,
    Marker,
    SceneVisual
} from '../../Models/Classes/SceneView.types';
import { VisualType } from '../../Models/Classes/3DVConfig';
import { parseExpression } from '../../Models/Services/Utils';
import BaseComponent from '../../Components/BaseComponent/BaseComponent';
import { SceneViewWrapper } from '../../Components/3DV/SceneViewWrapper';
import { Dropdown, IDropdownOption } from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import { RenderModes } from '../../Models/Constants';
import { IPopoverVisual } from '../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import ViewerConfigUtility from '../../Models/Classes/ViewerConfigUtility';
import PopoverVisual from '../PopoverVisual/PopoverVisual';

const ADT3DViewer: React.FC<IADT3DViewerProps> = ({
    adapter,
    sceneId,
    sceneConfig,
    pollingInterval,
    addInProps,
    hideUI,
    refetchConfig,
    showMeshesOnHover,
    enableMeshSelection,
    showHoverOnSelected,
    coloredMeshItems: coloredMeshItemsProp,
    zoomToMeshIds,
    unzoomedMeshOpacity
}) => {
    const { t } = useTranslation();
    const [modelUrl, setModelUrl] = useState('');
    const [coloredMeshItems, setColoredMeshItems] = useState<CustomMeshItem[]>(
        coloredMeshItemsProp || []
    );
    const [sceneVisuals, setSceneVisuals] = useState<SceneVisual[]>([]);
    const [showPopUp, setShowPopUp] = useState(false);
    const [popUpConfig, setPopUpConfig] = useState<IPopoverVisual>(null);
    const [popUpTwins, setPopUpTwins] = useState<Record<string, DTwin>>(null);
    const [selectedRenderMode, setSelectedRenderMode] = React.useState('');
    const popUpId = useGuid();
    const sceneWrapperId = useGuid();
    const [renderMode, setRenderMode] = useState<IADT3DViewerRenderMode>();

    const popUpX = useRef<number>(0);
    const popUpY = useRef<number>(0);

    const selectedMesh = useRef(null);
    const sceneRef = useRef(null);

    const sceneData = useAdapter({
        adapterMethod: () => adapter.getSceneData(sceneId, sceneConfig),
        refetchDependencies: [sceneId, sceneConfig],
        isLongPolling: true,
        pollingIntervalMillis: pollingInterval
    });

    useEffect(() => {
        refetchConfig && refetchConfig();
    }, []);

    useEffect(() => {
        if (sceneData?.adapterResult?.result?.data) {
            setModelUrl(sceneData.adapterResult.result.data.modelUrl);
            setSceneVisuals(sceneData.adapterResult.result.data.sceneVisuals);
            const prop = coloredMeshItemsProp || [];
            const tempColoredMeshItems = [...prop];

            for (const sceneVisual of sceneData.adapterResult.result.data
                .sceneVisuals) {
                if (sceneVisual.visuals) {
                    for (const visual of sceneVisual.visuals) {
                        switch (visual.type) {
                            case VisualType.StatusColoring: {
                                const value = parseExpression(
                                    visual.statusValueExpression,
                                    sceneVisual.twins
                                );
                                const color = ViewerConfigUtility.getColorOrNullFromStatusValueRange(
                                    visual.valueRanges,
                                    value
                                );
                                if (color) {
                                    for (const mesh of sceneVisual.meshIds) {
                                        const coloredMesh: CustomMeshItem = {
                                            meshId: mesh,
                                            color: color
                                        };
                                        if (
                                            !tempColoredMeshItems.find(
                                                (item) =>
                                                    item.meshId ===
                                                    coloredMesh.meshId
                                            )
                                        ) {
                                            tempColoredMeshItems.push(
                                                coloredMesh
                                            );
                                        }
                                    }
                                }
                                break;
                            }
                        }
                    }
                }
            }

            setColoredMeshItems(tempColoredMeshItems);
        } else {
            setColoredMeshItems(coloredMeshItemsProp || []);
        }
    }, [sceneData.adapterResult.result, coloredMeshItemsProp]);

    const meshClick = (marker: Marker, mesh: any, scene: any) => {
        if (sceneVisuals) {
            const sceneVisual = sceneVisuals.find((sceneVisual) =>
                sceneVisual.meshIds.find((id) => id === mesh?.id)
            );
            const popOver = sceneVisual?.visuals?.find(
                (visual) => visual.type === VisualType.Popover
            ) as IPopoverVisual;

            if (sceneVisual && popOver) {
                if (selectedMesh.current === mesh && showPopUp) {
                    selectedMesh.current = null;
                    setShowPopUp(false);
                } else {
                    let resetPopUpPosition = true;
                    if (showPopUp) {
                        resetPopUpPosition = false;
                    }
                    selectedMesh.current = mesh;
                    sceneRef.current = scene;
                    setPopUpTwins(sceneVisual.twins);
                    setPopUpConfig(popOver);
                    setShowPopUp(true);

                    if (resetPopUpPosition) {
                        const popUp = document.getElementById(popUpId);
                        if (popUp) {
                            popUpX.current =
                                popUp.offsetLeft + popUp.offsetWidth / 2;
                            popUpY.current =
                                popUp.offsetTop + popUp.offsetHeight / 2;
                        }
                    }
                }
            } else {
                selectedMesh.current = null;
                setShowPopUp(false);
            }
        }

        if (enableMeshSelection) {
            let coloredMeshes = [...coloredMeshItems];
            if (mesh) {
                const coloredMesh = coloredMeshItems.find(
                    (item) => item.meshId === mesh.id
                );
                if (coloredMesh) {
                    coloredMeshes = coloredMeshes.filter(
                        (item) => item.meshId !== coloredMesh.meshId
                    );
                    setColoredMeshItems(coloredMeshes);
                } else {
                    coloredMeshes.push({ meshId: mesh.id });
                    setColoredMeshItems(coloredMeshes);
                }
            } else {
                setColoredMeshItems([]);
            }
        }
    };

    const meshHover = (marker: Marker, mesh: any) => {
        if (mesh && sceneVisuals) {
            const sceneVisual = sceneVisuals.find((sceneVisual) =>
                sceneVisual.meshIds.find((id) => id === mesh?.id)
            );
            if (
                sceneVisual &&
                sceneVisual.visuals.find(
                    (visual) => visual.type === VisualType.Popover
                )
            ) {
                document.body.style.cursor = 'pointer';
            } else {
                document.body.style.cursor = '';
            }
        }
    };

    const renderModeOptions: IDropdownOption[] = [];
    for (const mode of RenderModes) {
        renderModeOptions.push({ key: mode.id, text: t(mode.text) });
    }

    if (!selectedRenderMode) {
        setSelectedRenderMode(renderModeOptions[0].key as string);
    }

    useEffect(() => {
        const state = RenderModes.find((m) => m.id === selectedRenderMode);
        setRenderMode(state);
    }, [selectedRenderMode]);

    const onRenderModeChange = (
        _event: React.FormEvent<HTMLDivElement>,
        item: IDropdownOption
    ): void => {
        setSelectedRenderMode(item.key as string);
    };

    return (
        <BaseComponent
            isLoading={
                sceneData.isLoading && sceneData.adapterResult.hasNoData()
            }
            adapterResults={[sceneData.adapterResult]}
        >
            <PopoverVisual
                isOpen={showPopUp}
                onClose={() => setShowPopUp(false)}
                popoverVisual={popUpConfig}
                twins={popUpTwins}
            />
            <div
                id={sceneWrapperId}
                className="cb-adt-3dviewer-wrapper"
                style={
                    renderMode?.background
                        ? { background: renderMode.background }
                        : {}
                }
            >
                <SceneViewWrapper
                    adapter={adapter}
                    config={sceneConfig}
                    sceneId={sceneId}
                    sceneVisuals={sceneVisuals}
                    addInProps={addInProps}
                    sceneViewProps={{
                        modelUrl: modelUrl,
                        coloredMeshItems: coloredMeshItems,
                        renderMode: renderMode,
                        showHoverOnSelected: showHoverOnSelected,
                        showMeshesOnHover: showMeshesOnHover,
                        zoomToMeshIds: zoomToMeshIds,
                        unzoomedMeshOpacity: unzoomedMeshOpacity,
                        onMeshClick: (marker, mesh, scene) =>
                            meshClick(marker, mesh, scene),
                        onMeshHover: (marker, mesh) => meshHover(marker, mesh),
                        getToken: (adapter as any).authService
                            ? () =>
                                  (adapter as any).authService.getToken(
                                      'storage'
                                  )
                            : undefined
                    }}
                />
                {!hideUI && (
                    <div className="cb-adt-3dviewer-render-mode-dropdown">
                        <Dropdown
                            selectedKey={selectedRenderMode}
                            onChange={onRenderModeChange}
                            options={renderModeOptions}
                            styles={{
                                dropdown: { width: 250 }
                            }}
                        />
                    </div>
                )}
            </div>
        </BaseComponent>
    );
};

export default withErrorBoundary(ADT3DViewer);
