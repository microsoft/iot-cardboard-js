import React, { useEffect, useRef, useState } from 'react';
import {
    DTwin,
    IADT3DViewerProps,
    IADT3DViewerRenderMode
} from '../../Models/Constants/Interfaces';
import { useGuid } from '../../Models/Hooks';
import './ADT3DViewer.scss';
import { withErrorBoundary } from '../../Models/Context/ErrorBoundary';
import { ColoredMeshItem, Marker } from '../../Models/Classes/SceneView.types';
import Draggable from 'react-draggable';
import { getMeshCenter } from '../../Components/3DV/SceneView.Utils';
import { VisualType } from '../../Models/Classes/3DVConfig';
import { PopupWidget } from '../../Components/Widgets/PopupWidget/PopupWidget';
import BaseComponent from '../../Components/BaseComponent/BaseComponent';
import { SceneViewWrapper } from '../../Components/3DV/SceneViewWrapper';
import { Dropdown, IDropdownOption } from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import { RenderModes } from '../../Models/Constants';
import { IPopoverVisual } from '../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import ElementsPanel, {
    use3DViewerRuntime
} from '../ElementsPanel/ElementsPanel';

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
    showHoverOnSelected,
    coloredMeshItems: coloredMeshItemsProp,
    zoomToMeshIds: zoomToMeshIdsProp,
    hideUnzoomedMeshes
}) => {
    const { t } = useTranslation();
    const [coloredMeshItems, setColoredMeshItems] = useState<ColoredMeshItem[]>(
        coloredMeshItemsProp || []
    );
    const [zoomToMeshIds, setZoomToMeshIds] = useState<Array<string>>(
        zoomToMeshIdsProp || []
    );
    const [showPopUp, setShowPopUp] = useState(false);
    const [popUpConfig, setPopUpConfig] = useState<IPopoverVisual>(null);
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

    const { modelUrl, sceneVisuals, isLoading } = use3DViewerRuntime(
        adapter,
        sceneId,
        sceneConfig,
        pollingInterval
    );

    useEffect(() => {
        window.addEventListener('resize', setConnectionLine);
        refetchConfig && refetchConfig();
        return () => {
            window.removeEventListener('resize', setConnectionLine);
        };
    }, []);

    useEffect(() => {
        const newColoredMeshItems = [...coloredMeshItems];
        sceneVisuals.forEach((sceneVisual) => {
            sceneVisual.coloredMeshItems.forEach((sceneColoredMeshItem) => {
                const existingColoredMeshItem = newColoredMeshItems.find(
                    (nC) => nC.meshId === sceneColoredMeshItem.meshId
                );
                if (existingColoredMeshItem) {
                    existingColoredMeshItem.color = sceneColoredMeshItem.color;
                } else {
                    newColoredMeshItems.push(sceneColoredMeshItem);
                }
            });
        });
        setColoredMeshItems(newColoredMeshItems);
    }, [sceneVisuals]);

    const meshClick = (marker: Marker, mesh: any, scene: any) => {
        if (sceneVisuals) {
            const sceneVisual = sceneVisuals.find((sceneVisual) =>
                sceneVisual.meshIds.find((id) => id === mesh?.id)
            );
            const popOver = sceneVisual?.visuals?.find(
                (visual) => visual.type === VisualType.Popover
            ) as IPopoverVisual;

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
                    (visual) => visual.type === VisualType.Popover
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
        <BaseComponent isLoading={isLoading && !sceneVisuals}>
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
                        hideUnzoomedMeshes: hideUnzoomedMeshes,
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
                <ElementsPanel
                    adapter={adapter}
                    sceneId={sceneId}
                    sceneConfig={sceneConfig}
                    pollingInterval={10000}
                    onItemClick={(item, meshIds) => setZoomToMeshIds(meshIds)}
                    onItemHover={(item) => item.type}
                />
            </div>
        </BaseComponent>
    );
};

export default withErrorBoundary(ADT3DViewer);
