import React, { useEffect, useRef, useState } from 'react';
import { SceneView } from '../../Components/3DV/SceneView';
import * as BABYLON from 'babylonjs';
import { IADT3DViewerAdapter } from '../../Models/Constants/Interfaces';
import { useAdapter, useGuid } from '../../Models/Hooks';
import BaseCard from '../Base/Consume/BaseCard';
import './ADT3DViewerCard.scss';
import { withErrorBoundary } from '../../Models/Context/ErrorBoundary';
import { Marker } from '../../Models/Classes/SceneView.types';
import { Scene } from 'babylonjs';
import Draggable from 'react-draggable';

interface ADT3DViewerCardProps {
    adapter: IADT3DViewerAdapter;
    twinId: string;
    pollingInterval: number;
    title?: string;
    connectionLineColor?: string;
}

const ADT3DViewerCard: React.FC<ADT3DViewerCardProps> = ({
    adapter,
    twinId,
    title,
    pollingInterval,
    connectionLineColor
}) => {
    const [modelUrl, setModelUrl] = useState('');
    const [labels, setLabels] = useState([]);
    const [showPopUp, setShowPopUp] = useState(false);
    const [popUpTile, setPopUpTitle] = useState('');
    const [popUpContent, setPopUpContent] = useState('');
    const lineId = useGuid();
    const popUpId = useGuid();
    const sceneWrapperId = useGuid();
    const popUpContainerId = useGuid();

    const popUpX = useRef<number>(0);
    const popUpY = useRef<number>(0);

    const selectedMesh = useRef<BABYLON.AbstractMesh>(null);
    const sceneRef = useRef<BABYLON.Scene>(null);

    const visualTwin = useAdapter({
        adapterMethod: () => adapter.getVisualADTTwin(twinId),
        refetchDependencies: [twinId],
        isLongPolling: true,
        pollingIntervalMillis: pollingInterval
    });

    useEffect(() => {
        window.addEventListener('resize', setConnectionLine);

        return () => {
            window.removeEventListener('resize', setConnectionLine);
        };
    }, []);

    function visualTwinLoaded() {
        if (visualTwin.adapterResult.result?.data) {
            setModelUrl(visualTwin.adapterResult.result.data.modelUrl);
            setLabels(visualTwin.adapterResult.result.data.labels);
        }
    }

    useEffect(() => {
        visualTwinLoaded();
    }, [visualTwin.adapterResult.result]);

    const meshClick = (
        marker: Marker,
        mesh: BABYLON.AbstractMesh,
        scene: Scene
    ) => {
        if (labels) {
            const label = labels.find((label) => label.meshId === mesh?.id);
            if (label) {
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
                    setPopUpTitle(label.metric);
                    setPopUpContent(label.value);
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
    };

    const meshHover = (marker: Marker, mesh: any) => {
        if (mesh) {
            const label = labels.find((label) => label.meshId === mesh.id);
            if (label) {
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
            const position = getMeshPosition(
                selectedMesh.current,
                sceneRef.current
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

    function getMeshPosition(mesh: BABYLON.AbstractMesh, scene: BABYLON.Scene) {
        const meshVectors = mesh.getBoundingInfo().boundingBox.vectors;
        const worldMatrix = mesh.getWorldMatrix();
        const transformMatrix = scene.getTransformMatrix();
        const viewport = scene.activeCamera?.viewport;

        const sceneWrapper = document.getElementById(sceneWrapperId);
        const coordinates = meshVectors.map((v) => {
            const proj = BABYLON.Vector3.Project(
                v,
                worldMatrix,
                transformMatrix,
                viewport
            );
            proj.x = proj.x * sceneWrapper.clientWidth;
            proj.y = proj.y * sceneWrapper.clientHeight;
            return proj;
        });

        const maxX = Math.max(...coordinates.map((p) => p.x));
        const minX = Math.min(...coordinates.map((p) => p.x));
        const maxY = Math.max(...coordinates.map((p) => p.y));
        const minY = Math.min(...coordinates.map((p) => p.y));

        return [(maxX - minX) / 2 + minX, (maxY - minY) / 2 + minY];
    }

    function setPopUpPosition(e, data) {
        popUpX.current += data.deltaX;
        popUpY.current += data.deltaY;
        setConnectionLine();
    }

    return (
        <BaseCard
            isLoading={
                visualTwin.isLoading && visualTwin.adapterResult.hasNoData()
            }
            adapterResult={visualTwin.adapterResult}
            title={title}
        >
            <div id={sceneWrapperId} className="cb-adt-3dviewer-wrapper">
                <SceneView
                    modelUrl={modelUrl}
                    labels={labels}
                    onMarkerClick={(marker, mesh, scene) =>
                        meshClick(marker, mesh, scene)
                    }
                    onMarkerHover={(marker, mesh) => meshHover(marker, mesh)}
                    onCameraMove={() => cameraMoved()}
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
                                <div className="cb-adt-3dviewer-popup-title">
                                    {popUpTile}
                                </div>
                                <div>{popUpContent}</div>
                                <div>
                                    <button
                                        className="cb-adt-3dviewer-close-btn"
                                        onClick={() => setShowPopUp(false)}
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </Draggable>
                    </div>
                )}
            </div>
        </BaseCard>
    );
};

export default withErrorBoundary(ADT3DViewerCard);
