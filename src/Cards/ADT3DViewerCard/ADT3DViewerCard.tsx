import React, { useEffect, useState } from 'react';
import { SceneView } from '../../Components/3DV/SceneView';
import * as BABYLON from 'babylonjs';
import { IADTAdapter } from '../../Models/Constants/Interfaces';
import { useAdapter } from '../../Models/Hooks';
import BaseCard from '../Base/Consume/BaseCard';
import './ADT3DViewerCard.scss';
import { withErrorBoundary } from '../../Models/Context/ErrorBoundary';
import { Marker } from '../../Models/Classes/SceneView.types';
import { Scene } from 'babylonjs';

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

    const meshClick = (marker: Marker, mesh: any, scene: Scene) => {
        const label = labels.find((label) => label.meshId === mesh.id);
        if(label) {
            setPopUpTitle(label.metric)
            setPopUpContent(label.value)
            setShowPopUp(!showPopUp);

            const pos = BABYLON.Vector3.Project(
                mesh.getAbsolutePosition(),
                BABYLON.Matrix.IdentityReadOnly,
                scene.getTransformMatrix(),
                scene.cameras[0].viewport.toGlobal(
                    scene.getEngine().getRenderWidth(),
                    scene.getEngine().getRenderHeight(),
                ),
            );

            setPopUpLeft(pos.x);
            setPopUpTop(pos.y);
        }
    }

    const meshHover = (marker: Marker, mesh: any, scene: Scene) => {
        if(labels && labels.find((label) => label.meshId === mesh.id)) {
            document.body.style.cursor='pointer';
        } else {
            document.body.style.cursor='';
        }
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
                    onMarkerClick={(marker, mesh, scene) =>
                        meshClick(marker, mesh, scene)
                    }
                    onMarkerHover={(marker, mesh, scene) =>
                        meshHover(marker, mesh, scene)
                    }
                />
                {
                    (showPopUp) &&
                        <div className='cb-adt-3dviewer-popup-container' style={{top: popUpTop, left: popUpLeft}}>
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
                }
            </div>
        </BaseCard>
    );
};

export default withErrorBoundary(ADT3DViewerCard);
