import React, { useEffect, useRef, useState } from 'react';
import { SceneView } from '../../Components/3DV/SceneView';
import { IADTAdapter, IADTTwin } from '../../Models/Constants/Interfaces';
import { useAdapter } from '../../Models/Hooks';
import BaseCard from '../Base/Consume/BaseCard';
import './ADT3DGlobeCard.scss';
import { withErrorBoundary } from '../../Models/Context/ErrorBoundary';
import { Marker } from '../../Models/Classes/SceneView.types';

interface ADT3DGlobeCardProps {
    adapter: IADTAdapter;
    title?: string;
    onSceneClick?: (twin: IADTTwin) => void;
}

const ADT3DGlobeCard: React.FC<ADT3DGlobeCardProps> = ({
    adapter,
    title,
    onSceneClick
}) => {
    const [markers, setMarkers] = useState<Marker[]>([]);
    const sceneClickRef = useRef<any>();

    sceneClickRef.current = onSceneClick;

    const scenes = useAdapter({
        adapterMethod: () => adapter.getScenes(),
        refetchDependencies: [adapter]
    });

    useEffect(() => {
        if (scenes.adapterResult.result?.data) {
            setMarkers(scenes.adapterResult.result?.data?.markers);
        }
    }, [scenes.adapterResult.result]);

    const onMarkerClick = (marker) => {
        if (marker && sceneClickRef.current) {
            const twin = { $dtId: 'TankVisual', MediaSrc: marker.id }; // TODO: Pass proper structure
            sceneClickRef.current(twin);
        }
    };

    return (
        <BaseCard
            isLoading={scenes.isLoading && scenes.adapterResult.hasNoData()}
            adapterResult={scenes.adapterResult}
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
