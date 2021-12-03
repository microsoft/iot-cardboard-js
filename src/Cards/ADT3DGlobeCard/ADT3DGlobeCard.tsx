import React, { useEffect, useState } from 'react';
import { SceneView } from '../../Components/3DV/SceneView';
import * as BABYLON from 'babylonjs';
import { IADTAdapter } from '../../Models/Constants/Interfaces';
import { useAdapter } from '../../Models/Hooks';
import BaseCard from '../Base/Consume/BaseCard';
import './ADT3DGlobeCard.scss';
import { withErrorBoundary } from '../../Models/Context/ErrorBoundary';
import { Marker } from '../../Models/Classes/SceneView.types';

interface ADT3DGlobeCardProps {
    adapter: IADTAdapter;
    title?: string;
}

const ADT3DGlobeCard: React.FC<ADT3DGlobeCardProps> = ({ adapter, title }) => {
    const [markers, setMarkers] = useState<Marker[]>([]);

    const scenes = useAdapter({
        adapterMethod: () =>
            adapter.getADTTwinsByModelId({
                modelId: 'dtmi:com:visualontology:scene;1'
            }),
        refetchDependencies: [adapter]
    });

    useEffect(() => {
        const markers: Marker[] = [];
        if (scenes.adapterResult.result?.data?.value) {
            for (const scene of scenes.adapterResult.result.data.value) {
                const marker = new Marker();
                marker.color = BABYLON.Color3.Red();
                marker.latitude = scene.latitude;
                marker.longitude = scene.longitude;
                marker.name = scene.name || scene.$dtid || 'Unknown';
                marker.isNav = true;
                markers.push(marker);
            }

            setMarkers(markers);
        }
    }, [scenes.adapterResult.result]);

    return (
        <BaseCard
            isLoading={scenes.isLoading && scenes.adapterResult.hasNoData()}
            adapterResult={scenes.adapterResult}
            title={title}
        >
            <div className="cb-adt-3dglobe-wrapper">
                <SceneView
                    modelUrl="https://3dvstoragecontainer.blob.core.windows.net/3dvblobcontainer/world/World3.gltf"
                    markers={markers}
                />
            </div>
        </BaseCard>
    );
};

export default withErrorBoundary(ADT3DGlobeCard);
