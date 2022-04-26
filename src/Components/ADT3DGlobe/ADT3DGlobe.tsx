import React, { useEffect, useRef, useState } from 'react';
import SceneView from '../3DV/SceneView';
import { IBlobAdapter } from '../../Models/Constants/Interfaces';
import { useAdapter } from '../../Models/Hooks';
import './ADT3DGlobe.scss';
import { withErrorBoundary } from '../../Models/Context/ErrorBoundary';
import { Marker } from '../../Models/Classes/SceneView.types';
import { MockAdapter } from '../..';
import BaseComponent from '../BaseComponent/BaseComponent';
import { IScene } from '../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { ModelLabel } from '../ModelLabel/ModelLabel';
import { createGUID } from '../../Models/Services/Utils';

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
        const scenes = config.adapterResult.result?.data?.configuration?.scenes;
        if (scenes) {
            for (const scene of scenes) {
                const id = 'ID' + createGUID();
                const marker = new Marker();
                marker.scene = scene;
                marker.id = id;
                marker.latitude = scene.latitude || 0;
                marker.longitude = scene.longitude || 0;
                marker.name = scene.displayName || 'Unknown';
                marker.UIElement = <ModelLabel label={scene.displayName} />;
                markers.push(marker);
            }

            setMarkers(markers);
        }
    }, [config.adapterResult.result]);

    return (
        <BaseComponent
            isLoading={config.isLoading && config.adapterResult.hasNoData()}
            adapterResults={[config.adapterResult]}
        >
            <div className="cb-adt-3dglobe-wrapper">
                <SceneView modelUrl="Globe" markers={markers} />
            </div>
        </BaseComponent>
    );
};

export default withErrorBoundary(ADT3DGlobe);
