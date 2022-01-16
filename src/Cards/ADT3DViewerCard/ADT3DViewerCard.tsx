import React, { useEffect, useRef, useState } from 'react';
import { SceneView } from '../../Components/3DV/SceneView';
import { DTwin, IADT3DViewerAdapter } from '../../Models/Constants/Interfaces';
import { useAdapter, useGuid } from '../../Models/Hooks';
import BaseCard from '../Base/Consume/BaseCard';
import './ADT3DViewerCard.scss';
import { withErrorBoundary } from '../../Models/Context/ErrorBoundary';
import {
    ColoredMeshItem,
    Marker,
    SceneVisual
} from '../../Models/Classes/SceneView.types';
import Draggable from 'react-draggable';
import { getMeshCenter } from '../../Components/3DV/SceneView.Utils';
import {
    IScenesConfig,
    IVisual,
    VisualType
} from '../../Models/Classes/3DVConfig';
import { Parser } from 'expr-eval';
import { PopupWidget } from '../../Components/Widgets/PopupWidget/PopupWidget';

interface ADT3DViewerCardProps {
    adapter: IADT3DViewerAdapter;
    sceneId: string;
    sceneConfig: IScenesConfig;
    pollingInterval: number;
    title?: string;
    connectionLineColor?: string;
    enableMeshSelection?: boolean;
}

const ADT3DViewerCard: React.FC<ADT3DViewerCardProps> = ({
    adapter,
    sceneId,
    sceneConfig,
    title,
    pollingInterval,
    connectionLineColor,
    enableMeshSelection
}) => {
    const [modelUrl, setModelUrl] = useState('');
    const [coloredMeshItems, setColoredMeshItems] = useState<ColoredMeshItem[]>(
        []
    );
    const [sceneVisuals, setSceneVisuals] = useState<SceneVisual[]>([]);
    const [showPopUp, setShowPopUp] = useState(false);
    const [popUpConfig, setPopUpConfig] = useState<IVisual>(null);
    const [popUpTwins, setPopUpTwins] = useState<Record<string, DTwin>>(null);
    const [selectedMeshIds, setselectedMeshIds] = useState<string[]>([]);
    const lineId = useGuid();
    const popUpId = useGuid();
    const sceneWrapperId = useGuid();
    const popUpContainerId = useGuid();

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
        return () => {
            window.removeEventListener('resize', setConnectionLine);
        };
    }, []);

    useEffect(() => {
        if (sceneData?.adapterResult?.result?.data) {
            setModelUrl(sceneData.adapterResult.result.data.modelUrl);
            setSceneVisuals(sceneData.adapterResult.result.data.sceneVisuals);
            const tempColoredMeshItems = [];

            for (const sceneVisual of sceneData.adapterResult.result.data
                .sceneVisuals) {
                for (const visual of sceneVisual.visuals) {
                    switch (visual.type) {
                        case VisualType.ColorChange: {
                            const color = (Parser.evaluate(
                                visual.color.expression,
                                sceneVisual.twins
                            ) as any) as string;
                            for (const mesh of sceneVisual.meshIds) {
                                const coloredMesh: ColoredMeshItem = {
                                    meshId: mesh,
                                    color: color
                                };
                                tempColoredMeshItems.push(coloredMesh);
                            }
                            break;
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
            let meshes = [...selectedMeshIds];
            if (mesh) {
                const selectedMesh = selectedMeshIds.find(
                    (item) => item === mesh.id
                );
                if (selectedMesh) {
                    meshes = selectedMeshIds.filter(
                        (item) => item !== selectedMesh
                    );
                    setselectedMeshIds(meshes);
                } else {
                    meshes.push(mesh.id);
                    setselectedMeshIds(meshes);
                }
            } else {
                setselectedMeshIds([]);
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

    return (
        <BaseCard
            isLoading={
                sceneData.isLoading && sceneData.adapterResult.hasNoData()
            }
            adapterResult={sceneData.adapterResult}
            title={title}
        >
            <div id={sceneWrapperId} className="cb-adt-3dviewer-wrapper">
                <SceneView
                    modelUrl={modelUrl}
                    selectedMeshIds={selectedMeshIds}
                    coloredMeshItems={coloredMeshItems}
                    onMarkerClick={(marker, mesh, scene) =>
                        meshClick(marker, mesh, scene)
                    }
                    onMarkerHover={(marker, mesh) => meshHover(marker, mesh)}
                    onCameraMove={() => cameraMoved()}
                    getToken={
                        (adapter as any).authService
                            ? () =>
                                  (adapter as any).authService.getToken(
                                      'storage'
                                  )
                            : undefined
                    }
                />
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
        </BaseCard>
    );
};

export default withErrorBoundary(ADT3DViewerCard);
