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
    ColoredMeshItem,
    Marker,
    SceneVisual
} from '../../Models/Classes/SceneView.types';
import Draggable from 'react-draggable';
import { getMeshCenter } from '../../Components/3DV/SceneView.Utils';
import { IVisual, VisualType } from '../../Models/Classes/3DVConfig';
import { PopupWidget } from '../../Components/Widgets/PopupWidget/PopupWidget';
import { parseExpression } from '../../Models/Services/Utils';
import BaseComponent from '../../Components/BaseComponent/BaseComponent';
import { SceneViewWrapper } from '../../Components/3DV/SceneViewWrapper';
import { Dropdown, IDropdownOption } from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import { RenderModes } from '../../Models/Constants';

const ADT3DViewer: React.FC<IADT3DViewerProps> = ({
    adapter,
    sceneId,
    sceneConfig,
    pollingInterval,
    connectionLineColor,
    addInProps,
    hideUI,
    refetchConfig,
    showMeshesOnHover,
    enableMeshSelection,
    showHoverOnSelected
}) => {
    const { t } = useTranslation();
    const [modelUrl, setModelUrl] = useState('');
    const [coloredMeshItems, setColoredMeshItems] = useState<ColoredMeshItem[]>(
        []
    );
    const [sceneVisuals, setSceneVisuals] = useState<SceneVisual[]>([]);
    const [showPopUp, setShowPopUp] = useState(false);
    const [popUpConfig, setPopUpConfig] = useState<IVisual>(null);
    const [popUpTwins, setPopUpTwins] = useState<Record<string, DTwin>>(null);
    const [selectedRenderMode, setSelectedRenderMode] = React.useState('');
    const lineId = useGuid();
    const popUpId = useGuid();
    const sceneWrapperId = useGuid();
    const popUpContainerId = useGuid();
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
        window.addEventListener('resize', setConnectionLine);
        refetchConfig && refetchConfig();
        return () => {
            window.removeEventListener('resize', setConnectionLine);
        };
    }, []);

    useEffect(() => {
        if (sceneData?.adapterResult?.result?.data) {
            setModelUrl(sceneData.adapterResult.result.data.modelUrl);
            setSceneVisuals(sceneData.adapterResult.result.data.sceneVisuals);
            const tempColoredMeshItems = [...coloredMeshItems];

            for (const sceneVisual of sceneData.adapterResult.result.data
                .sceneVisuals) {
                if (sceneVisual.visuals) {
                    for (const visual of sceneVisual.visuals) {
                        switch (visual.type) {
                            case VisualType.ColorChange: {
                                const color = parseExpression(
                                    visual.color.expression,
                                    sceneVisual.twins
                                );
                                for (const mesh of sceneVisual.meshIds) {
                                    const coloredMesh: ColoredMeshItem = {
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
                                        tempColoredMeshItems.push(coloredMesh);
                                    }
                                }
                                break;
                            }
                        }
                    }
                }
            }

            setColoredMeshItems(tempColoredMeshItems);
        }
    }, [sceneData.adapterResult.result]);

    const meshClick = (marker: Marker, mesh: any, scene: any) => {
        if (sceneVisuals) {
            const sceneVisual = sceneVisuals.find((sceneVisual) =>
                sceneVisual.meshIds.find((id) => id === mesh?.id)
            );
            const popOver = sceneVisual?.visuals?.find(
                (visual) => visual.type === VisualType.OnClickPopover
            );

            if (sceneVisual && popOver) {
                if (selectedMesh.current === mesh) {
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
                    setConnectionLine();
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
                    (visual) => visual.type === VisualType.OnClickPopover
                )
            ) {
                document.body.style.cursor = 'pointer';
            } else {
                document.body.style.cursor = '';
            }
        }
    };

    const cameraMoved = () => {
        setConnectionLine();
    };

    function setConnectionLine() {
        if (selectedMesh.current) {
            const sceneWrapper = document.getElementById(sceneWrapperId);
            const position = getMeshCenter(
                selectedMesh.current,
                sceneRef.current,
                sceneWrapper
            );
            const container = document.getElementById(popUpContainerId);
            if (container) {
                const canvas: HTMLCanvasElement = document.getElementById(
                    lineId
                ) as HTMLCanvasElement;
                canvas.width = container.clientWidth;
                canvas.height = container.clientHeight;
                const context = canvas.getContext('2d');
                context.clearRect(0, 0, canvas.width, canvas.height);

                context.beginPath();
                context.strokeStyle = connectionLineColor || '#0058cc';
                context.moveTo(popUpX.current, popUpY.current);
                context.lineTo(position[0], position[1]);
                context.stroke();
            }
        }
    }

    function setPopUpPosition(e, data) {
        popUpX.current += data.deltaX;
        popUpY.current += data.deltaY;
        setConnectionLine();
    }

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
                        meshSelectionColor: renderMode?.meshSelectionColor,
                        meshHoverColor: renderMode?.meshHoverColor,
                        showHoverOnSelected: showHoverOnSelected,
                        showMeshesOnHover: showMeshesOnHover,
                        meshSelectionHoverColor:
                            renderMode?.meshSelectionHoverColor,
                        isWireframe: renderMode?.isWireframe,
                        meshBaseColor: renderMode?.baseColor,
                        meshFresnelColor: renderMode?.fresnelColor,
                        meshOpacity: renderMode?.opacity,
                        onMeshClick: (marker, mesh, scene) =>
                            meshClick(marker, mesh, scene),
                        onMeshHover: (marker, mesh) => meshHover(marker, mesh),
                        onCameraMove: () => cameraMoved(),
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
                {showPopUp && (
                    <div
                        id={popUpContainerId}
                        className="cb-adt-3dviewer-popup-container"
                    >
                        <canvas
                            id={lineId}
                            className="cb-adt-3dviewer-line-canvas"
                        />
                        <Draggable
                            bounds="parent"
                            onDrag={(e, data) => setPopUpPosition(e, data)}
                        >
                            <div id={popUpId} className="cb-adt-3dviewer-popup">
                                <PopupWidget
                                    config={popUpConfig}
                                    onClose={() => setShowPopUp(false)}
                                    twins={popUpTwins}
                                />
                            </div>
                        </Draggable>
                    </div>
                )}
            </div>
        </BaseComponent>
    );
};

export default withErrorBoundary(ADT3DViewer);
