import React, { useEffect, useRef, useState } from 'react';
import { SceneView } from '../../Components/3DV/SceneView';
import * as BABYLON from 'babylonjs';
import { IADTAdapter } from '../../Models/Constants/Interfaces';
import { useAdapter } from '../../Models/Hooks';
import BaseCard from '../Base/Consume/BaseCard';
import './ADT3DViewerCard.scss';
import { withErrorBoundary } from '../../Models/Context/ErrorBoundary';
import { Marker } from '../../Models/Classes/SceneView.types';
import { Scene } from 'babylonjs';
import * as d3 from "d3";
import Draggable from 'react-draggable';

interface ADT3DViewerCardProps {
    adapter: IADTAdapter;
    twinId: string;
    pollingInterval: number;
    title?: string;
}

const ADT3DViewerCard: React.FC<ADT3DViewerCardProps> = ({
    adapter,
    twinId,
    title,
    pollingInterval
}) => {
    const [modelUrl, setModelUrl] = useState('');
    const [labels, setLabels] = useState([]);
    const [showPopUp, setShowPopUp] = useState(false);
    const [popUpTile, setPopUpTitle] = useState('');
    const [popUpContent, setPopUpContent] = useState('');
    const [popUpLeft, setPopUpLeft] = useState(0);
    const [popUpTop, setPopUpTop] = useState(0);

    const selectedMesh = useRef<BABYLON.AbstractMesh>(null);

    const visualTwin = useAdapter({
        adapterMethod: () => adapter.getVisualADTTwin(twinId),
        refetchDependencies: [twinId],
        isLongPolling: true,
        pollingIntervalMillis: pollingInterval
    });

    function visualTwinLoaded() {
        if (visualTwin.adapterResult.result?.data) {
            setModelUrl(visualTwin.adapterResult.result.data.modelUrl);
            setLabels(visualTwin.adapterResult.result.data.labels);
        }
    }

    useEffect(() => {
        visualTwinLoaded();
    }, [visualTwin.adapterResult.result]);

    const meshClick = (marker: Marker, mesh: BABYLON.AbstractMesh, scene: Scene, e: any) => {
        const label = labels.find((label) => label.meshId === mesh.id);
        if(label) {
            selectedMesh.current = mesh;
            setPopUpTitle(label.metric)
            setPopUpContent(label.value)
            showPopUp ? selectedMesh.current = null : selectedMesh.current = mesh;
            setShowPopUp(!showPopUp);

            const position = getClientRectFromMesh(mesh, scene);
            setPopUpLeft(position[0]);
            setPopUpTop(position[1]);
        }
    }

    const meshHover = (marker: Marker, mesh: any, scene: Scene) => {
        if(mesh) {
            const label = labels.find((label) => label.meshId === mesh.id);
            if(label) {
                document.body.style.cursor='pointer';
            } else {
                document.body.style.cursor='';
            }
        }
    }

    const cameraMoved = (marker: Marker, mesh: any, scene: Scene) => {
        if(selectedMesh.current) {
            const position = getClientRectFromMesh(selectedMesh.current, scene);
            setPopUpLeft(position[0]);
            setPopUpTop(position[1]);
        }
    }

    function getClientRectFromMesh (mesh: BABYLON.AbstractMesh, scene: BABYLON.Scene) {

        const meshVectors = mesh.getBoundingInfo().boundingBox.vectors
        const worldMatrix = mesh.getWorldMatrix()
        const transformMatrix = scene.getTransformMatrix()
        const viewport = scene.activeCamera!.viewport
    
        const coordinates = meshVectors.map(v => {
          const proj = BABYLON.Vector3.Project(v, worldMatrix, transformMatrix, viewport);
          proj.x = proj.x * 600;
          proj.y = proj.y * 400;
          return proj;
        })
    
        const [minX, maxX] = d3.extent(coordinates, c => c.x) as number[];
        const [minY, maxY] = d3.extent(coordinates, c => c.y) as number[];
        
        return [((maxX - minX) / 2 + minX), ((maxY - minY) / 2 + minY)];
    }

    return (
        <BaseCard
            isLoading={
                visualTwin.isLoading && visualTwin.adapterResult.hasNoData()
            }
            adapterResult={visualTwin.adapterResult}
            title={title}
        >
            <div className="cb-adt-3dviewer-wrapper">
                <SceneView
                    modelUrl={modelUrl}
                    labels={labels}
                    cameraRadius={800}
                    cameraCenter={new BABYLON.Vector3(0, 100, 0)}
                    onMarkerClick={(marker, mesh, scene, e) =>
                        meshClick(marker, mesh, scene, e)
                    }
                    onMarkerHover={(marker, mesh, scene) =>
                        meshHover(marker, mesh, scene)
                    }
                    onCameraMove={(marker, mesh, scene) =>
                        cameraMoved(marker, mesh, scene)
                    }
                />
                {
                    (showPopUp) &&
                        <div>
                         <div className='position' style={{top: popUpTop, left: popUpLeft}}/>
                         <Draggable>
                            <div className='cb-adt-3dviewer-popup-container' >
                                <div className='cb-adt-3dviewer-popup-title'>
                                    {popUpTile}
                                </div>
                                <div>
                                    {popUpContent}
                                </div>
                                <div>
                                    <button className='cb-adt-3dviewer-close-btn' onClick={() => setShowPopUp(false)}>Close</button>
                                </div>
                            </div>
                         </Draggable>
                        </div>
                }
            </div>
        </BaseCard>
    );
};

export default withErrorBoundary(ADT3DViewerCard);
