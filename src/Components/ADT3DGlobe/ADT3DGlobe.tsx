import React, { useEffect, useRef, useState } from 'react';
import { SceneView } from '../3DV/SceneView';
import { IBlobAdapter } from '../../Models/Constants/Interfaces';
import { useAdapter } from '../../Models/Hooks';
import './ADT3DGlobe.scss';
import { withErrorBoundary } from '../../Models/Context/ErrorBoundary';
import { Marker } from '../../Models/Classes/SceneView.types';
import { MockAdapter } from '../..';
import { IScene } from '../../Models/Classes/3DVConfig';
import BaseComponent from '../BaseComponent/BaseComponent';

interface ADT3DGlobeProps {
    adapter: IBlobAdapter | MockAdapter;
    title?: string;
    onSceneClick?: (scene: IScene) => void;
}

const ADT3DGlobe: React.FC<ADT3DGlobeProps> = ({ adapter, onSceneClick }) => {
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

    const onMeshClick = (marker) => {
        if (marker && sceneClickRef.current) {
            sceneClickRef.current(marker.scene);
        }
    };

    return (
        <BaseComponent
            isLoading={config.isLoading && config.adapterResult.hasNoData()}
            adapterResults={[config.adapterResult]}
        >
            <div className="cb-adt-3dglobe-wrapper">
                <SceneView
                    modelUrl="Globe"
                    markers={markers}
                    onMeshClick={(marker) => onMeshClick(marker)}
                />
            </div>
        </BaseComponent>
    );
};

export default withErrorBoundary(ADT3DGlobe);
