import React, { useCallback, useEffect, useRef, useState } from 'react';
import SceneView from '../3DV/SceneView';
import { useAdapter } from '../../Models/Hooks';
import './ADT3DGlobe.scss';
import { withErrorBoundary } from '../../Models/Context/ErrorBoundary';
import { CustomMeshItem, Marker } from '../../Models/Classes/SceneView.types';
import BaseComponent from '../BaseComponent/BaseComponent';
import { ModelLabel } from '../ModelLabel/ModelLabel';
import { Scene } from '@babylonjs/core';
import { IADT3DGlobeProps } from '../../Models/Constants/Interfaces';
import { GlobeTheme } from '../../Models/Constants';
import { hexToColor4 } from '../../Models/Services/Utils';
import { hsv2rgb, rgb2hex, rgb2hsv } from '@fluentui/react';
import { IScene } from '../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';

const blues = ['#174576', '#276EB5']; // Sea and darkest color - rest are interpolated
const yellows = ['#8C7E25', '#C0A03D'];
const greys = ['#464241', '#6E6E6E']; // greys are calculated in code

const ADT3DGlobe: React.FC<IADT3DGlobeProps> = ({
    adapter,
    onSceneClick,
    globeTheme = GlobeTheme.Blue
}) => {
    const [markers, setMarkers] = useState<Marker[]>([]);
    const [coloredMeshes, setColoredMeshes] = useState<CustomMeshItem[]>([]);
    const sceneRef = useRef(null);

    const config = useAdapter({
        adapterMethod: () => adapter.getScenesConfig(),
        refetchDependencies: [adapter]
    });

    const onLabelClick = useCallback(
        (id: string) => {
            if (id) {
                const scene = config.adapterResult.result?.data?.configuration?.scenes?.find(
                    (scene) => scene?.id === id
                );
                if (scene) {
                    onSceneClick(scene);
                }
            }
        },
        [config.adapterResult.result]
    );

    useEffect(() => {
        const markers: Marker[] = [];
        const scenes = config.adapterResult.result?.data?.configuration?.scenes;
        if (scenes) {
            for (const scene of scenes) {
                if (scene.latitude && scene.longitude) {
                    markers.push(createMarker(scene));
                }
            }

            setMarkers(markers);
        }
    }, [config.adapterResult.result]);

    const createMarker = (scene: IScene) => {
        const id = 'cb-label-' + scene.id;
        const marker: Marker = {
            scene: scene,
            id: id,
            latitude: scene.latitude || 0,
            longitude: scene.longitude || 0,
            name: scene.displayName || 'Unknown',
            allowGrouping: true,
            UIElement: (
                <ModelLabel
                    id={scene.id}
                    label={scene.displayName}
                    onLabelClick={(id: string) => onLabelClick(id)}
                />
            )
        };

        return marker;
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
                    onSceneLoaded={updateTheme}
                    coloredMeshItems={coloredMeshes}
                />
            </div>
        </BaseComponent>
    );
};

export default withErrorBoundary(ADT3DGlobe);
