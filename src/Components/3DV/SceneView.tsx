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
    SceneViewCallbackHandler,
    SelectedMesh
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
    markers,
    onMarkerClick,
    onMarkerHover,
    onCameraMove,
    labels,
    showMeshesOnHover,
    selectedMeshes,
    meshSelectionColor,
    meshHoverColor
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
    const cameraRef = useRef<BABYLON.ArcRotateCamera>(null);
    const lastMeshRef = useRef<BABYLON.AbstractMesh>(null);
    const lastMarkerRef = useRef<Marker>(null);
    const modelUrlRef = useRef('blank');
    const newInstanceRef = useRef(false);
    const [tooltipText, setTooltipText] = useState('');
    const tooltipLeft = useRef(0);
    const tooltipTop = useRef(0);
    const hightlightedMeshRef = useRef<SelectedMesh>(null);
    const selectedMeshesRef = useRef<SelectedMesh[]>([]);

    const hoverColor = meshHoverColor ? meshHoverColor : '#96D2FE';
    const selectionColor = meshSelectionColor ? meshSelectionColor : '#1EA0F7';

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
                createCamera();
                setIsLoading(false);
            }
        }

        function createCamera() {
            for (const mesh of sceneRef.current.meshes) {
                mesh.computeWorldMatrix(true);
            }

            if (sceneRef.current.meshes) {
                const someMeshFromTheArrayOfMeshes = sceneRef.current.meshes[0];
                someMeshFromTheArrayOfMeshes.setBoundingInfo(
                    totalBoundingInfo(sceneRef.current.meshes)
                );
                someMeshFromTheArrayOfMeshes.showBoundingBox = false;

                const es = someMeshFromTheArrayOfMeshes.getBoundingInfo()
                    .boundingBox.extendSize;
                const es_scaled = es.scale(3);
                const width = es_scaled.x;
                const height = es_scaled.y;
                const depth = es_scaled.z;

                const center = someMeshFromTheArrayOfMeshes.getBoundingInfo()
                    .boundingBox.centerWorld;

                const canvas = document.getElementById(
                    canvasId
                ) as HTMLCanvasElement;

                const camera = new BABYLON.ArcRotateCamera(
                    'camera',
                    0,
                    Math.PI / 2.5,
                    Math.max(width, height, depth),
                    center,
                    scene
                );

                cameraRef.current = camera;
                camera.attachControl(canvas, false);
            }
        }

        function totalBoundingInfo(meshes) {
            let boundingInfo = meshes[0].getBoundingInfo();
            let min = boundingInfo.boundingBox.minimumWorld;
            let max = boundingInfo.boundingBox.maximumWorld;

            for (const mesh of meshes) {
                boundingInfo = mesh.getBoundingInfo();
                min = BABYLON.Vector3.Minimize(
                    min,
                    boundingInfo.boundingBox.minimumWorld
                );
                max = BABYLON.Vector3.Maximize(
                    max,
                    boundingInfo.boundingBox.maximumWorld
                );
            }
            return new BABYLON.BoundingInfo(min, max);
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
                if (cameraRef.current) {
                    sc.render();
                }
            });
        }

        return sceneRef.current;
    }, [canvasId, modelUrl]);

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
            (markers || labels || showMeshesOnHover)
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

                if (showMeshesOnHover) {
                    if (mesh) {
                        // reset mesh color if hightlighted mesh does not match the picked mesh AND the picked mesh is not currently selected
                        if (
                            hightlightedMeshRef.current &&
                            hightlightedMeshRef.current.id !== mesh?.id
                        ) {
                            const meshToReset = scene.meshes.find(
                                (m) => m.id === hightlightedMeshRef.current.id
                            );
                            if (
                                meshToReset &&
                                !selectedMeshesRef.current.find(
                                    (m) => m.id === meshToReset.id
                                )
                            ) {
                                (meshToReset.material as any).albedoColor =
                                    hightlightedMeshRef.current.color;
                            }
                            hightlightedMeshRef.current = null;
                        } else if (!hightlightedMeshRef.current) {
                            // highlight the mesh
                            const selectedMesh = new SelectedMesh();
                            selectedMesh.id = mesh.id;
                            const m = selectedMeshesRef.current.find(
                                (m) => m.id === mesh.id
                            );
                            if (m) {
                                selectedMesh.color = m.color;
                            } else {
                                selectedMesh.color = (mesh.material as any).albedoColor;
                                (mesh.material as any).albedoColor = BABYLON.Color3.FromHexString(
                                    hoverColor
                                );
                            }
                            hightlightedMeshRef.current = selectedMesh;
                        }
                    } else if (hightlightedMeshRef.current) {
                        // reset the highlighted mesh color if no mesh is picked
                        const lastMesh = scene.meshes.find(
                            (m) => m.id === hightlightedMeshRef.current.id
                        );
                        if (lastMesh) {
                            (lastMesh.material as any).albedoColor =
                                hightlightedMeshRef.current.color;
                        }
                        hightlightedMeshRef.current = null;
                    }
                }

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
    }, [scene, markers]);

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
        if (selectedMeshes) {
            // color selected meshes
            for (const selectedMesh of selectedMeshes) {
                const mesh = sceneRef.current.meshes.find(
                    (item) => item.id === selectedMesh
                );
                // only color mesh if it isn't already colored
                if (
                    mesh &&
                    !selectedMeshesRef.current.find(
                        (m) => m.id === selectedMesh
                    )
                ) {
                    const m = new SelectedMesh();
                    m.id = mesh.id;
                    if (selectedMesh !== hightlightedMeshRef.current?.id) {
                        m.color = (mesh.material as any).albedoColor;
                    } else {
                        m.color = hightlightedMeshRef.current?.color;
                    }
                    selectedMeshesRef.current.push(m);
                    (mesh.material as any).albedoColor = BABYLON.Color3.FromHexString(
                        selectionColor
                    );
                }
            }

            // reset mesh color if not selected
            if (selectedMeshesRef.current) {
                const meshesToReset = selectedMeshesRef.current.filter(
                    (m) => !selectedMeshes.includes(m.id)
                );
                for (const meshToReset of meshesToReset) {
                    selectedMeshesRef.current = selectedMeshesRef.current.filter(
                        (m) => m !== meshToReset
                    );
                    const mesh = sceneRef.current.meshes.find(
                        (item) => item.id === meshToReset.id
                    );
                    if (mesh) {
                        if (
                            meshToReset.id === hightlightedMeshRef.current?.id
                        ) {
                            (mesh.material as any).albedoColor = BABYLON.Color3.FromHexString(
                                hoverColor
                            );
                        } else {
                            (mesh.material as any).albedoColor =
                                meshToReset.color;
                        }
                    }
                }
            }
        }
    }, [selectedMeshes]);

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
