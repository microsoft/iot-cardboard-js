// THIS CODE AND INFORMATION IS PROVIDED AS IS WITHOUT WARRANTY OF
// ANY KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING BUT NOT LIMITED TO
// THE IMPLIED WARRANTIES OF MERCHANTABILITY AND/OR FITNESS FOR A
// PARTICULAR PURPOSE.
//
// Copyright (c) Microsoft. All rights reserved
//

import * as BABYLON from 'babylonjs';
import 'babylonjs-loaders';
import * as GUI from 'babylonjs-gui';
import { ProgressIndicator } from '@fluentui/react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import './SceneView.scss';

const debug = false;

/*eslint-disable-next-line: */
// prettier-ignore
const widths = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.2796875,0.2765625,0.3546875,0.5546875,0.5546875,0.8890625,0.665625,0.190625,0.3328125,0.3328125,0.3890625,0.5828125,0.2765625,0.3328125,0.2765625,0.3015625,0.5546875,0.5546875,0.5546875,0.5546875,0.5546875,0.5546875,0.5546875,0.5546875,0.5546875,0.5546875,0.2765625,0.2765625,0.584375,0.5828125,0.584375,0.5546875,1.0140625,0.665625,0.665625,0.721875,0.721875,0.665625,0.609375,0.7765625,0.721875,0.2765625,0.5,0.665625,0.5546875,0.8328125,0.721875,0.7765625,0.665625,0.7765625,0.721875,0.665625,0.609375,0.721875,0.665625,0.94375,0.665625,0.665625,0.609375,0.2765625,0.3546875,0.2765625,0.4765625,0.5546875,0.3328125,0.5546875,0.5546875,0.5,0.5546875,0.5546875,0.2765625,0.5546875,0.5546875,0.221875,0.240625,0.5,0.221875,0.8328125,0.5546875,0.5546875,0.5546875,0.5546875,0.3328125,0.5,0.2765625,0.5546875,0.5,0.721875,0.5,0.5,0.5,0.3546875,0.259375,0.353125,0.5890625];
const avg = 0.5279276315789471;

function measureText(str: string, fontSize: number) {
    return (
        Array.from(str).reduce(
            (acc, cur) => acc + (widths[cur.charCodeAt(0)] ?? avg),
            0
        ) * fontSize
    );
}

export function UUID(): string {
    const nbr = Math.random();
    let randStr = '';
    do {
        randStr += nbr.toString(16).substr(2);
    } while (randStr.length < 30);

    // tslint:disable-next-line: no-bitwise
    return [
        randStr.substr(0, 8),
        '-',
        randStr.substr(8, 4),
        '-4',
        randStr.substr(12, 3),
        '-',
        (((nbr * 4) | 0) + 8).toString(16),
        randStr.substr(15, 3),
        '-',
        randStr.substr(18, 12)
    ].join('');
}

async function loadPromise(
    root,
    file,
    scene,
    onProgress: any,
    onError: any
): Promise<BABYLON.AssetContainer> {
    return new Promise((resolve) => {
        BABYLON.SceneLoader.LoadAssetContainer(
            root,
            file,
            scene,
            (container) => {
                resolve(container);
            },
            (e) => onProgress(e),
            (s, m, e) => onError(s, m, e)
        );
    });
}

export function convertLatLonToVector3(
    latitude: number,
    longitude: number,
    earthRadius = 50
): BABYLON.Vector3 {
    const latitude_rad = (latitude * Math.PI) / 180;
    const longitude_rad = (longitude * Math.PI) / 180;
    const x = earthRadius * Math.cos(latitude_rad) * Math.cos(longitude_rad);
    const z = earthRadius * Math.cos(latitude_rad) * Math.sin(longitude_rad);
    const y = earthRadius * Math.sin(latitude_rad);
    return new BABYLON.Vector3(x, y, z);
}

type SceneViewCallbackHandler = (
    marker: Marker,
    mesh: BABYLON.AbstractMesh,
    e: PointerEvent
) => void;

export interface SceneViewLabel {
    metric: string;
    value: number;
    meshId: string;
    color: string;
}

