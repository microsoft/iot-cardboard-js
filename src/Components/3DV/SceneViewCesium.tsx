// THIS CODE AND INFORMATION IS PROVIDED AS IS WITHOUT WARRANTY OF
// ANY KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING BUT NOT LIMITED TO
// THE IMPLIED WARRANTIES OF MERCHANTABILITY AND/OR FITNESS FOR A
// PARTICULAR PURPOSE.
//
// Copyright (c) Microsoft. All rights reserved
//

import React, { useCallback, useEffect, useRef, useState } from 'react';
import './SceneView.scss';
import * as Cesium from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';
import JulianDate from 'cesium/Source/Core/JulianDate';
import { ProgressIndicator } from '@fluentui/react';
import { createGUID, sleep } from '../../Models/Services/Utils';
import {
    Marker,
    SceneViewCallbackHandler
} from '../../Models/Classes/SceneView.types';

const debug = false;
const markerPrefix = 'Marker_';

interface ISceneViewCesiumProp {
    modelUrl: string;
    markers?: Marker[];
    onMarkerClick?: SceneViewCallbackHandler;
    onMarkerHover?: SceneViewCallbackHandler;
    selectedMeshNames?: string[];
    // labels?: SceneViewLabel[];
    // children?: ChildTwin[];
}

let lastName = '';

