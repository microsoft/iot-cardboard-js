import React, { useEffect, useRef, useState } from 'react';
import { SceneView } from '../../Components/3DV/SceneView';
import { IBlobAdapter } from '../../Models/Constants/Interfaces';
import { useAdapter } from '../../Models/Hooks';
import BaseCard from '../Base/Consume/BaseCard';
import './ADT3DGlobeCard.scss';
import { withErrorBoundary } from '../../Models/Context/ErrorBoundary';
import { Marker } from '../../Models/Classes/SceneView.types';
import { MockAdapter } from '../..';
import { IScene } from '../../Models/Classes/3DVConfig';

interface ADT3DGlobeCardProps {
    adapter: IBlobAdapter | MockAdapter;
    title?: string;
    onSceneClick?: (scene: IScene) => void;
}

const ADT3DGlobeCard: React.FC<ADT3DGlobeCardProps> = ({
    adapter,
    title,
    onSceneClick
}) => {
    const [markers, setMarkers] = useState<Marker[]>([]);
    const sceneClickRef = useRef<any>();

    sceneClickRef.current = onSceneClick;
    const config = useAdapter({
        adapterMethod: () => adapter.getScenesConfig(),
        refetchDependencies: [adapter]
    });

    useEffect(() => {
        const markers: Marker[] = [];
        const scenes =
            config.adapterResult.result?.data?.viewerConfiguration?.scenes;
        if (scenes) {
            for (const scene of scenes) {
                const marker = new Marker();
                marker.scene = scene;
                marker.color = { r: 255, g: 0, b: 0 };
                marker.latitude = scene.latitude;
                marker.longitude = scene.longitude;
                marker.name = scene.displayName || 'Unknown';
                marker.isNav = true;
                markers.push(marker);
            }

            setMarkers(markers);
        }
    }, [config.adapterResult.result]);

    const onMarkerClick = (marker) => {
        if (marker && sceneClickRef.current) {
            sceneClickRef.current(marker.scene);
        }
    };

    return (
        <BaseCard
            isLoading={config.isLoading && config.adapterResult.hasNoData()}
            adapterResult={config.adapterResult}
            title={title}
        >
            <div className="cb-adt-3dglobe-wrapper">
                <SceneView
                    modelUrl="Globe"
                    markers={markers}
                    onMarkerClick={(marker) => onMarkerClick(marker)}
                />
            </div>
        </BaseCard>
    );
};

export default withErrorBoundary(ADT3DGlobeCard);
