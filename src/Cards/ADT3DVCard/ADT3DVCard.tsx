import React, { useEffect, useState } from 'react';
import { SceneView } from '../../Components/3DV/SceneView';
import * as BABYLON from 'babylonjs';
import { IADTAdapter } from '../../Models/Constants/Interfaces';
import { useAdapter } from '../../Models/Hooks';
import BaseCard from '../Base/Consume/BaseCard';
import './ADT3DVCard.scss';

interface ADT3DVCardProps {
    adapter: IADTAdapter;
    twinId: string;
    pollingInterval: number
    title?: string;
}

export const ADT3DVCard: React.FC<ADT3DVCardProps> = ({
    adapter,
    twinId,
    title, 
    pollingInterval
}) => {
    const [modelUrl, setModelUrl] = useState('');
    const [labels, setLabels] = useState([]);

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

    return (
        <BaseCard
            isLoading={
                visualTwin.isLoading && visualTwin.adapterResult.hasNoData()
            }
            adapterResult={visualTwin.adapterResult}
            title={title}
        >
            <div className="cb-adt-3dv-wrapper">
                <SceneView
                    modelUrl={modelUrl}
                    labels={labels}
                    cameraRadius={800}
                    cameraCenter={new BABYLON.Vector3(0, 100, 0)}
                />
            </div>
        </BaseCard>
    );
};
