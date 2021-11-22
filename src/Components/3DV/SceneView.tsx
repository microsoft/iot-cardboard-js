import * as BABYLON from 'babylonjs';
import 'babylonjs-loaders';
import * as GUI from 'babylonjs-gui';
import { ProgressIndicator } from '@fluentui/react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import './SceneView.scss';
import {
    convertLatLonToVector3,
    measureText,
    createGUID
} from '../../Models/Services/Utils';
import {
    ISceneViewProp,
    SceneViewLabel,
    Marker,
    SceneViewCallbackHandler
} from '../../Models/Classes/SceneView.types';
import {
    Scene_Marker,
    Scene_Visible_Marker,
    SphereMaterial
} from '../../Models/Constants/SceneView.constants';

const debug = false;
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

let lastName = '';

export const SceneView: React.FC<ISceneViewProp> = ({
    modelUrl,
    cameraRadius,
    cameraCenter,
    markers,
    onMarkerClick,
    onMarkerHover,
    onCameraMove,
    labels,
    children
}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [loadProgress, setLoadProgress] = useState(0);
    const oldLabelsRef = useRef<SceneViewLabel[]>(undefined);
    const [canvasId] = useState(createGUID());
    const [scene, setScene] = useState<BABYLON.Scene>(undefined);
    const onMarkerClickRef = useRef<SceneViewCallbackHandler>(null);
    const onMarkerHoverRef = useRef<SceneViewCallbackHandler>(null);
    const onCameraMoveRef = useRef<SceneViewCallbackHandler>(null);
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

    const defaultMarkerHover = (
        marker: Marker,
        mesh: any,
        scene: BABYLON.Scene,
        e: any
    ) => {
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
    onCameraMoveRef.current = onCameraMove;
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

            // Register a render loop to repeatedly render the scene
            engine.runRenderLoop(() => {
                sc.render();
            });
        }

        return sceneRef.current;
    }, [cameraCenter, cameraRadius, canvasId, modelUrl]);

    // This is really our componentDidMount/componentWillUnmount stuff
    useEffect(() => {
        // If this cleanup gets called with a non-empty scene, we can destroy the scene as the component is going away
        // This should save a lot of memory for large scenes
        return () => {
            if (sceneRef.current) {
                if (debug) {
                    console.log('Unmount - has scene');
                }

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

    useEffect(() => {
        // Add the marker spheres
        const spheres: BABYLON.Mesh[] = [];
        if (markers && sceneRef.current) {
            for (const marker of markers) {
                let sphereMaterial = new BABYLON.StandardMaterial(
                    SphereMaterial,
                    sceneRef.current
                );
                sphereMaterial.diffuseColor = marker.color;
                let sphere = BABYLON.Mesh.CreateSphere(
                    `${Scene_Visible_Marker}${marker.name}`,
                    16,
                    2,
                    sceneRef.current
                );
                const position =
                    marker.position ||
                    convertLatLonToVector3(marker.latitude, marker.longitude);
                sphere.position = position;
                sphere.material = sphereMaterial;
                spheres.push(sphere);

                // Make the hit targets larger in case iPhone
                sphereMaterial = new BABYLON.StandardMaterial(
                    SphereMaterial,
                    sceneRef.current
                );
                sphereMaterial.diffuseColor = marker.color;
                sphereMaterial.alpha = 0;
                sphere = BABYLON.Mesh.CreateSphere(
                    `${Scene_Marker}${marker.name}`,
                    16,
                    4,
                    sceneRef.current
                );
                sphere.position = position;
                sphere.material = sphereMaterial;
                spheres.push(sphere);
            }
        }

        return () => {
            for (const sphere of spheres) {
                sceneRef.current?.removeMesh(sphere);
                sphere.dispose(true, true);
            }
        };
    }, [markers]);

    // SETUP LOGIC FOR onMarkerHover
    useEffect(() => {
        if (debug) {
            console.log('hover effect' + (scene ? ' with scene' : ' no scene'));
        }
        if (
            scene &&
            onMarkerHoverRef.current &&
            (markers || children || labels)
        ) {
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

                if (
                    mesh?.name &&
                    p?.pickedMesh?.name.startsWith(Scene_Marker)
                ) {
                    for (const m of markers) {
                        if (mesh.name === `${Scene_Marker}${m.name}`) {
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
                    onMarkerHoverRef.current(marker, mesh, scene, e);
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
        let pt: BABYLON.Observer<BABYLON.PointerInfo>;
        if (debug) {
            console.log(
                'pointerTap effect' + (scene ? ' with scene' : ' no scene')
            );
        }
        if (scene && onMarkerClickRef.current) {
            const pointerTap = (e) => {
                setTooltipText('');
                const p = e.pickInfo;
                const mesh: BABYLON.AbstractMesh = p?.pickedMesh;
                let marker: Marker = null;

                if (
                    mesh?.name &&
                    p.pickedMesh.name.startsWith(Scene_Marker) &&
                    markers
                ) {
                    for (const m of markers) {
                        if (mesh.name === `${Scene_Marker}${m.name}`) {
                            marker = m;
                            break;
                        }
                    }
                }

                if (onMarkerClickRef.current) {
                    onMarkerClickRef.current(marker, mesh, scene, e);
                }
            };

            if (scene) {
                pt = scene.onPointerObservable.add(
                    pointerTap,
                    BABYLON.PointerEventTypes.POINTERTAP
                );
            }
        }

        return () => {
            if (debug) {
                console.log('pointerTap effect clean');
            }
            if (pt) {
                scene.onPointerObservable.remove(pt);
            }
        };
    }, [scene, markers]);

    useEffect(() => {
        let pt: BABYLON.Observer<BABYLON.PointerInfo>;
        if (debug) {
            console.log(
                'pointerTap effect' + (scene ? ' with scene' : ' no scene')
            );
        }
        if (scene && onCameraMoveRef.current) {
            const cameraMove = (e) => {
                if (onCameraMoveRef.current) {
                    onCameraMoveRef.current(null, null, scene, e);
                }
            };

            if (scene) {
                pt = scene.onPointerObservable.add(
                    cameraMove,
                    BABYLON.PointerEventTypes.POINTERMOVE
                );
            }
        }

        return () => {
            if (debug) {
                console.log('pointerMove effect clean');
            }
            if (pt) {
                scene.onPointerObservable.remove(pt);
            }
        };
    }, [scene]);

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
                        const text = `${text1}\n\n${text2}`;
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
                        // rect.addControl(label);
                        // advancedTexture.addControl(rect);
                        // rect.linkWithMesh(targetMesh);
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
        <div className="cb-sceneview-container">
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