export const SceneViewCesium: React.FC<ISceneViewCesiumProp> = ({
    modelUrl,
    markers,
    onMarkerClick,
    onMarkerHover,
    selectedMeshNames
}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [canvasId] = useState(createGUID());
    const onMarkerClickRef = useRef<SceneViewCallbackHandler>(null);
    const onMarkerHoverRef = useRef<SceneViewCallbackHandler>(null);
    const lastMeshRef = useRef(null);
    const lastMarkerRef = useRef<Marker>(null);
    const modelUrlRef = useRef('blank');
    const newInstanceRef = useRef(false);
    const [tooltipText, setTooltipText] = useState('');
    const tooltipLeft = useRef(0);
    const tooltipTop = useRef(0);
    const viewerRef = useRef<Cesium.Viewer>(null);
    const colorsRef = useRef({});

    (window as any).CESIUM_BASE_URL = 'https://baby3d.azurewebsites.net/cesium';

    const defaultMarkerHover = (marker: Marker, mesh: any, e: any) => {
        if (lastName !== marker?.name) {
            tooltipLeft.current = e.offsetX + 5;
            tooltipTop.current = e.offsetY - 30;
            setTooltipText(marker?.name);
            lastName = marker?.name;
        }
    };

    // These next two lines are important! The handlers change very frequently (every parent render)
    // So copy their values into refs so as not to disturb our state/re-render (we only need the latest value when we want to fire)
    onMarkerClickRef.current = onMarkerClick;
    onMarkerHoverRef.current = onMarkerHover || defaultMarkerHover;

    if (debug && !newInstanceRef.current) {
        console.log('-----------New instance-----------');
        newInstanceRef.current = true;
    }

    if (debug) {
        console.log(modelUrl);
    }

    const getModel = () => {
        const viewer = viewerRef.current;
        const premCollection: any = viewer?.scene?.primitives;
        const lastPrem = premCollection?._primitives?.length - 1;
        let model: Cesium.Model = null;
        if (
            lastPrem &&
            premCollection._primitives[lastPrem] instanceof Cesium.Model
        ) {
            model = premCollection._primitives[lastPrem];
        }

        return model;
    };

    // INITIALIZE AND LOAD SCENE
    const init = useCallback(() => {
        if (debug) {
            console.log('**************init');
        }

        async function doLoading(entity: any) {
            setIsLoading(true);
            const viewer = viewerRef.current;
            viewer.scene.globe.show = false;
            for (let i = 0; i < 120; i++) {
                const model = getModel();
                if (model) {
                    try {
                        await model.readyPromise;
                        setIsLoading(false);
                        viewer.flyTo(entity, { duration: 0 });
                    } catch {
                        setIsLoading(undefined);
                    }
                    break;
                } else {
                    await sleep(500);
                }
            }
        }

        setIsLoading(true);
        colorsRef.current = [];
        Cesium.Ion.defaultAccessToken =
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlMzAwYmY0Zi0yZDA3LTRmNDUtOGJlNS0xOGNhZGUzNDkyYjUiLCJpZCI6NzMwNjUsImlhdCI6MTYzNjU1NzQ5MX0.EmVpMhqjpZmytOKip8KvQIuHUq93bAu2V1b2GvSOrl4';

        // Set the clock so it is daylight in San Francisco (13.00 GMT) to avoid dark unlit models
        const clock = new Cesium.Clock({
            currentTime: new JulianDate(1, 13 * 60 * 60)
        });
        viewerRef.current = new Cesium.Viewer(canvasId, {
            clockViewModel: new Cesium.ClockViewModel(clock),
            contextOptions: { webgl: { alpha: true } },
            animation: false,
            timeline: false,
            baseLayerPicker: false,
            homeButton: false,
            sceneModePicker: false,
            navigationHelpButton: false,
            geocoder: false
        });

        const viewer = viewerRef.current;
        viewer.scene.skyAtmosphere.show = false;
        viewer.scene.skyBox.destroy();
        viewer.scene.skyBox = undefined;
        viewer.scene.backgroundColor = new Cesium.Color(0, 0, 0, 0); // Transparent background
        viewer.scene.postProcessStages.fxaa.enabled = true; // Antialiasing
        viewer.scene.moon = new Cesium.Moon({
            ellipsoid: new Cesium.Ellipsoid(0, 0, 0)
        });
        viewer.fullscreenButton.container.setAttribute('style', 'display:none');
        viewer.bottomContainer.setAttribute('style', 'display:none');
        viewer.scene.screenSpaceCameraController.enableZoom = false;
        viewer.scene.screenSpaceCameraController.enableTranslate = false;

        viewer.screenSpaceEventHandler.setInputAction(function (amount) {
            const height = viewer.scene.camera.positionCartographic.height;
            amount = (Cesium.Math.sign(amount) * height) / Math.log(height);
            viewer.scene.camera.zoomIn(amount);
        }, Cesium.ScreenSpaceEventType.WHEEL);

        // Load the model in San Francisco
        if (modelUrl !== 'Globe') {
            const position = Cesium.Cartesian3.fromDegrees(
                -122.4175,
                37.655,
                0
            );
            const heading = Cesium.Math.toRadians(0);
            const pitch = 0;
            const roll = Cesium.Math.toRadians(-20);
            const hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
            const orientation = Cesium.Transforms.headingPitchRollQuaternion(
                position,
                hpr
            );

            viewer.entities.removeAll();
            const entity = viewer.entities.add({
                name: 'Model',
                position: position,
                orientation: orientation as any,
                model: { uri: modelUrl }
            });

            doLoading(entity); // Wait for it to load and fly to it
        } else {
            setIsLoading(false);
        }

        // Add the marker spheres
        if (markers) {
            const size = 80000.0;
            for (const marker of markers) {
                const c = marker.color;
                viewer.entities.add({
                    name: `${markerPrefix}${marker.name}`,
                    position: Cesium.Cartesian3.fromDegrees(
                        marker.longitude,
                        marker.latitude,
                        0
                    ),
                    ellipsoid: {
                        radii: new Cesium.Cartesian3(size, size, size),
                        material: Cesium.Color.fromBytes(
                            c.r,
                            c.g,
                            c.b,
                            c.a === undefined ? 255 : c.a
                        )
                    }
                });
            }
        }

        // SETUP LOGIC FOR onMarkerClick/onMarkerHover
        const action = (movement, callback, isClick: boolean) => {
            const pos = movement?.endPosition || movement?.position;
            if (pos && callback) {
                const pickedFeature = viewer.scene.pick(pos);
                const featureName = pickedFeature?.id?.name;
                let marker: Marker = null;

                if (
                    featureName &&
                    featureName.startsWith(markerPrefix) &&
                    markers
                ) {
                    for (const m of markers) {
                        if (featureName === markerPrefix + m.name) {
                            marker = m;
                            break;
                        }
                    }
                }

                const mesh = pickedFeature?.mesh;
                if (isClick) {
                    setTooltipText('');
                    callback(marker, mesh, { offsetX: pos.x, offsetY: pos.y });
                } else if (
                    mesh !== lastMeshRef.current ||
                    lastMarkerRef.current !== marker
                ) {
                    if (debug) {
                        console.log('mouse move');
                    }
                    callback(marker, mesh, { offsetX: pos.x, offsetY: pos.y });
                    lastMarkerRef.current = marker;
                    lastMeshRef.current = mesh;
                }
            }
        };

        viewer.screenSpaceEventHandler.setInputAction(
            (movement) => action(movement, onMarkerClickRef.current, true),
            Cesium.ScreenSpaceEventType.LEFT_CLICK
        );
        if (markers?.length) {
            viewer.screenSpaceEventHandler.setInputAction(
                (movement) => action(movement, onMarkerHoverRef.current, false),
                Cesium.ScreenSpaceEventType.MOUSE_MOVE
            );
        }

        return viewerRef.current;
    }, [canvasId, markers, modelUrl]);

    // This is really our componentDidMount/componentWillUnmount logic
    useEffect(() => {
        if (modelUrl && modelUrl !== modelUrlRef.current) {
            // Reload if modelUrl changes
            modelUrlRef.current = modelUrl;
            init();
        }

        // If this cleanup gets called with a non-empty viewer, we can destroy the viewer as the component is going away
        // This should save a lot of memory for large models
        return () => {
            if (debug) {
                console.log(
                    'init effect clean' +
                        (viewerRef.current ? ' with viewer' : ' no viewer')
                );
            }
            if (viewerRef.current) {
                if (debug) {
                    console.log('viewer dispose');
                }
                try {
                    viewerRef.current.destroy();
                } catch {
                    console.log('Failed to dispose');
                }
            }

            modelUrlRef.current = '';
            viewerRef.current = null;
        };
    }, [modelUrl, init]);

    // Handler for selectedMeshNames - select the requested meshes
    useEffect(() => {
        const meshes = selectedMeshNames || [];
        const model = getModel();
        if (model) {
            // Look for any new additions
            for (const meshName of meshes) {
                if (meshName) {
                    const mesh = model.getMesh(meshName);
                    if (mesh) {
                        const material: Cesium.ModelMaterial =
                            mesh.materials[0];
                        const blue = new Cesium.Cartesian4(
                            35.0 / 255.0,
                            203.0 / 255.0,
                            1,
                            1.0
                        );
                        if (!colorsRef.current[meshName]) {
                            const f = material.getValue('emissiveFactor');
                            colorsRef.current[meshName] = new Cesium.Cartesian4(
                                f.x,
                                f.y,
                                f.z,
                                f.w
                            );
                            material.setValue('emissiveFactor', blue);
                        }
                    }
                }
            }

            // Look for any removals
            for (const meshName in colorsRef.current) {
                if (meshName && meshes.indexOf(meshName) < 0) {
                    const mesh = model.getMesh(meshName);
                    if (mesh && colorsRef.current[meshName]) {
                        const material: Cesium.ModelMaterial =
                            mesh.materials[0];
                        material.setValue(
                            'emissiveFactor',
                            colorsRef.current[meshName]
                        );
                        colorsRef.current[meshName] = undefined;
                    }
                }
            }
        }
    }, [selectedMeshNames]);

    // This doesn't work?
    useEffect(() => {
        const resize = () => {
            if (viewerRef.current) {
                viewerRef.current.resize();
            }
        };
        window.addEventListener('resize', resize);
        return () => {
            window.removeEventListener('resize', resize);
        };
    });

    return (
        <div className="cb-sceneview-container">
            <div
                id={canvasId}
                className={
                    isLoading === true
                        ? 'cb-sceneview-canvas'
                        : 'cb-sceneview-canvas cb-sceneview-o1'
                }
            />
            {isLoading && (
                <ProgressIndicator
                    className="cb-sceneview-progressbar"
                    styles={{
                        itemDescription: {
                            color: 'white',
                            fontSize: 26,
                            marginTop: 10,
                            textAlign: 'center'
                        }
                    }}
                    description={`Loading model...`}
                    barHeight={10}
                />
            )}
            {isLoading === undefined && (
                <div className="cb-sceneview-errormessage">
                    Error loading model. Try Ctrl-F5
                </div>
            )}
            {tooltipText && (
                <div
                    className="cb-sceneview-tooltip"
                    style={{
                        top: tooltipTop.current,
                        left: tooltipLeft.current
                    }}
                    id="tooltip"
                >
                    {tooltipText}
                </div>
            )}
        </div>
    );
};