export class Marker {
    name: string;
    position?: BABYLON.Vector3;
    latitude?: number;
    longitude?: number;
    color: BABYLON.Color3;
    isNav?: boolean;
}

export class ChildTwin {
    name: string;
    position: string;
}

interface IProp {
    modelUrl: string;
    cameraRadius: number;
    cameraCenter?: BABYLON.Vector3;
    markers?: Marker[];
    onMarkerClick?: (
        marker: Marker,
        mesh: BABYLON.AbstractMesh,
        e: PointerEvent
    ) => void;
    onMarkerHover?: (
        marker: Marker,
        mesh: BABYLON.AbstractMesh,
        e: PointerEvent
    ) => void;
    labels?: SceneViewLabel[];
    children?: ChildTwin[];
}

let lastName = '';

export const SceneView: React.FC<IProp> = ({
    modelUrl,
    cameraRadius,
    cameraCenter,
    markers,
    onMarkerClick,
    onMarkerHover,
    labels,
    children
}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [loadProgress, setLoadProgress] = useState(0);
    const oldLabelsRef = useRef<SceneViewLabel[]>(undefined);
    const [canvasId] = useState(UUID());
    const [scene, setScene] = useState<BABYLON.Scene>(undefined);
    const onMarkerClickRef = useRef<SceneViewCallbackHandler>(null);
    const onMarkerHoverRef = useRef<SceneViewCallbackHandler>(null);
    const sceneRef = useRef<BABYLON.Scene>(null);
    const engineRef = useRef<BABYLON.Engine>(null);
    const cameraRef = useRef<BABYLON.Camera>(null);
    const lastMeshRef = useRef<BABYLON.AbstractMesh>(null);
    const lastMarkerRef = useRef<Marker>(null);
    const modelUrlRef = useRef('blank');
    const newInstanceRef = useRef(false);
    const [tooltipText, setTooltipText] = useState('');
    const tooltipLeft = useRef(0);
    const tooltipTop = useRef(0);

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

    // INITIALIZE AND LOAD SCENE
    const init = useCallback(() => {
        if (debug) {
            console.log('**************init');
        }

        async function load(root: string, file: string, sc: BABYLON.Scene) {
            let success = true;
            const assets = await loadPromise(
                root,
                file,
                sc,
                (e) => onProgress(e),
                (s, m, e) => {
                    console.log('Error loading model. Try Ctrl-F5', s, e);
                    success = false;
                    setIsLoading(undefined);
                }
            );

            if (success) {
                assets.addAllToScene();
                setIsLoading(false);
            }
        }

        function onProgress(e: BABYLON.ISceneLoaderProgressEvent) {
            if (e.total) {
                setLoadProgress(e.loaded / e.total);
            } else {
                setLoadProgress(0);
            }
        }

        // Only load scene once (componentDidMount)
        if (!sceneRef.current) {
            const canvas = document.getElementById(
                canvasId
            ) as HTMLCanvasElement; // Get the canvas element
            const engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine
            engineRef.current = engine;
            const sc = new BABYLON.Scene(engine);
            sceneRef.current = sc;
            sc.clearColor = new BABYLON.Color4(255, 255, 255, 0);
            const center = cameraCenter || new BABYLON.Vector3(0, 0, 0);
            const camera = new BABYLON.ArcRotateCamera(
                'camera',
                0,
                Math.PI / 2.5,
                cameraRadius,
                center,
                sc,
                true
            );
            cameraRef.current = camera;
            camera.attachControl(canvas, false);

            new BABYLON.HemisphericLight(
                'light',
                new BABYLON.Vector3(1, 1, 0),
                sc
            );
            new BABYLON.DirectionalLight(
                'light',
                new BABYLON.Vector3(0, -100, 0),
                sc
            );
            new BABYLON.DirectionalLight(
                'light',
                new BABYLON.Vector3(0, -200, 0),
                sc
            );
            new BABYLON.DirectionalLight(
                'light',
                new BABYLON.Vector3(0, -300, 0),
                sc
            );

            if (modelUrl) {
                const n = modelUrl.lastIndexOf('/') + 1;
                load(modelUrl.substring(0, n), modelUrl.substring(n), sc);
            }

            // Add the marker spheres
            if (markers) {
                for (const marker of markers) {
                    let sphereMaterial = new BABYLON.StandardMaterial(
                        'SphereM',
                        sc
                    );
                    sphereMaterial.diffuseColor = marker.color;
                    let sphere = BABYLON.Mesh.CreateSphere(
                        'VisibleMarker_' + marker.name,
                        16,
                        2,
                        sc
                    );
                    const position =
                        marker.position ||
                        convertLatLonToVector3(
                            marker.latitude,
                            marker.longitude
                        );
                    sphere.position = position;
                    sphere.material = sphereMaterial;

                    // Make the hit targets larger in case iPhone
                    sphereMaterial = new BABYLON.StandardMaterial(
                        'SphereM',
                        sc
                    );
                    sphereMaterial.diffuseColor = marker.color;
                    sphereMaterial.alpha = 0;
                    sphere = BABYLON.Mesh.CreateSphere(
                        'Marker_' + marker.name,
                        16,
                        4,
                        sc
                    );
                    sphere.position = position;
                    sphere.material = sphereMaterial;
                }
            }

            // Register a render loop to repeatedly render the scene
            engine.runRenderLoop(() => {
                sc.render();
            });
        }

        return sceneRef.current;
    }, [cameraCenter, cameraRadius, canvasId, markers, modelUrl]);

    // This is really our componentDidMount/componentWillUnmount stuff
    useEffect(() => {
        // If this cleanup gets called with a non-empty scene, we can destroy the scene as the component is going away
        // This should save a lot of memory for large scenes
        return () => {
            if (sceneRef.current) {
                console.log('Unmount - has scene');
                try {
                    sceneRef.current.dispose();
                    if (engineRef.current) {
                        engineRef.current.dispose();
                    }
                } catch {
                    console.log('unable to dispose scene');
                }
            }

            const resize = () => {
                engineRef.current.resize();
            };
    
            oldLabelsRef.current = null;
            sceneRef.current = null;
            window.removeEventListener('resize', resize);
        };
    }, []);

    useEffect(() => {
        if (engineRef.current) {
            const resize = () => {
                engineRef.current.resize();
            };
            window.addEventListener('resize', resize);
        }

        if (debug) {
            console.log(
                'init effect' + (scene ? ' with scene ' : ' no scene ')
            );
        }
        if (modelUrl && modelUrl !== modelUrlRef.current) {
            // Reload if modelUrl changes
            modelUrlRef.current = modelUrl;
            setScene(() => init());
        }
    }, [scene, modelUrl, init]);

    // SETUP LOGIC FOR onMarkerHover
    useEffect(() => {
        if (debug) {
            console.log('hover effect' + (scene ? ' with scene' : ' no scene'));
        }
        if (scene && onMarkerHoverRef.current && (markers || children)) {
            scene.onPointerMove = (e, p) => {
                p = scene.pick(
                    scene.pointerX,
                    scene.pointerY,
                    (mesh) => {
                        return !!mesh;
                    },
                    false,
                    cameraRef.current
                );

                const mesh: BABYLON.AbstractMesh = p?.pickedMesh;
                let marker: Marker = null;

                if (mesh?.name && p?.pickedMesh?.name.startsWith('Marker_')) {
                    for (const m of markers) {
                        if (mesh.name === 'Marker_' + m.name) {
                            marker = m;
                            break;
                        }
                    }
                }

                if (
                    mesh !== lastMeshRef.current ||
                    lastMarkerRef.current !== marker
                ) {
                    if (debug) {
                        console.log('pointer move');
                    }
                    onMarkerHoverRef.current(marker, mesh, e);
                    lastMarkerRef.current = marker;
                    lastMeshRef.current = mesh;
                }
            };
        }

        return () => {
            if (debug) {
                console.log(
                    'hover clean' + (scene ? ' with scene' : ' no scene')
                );
            }
        };
    }, [scene, markers, children]);

    // SETUP LOGIC FOR onMarkerClick
    useEffect(() => {
        let pd: BABYLON.Observer<BABYLON.PointerInfo>;
        if (debug) {
            console.log(
                'pointerDown effect' + (scene ? ' with scene' : ' no scene')
            );
        }
        if (scene && onMarkerClickRef.current) {
            const pointerDown = (e) => {
                setTooltipText('');
                const p = e.pickInfo;
                const mesh: BABYLON.AbstractMesh = p?.pickedMesh;
                let marker: Marker = null;

                if (
                    mesh?.name &&
                    p.pickedMesh.name.startsWith('Marker_') &&
                    markers
                ) {
                    for (const m of markers) {
                        if (mesh.name === 'Marker_' + m.name) {
                            marker = m;
                            break;
                        }
                    }
                }

                if (onMarkerClickRef.current) {
                    onMarkerClickRef.current(marker, mesh, e);
                }
            };

            if (scene) {
                pd = scene.onPointerObservable.add(
                    pointerDown,
                    BABYLON.PointerEventTypes.POINTERDOWN
                );
            }
        }

        return () => {
            if (debug) {
                console.log('pointerDown effect clean');
            }
            if (pd) {
                scene.onPointerObservable.remove(pd);
            }
        };
    }, [scene, markers]);

    // SETUP LOGIC FOR HANDLING GUI LABELS ON THE MODEL
    useEffect(() => {
        function labelsChanged() {
            if (labels && oldLabelsRef.current) {
                return (
                    JSON.stringify(labels) !==
                    JSON.stringify(oldLabelsRef.current)
                );
            }

            return true;
        }

        if (debug) {
            console.log(
                'labels effect' + (scene ? ' with scene' : ' no scene')
            );
        }
        if (scene && labelsChanged() && labels && !isLoading) {
            if (debug) {
                console.log('labels updating');
            }
            let advancedTexture: any = null;
            const rects: GUI.Rectangle[] = [];
            try {
                advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI(
                    'UI'
                );
                labels.forEach((item) => {
                    const targetMesh = scene?.meshes?.find(
                        (mesh) => mesh.id === item.meshId
                    );
                    if (targetMesh) {
                        if (debug) {
                            console.log('found label mesh');
                        }
                        const text1 = item.metric;
                        const text2 = item.value.toFixed(5);
                        const text = text1 + '\n\n' + text2;
                        const w = measureText(
                            text1.length > text2.length ? text1 : text2,
                            25
                        );
                        const rect = new GUI.Rectangle();
                        rect.width = w + 'px';
                        rect.height = '100px';
                        rect.cornerRadius = 10;
                        rect.color = 'white';
                        rect.thickness = 1;
                        rect.background = 'rgba(22, 27, 154, 0.5)';
                        rects.push(rect);

                        const label = new GUI.TextBlock();
                        label.color = item.color || 'white';
                        label.text = text;
                        rect.addControl(label);
                        advancedTexture.addControl(rect);
                        rect.linkWithMesh(targetMesh);
                        if (item.color) {
                            (targetMesh.material as any).albedoColor = BABYLON.Color3.FromHexString(
                                item.color
                            );
                        }
                        oldLabelsRef.current = labels;
                    }
                });
            } catch {
                console.log('unable to create labels');
            }

            return () => {
                if (debug) {
                    console.log('labels effect cleanup');
                }

                if (advancedTexture) {
                    for (const rect of rects) {
                        advancedTexture.removeControl(rect);
                    }
                    oldLabelsRef.current = undefined;
                }
            };
        }
    }, [labels, scene, isLoading]);

    return (
        <div className="sceneview-container">
            <canvas
                className={
                    isLoading === true
                        ? 'cb-sceneview-canvas'
                        : 'cb-sceneview-canvas cb-o1'
                }
                id={canvasId}
                touch-action="none"
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
                    description={`Loading model (${Math.floor(
                        loadProgress * 100
                    )}%)...`}
                    percentComplete={loadProgress}
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
