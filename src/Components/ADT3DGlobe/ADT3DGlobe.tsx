import React, { useEffect, useRef, useState } from 'react';
import SceneView from '../3DV/SceneView';
import { useAdapter } from '../../Models/Hooks';
import './ADT3DGlobe.scss';
import { withErrorBoundary } from '../../Models/Context/ErrorBoundary';
import { CustomMeshItem, Marker } from '../../Models/Classes/SceneView.types';
import BaseComponent from '../BaseComponent/BaseComponent';
import { Scene } from '@babylonjs/core';
import { IADT3DGlobeProps } from '../../Models/Constants/Interfaces';
import { GlobeTheme } from '../../Models/Constants';
import { hexToColor4 } from '../../Models/Services/Utils';
import { hsv2rgb, rgb2hex, rgb2hsv } from '@fluentui/react';

const blues = ['#174576', '#276EB5']; // Sea and darkest color - rest are interpolated
const yellows = ['#8C7E25', '#C0A03D'];
const greys = ['#464241', '#6E6E6E']; // greys are calculated in code

const markers2: Marker[] = [
    {
        name: 'Ibhayi',
        latitude: -33.872,
        longitude: 25.571,
        color: '#f00',
        isNav: true
    },
    {
        name: 'Ponta Grossa',
        latitude: -25.0994,
        longitude: -50.1583,
        color: '#f00',
        isNav: true
    },
    {
        name: 'Putian',
        latitude: 25.433,
        longitude: 119.0167,
        color: '#f00',
        isNav: true
    },
    {
        name: 'Magor',
        latitude: 51.5804,
        longitude: -2.833,
        color: '#f00',
        isNav: true
    },
    {
        name: 'Ningbo',
        latitude: 29.8667,
        longitude: 121.55,
        color: '#f00',
        isNav: true
    },
    {
        name: 'Passa Fundo',
        latitude: -28.2624,
        longitude: -52.409,
        color: '#f00',
        isNav: true
    },
    {
        name: 'Tocancipa',
        latitude: 4.9667,
        longitude: -73.9167,
        color: '#f00',
        isNav: true
    },
    {
        name: 'Leuven',
        latitude: 50.8795,
        longitude: 4.7005,
        color: '#f00',
        isNav: true
    },
    {
        name: 'Uberlandia',
        latitude: -18.9231,
        longitude: -48.2886,
        color: '#f00',
        isNav: true
    }
];

if (!markers2) {
    console.log('Used for testing');
}

const ADT3DGlobe: React.FC<IADT3DGlobeProps> = ({
    adapter,
    onSceneClick,
    globeTheme = GlobeTheme.Blue
}) => {
    const [markers, setMarkers] = useState<Marker[]>([]);
    const [coloredMeshes, setColoredMeshes] = useState<CustomMeshItem[]>([]);
    const sceneClickRef = useRef<any>();
    const sceneRef = useRef(null);

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
                const marker = new Marker();
                marker.scene = scene;
                marker.color = '#f00';
                marker.latitude = scene.latitude || 0;
                marker.longitude = scene.longitude || 0;
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

    const updateTheme = (scene: Scene) => {
        sceneRef.current = sceneRef.current || scene;
        if (sceneRef.current) {
            const mi: CustomMeshItem[] = [];
            let colors = blues;
            switch (globeTheme) {
                case GlobeTheme.Blue:
                    colors = blues;
                    break;
                case GlobeTheme.Yellow:
                    colors = yellows;
                    break;
                case GlobeTheme.Grey:
                    colors = greys;
                    break;
            }

            let ct = -2;
            const baseColor = hexToColor4(colors[1]);
            const baseHSV = rgb2hsv(baseColor.r, baseColor.g, baseColor.b);
            for (const mesh of sceneRef.current.meshes) {
                if (mesh?.name?.startsWith('Region')) {
                    ct += 2;
                    if (ct >= 14) {
                        ct = 1;
                    }

                    if (globeTheme === GlobeTheme.Grey) {
                        const n = Math.floor((ct / 13) * 100 + 100);
                        const color = rgb2hex(n, n, n);
                        mi.push({ meshId: mesh.id, color: '#' + color });
                    } else {
                        const s = (ct / 13) * 62 + 12;
                        const col = hsv2rgb(baseHSV.h, s, 100);
                        const color = rgb2hex(col.r, col.g, col.b);
                        mi.push({ meshId: mesh.id, color: '#' + color });
                    }
                } else if (mesh.name.startsWith('Sea')) {
                    mi.push({ meshId: mesh.id, color: colors[0] });
                }
            }

            setColoredMeshes(mi);
        }
    };

    useEffect(() => {
        updateTheme(null);
    }, [globeTheme]);

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
                    onSceneLoaded={updateTheme}
                    coloredMeshItems={coloredMeshes}
                />
            </div>
        </BaseComponent>
    );
};

export default withErrorBoundary(ADT3DGlobe);
