import * as BABYLON from 'babylonjs';
import 'babylonjs-loaders';
import * as GUI from 'babylonjs-gui';
import { ProgressIndicator, useTheme } from '@fluentui/react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import './SceneView.scss';
import { createGUID } from '../../Models/Services/Utils';
import {
    ISceneViewProp,
    Marker,
    SceneViewCallbackHandler
} from '../../Models/Classes/SceneView.types';
import {
    Scene_Marker,
    Scene_Visible_Marker,
    SphereMaterial
} from '../../Models/Constants/SceneView.constants';
import { AbstractMesh, Tools } from 'babylonjs';
import { makeShaderMaterial } from './Shaders';
import { RenderModes } from '../../Models/Constants';
import { totalBoundingInfo } from './SceneView.Utils';
import { getProgressStyles, getSceneViewStyles } from './SceneView.styles';

const debug = false;

function debounce(func: any, timeout = 300) {
    let timer: any;
    return () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func();
        }, timeout);
    };
}

function hexToColor4(hex: string): BABYLON.Color4 {
    if (!hex) {
        return undefined;
    }

    // remove invalid characters
    hex = hex.replace(/[^0-9a-fA-F]/g, '');
    if (hex.length < 5) {
        // 3, 4 characters double-up
        hex = hex
            .split('')
            .map((s) => s + s)
            .join('');
    }

    // parse pairs of two
    const rgba = hex
        .match(/.{1,2}/g)
        .map((s) => parseFloat((parseInt(s, 16) / 255).toString()));
    // alpha code between 0 & 1 / default 1
    rgba[3] = rgba.length > 3 ? rgba[3] : 1;
    const color = new BABYLON.Color4(rgba[0], rgba[1], rgba[2], rgba[3]);
    return color;
}

async function loadPromise(
    root: string,
    file: string,
    scene: BABYLON.Scene,
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

function convertLatLonToVector3(
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

let lastName = '';

const SceneView: React.FC<ISceneViewProp> = ({
    modelUrl,
    markers,
    onMeshClick,
    onMeshHover,
    onCameraMove,
    showMeshesOnHover,
    renderMode,
    zoomToMeshIds,
    unzoomedMeshOpacity,
    onSceneLoaded,
    getToken,
    coloredMeshItems,
    showHoverOnSelected
}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [loadProgress, setLoadProgress] = useState(0);
    const [canvasId] = useState(createGUID());
    const [scene, setScene] = useState<BABYLON.Scene>(undefined);
    const onMeshClickRef = useRef<SceneViewCallbackHandler>(null);
    const onMeshHoverRef = useRef<SceneViewCallbackHandler>(null);
    const onCameraMoveRef = useRef<SceneViewCallbackHandler>(null);
    const advancedTextureRef = useRef<GUI.AdvancedDynamicTexture>(undefined);
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
    const highlightedMeshRef = useRef<string>(null);
    const hovMaterial = useRef<any>(null);
    const coloredHovMaterial = useRef<any>(null);
    const coloredMaterials = useRef<any>([]);
    const shaderMaterial = useRef<BABYLON.ShaderMaterial>();
    const originalMaterials = useRef<any>();
    const meshesAreOriginal = useRef(true);
    const [currentRenderMode, setCurrentRenderMode] = useState(RenderModes[0]);
    const meshMap = useRef<any>(null);
    const prevZoomToIds = useRef('');
    const prevHideUnzoomedRef = useRef<number>(undefined);

    const defaultMeshHover = (
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
    onMeshClickRef.current = onMeshClick;
    onCameraMoveRef.current = onCameraMove;
    onMeshHoverRef.current = onMeshHover || defaultMeshHover;
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

        //TODO: load this private blob by getting token and using proxy for blob service REST API
        async function load(
            getToken: () => Promise<string>,
            root: string,
            file: string,
            sc: BABYLON.Scene
        ) {
            let success = true;
            let token = '';
            if (getToken) {
                token = await getToken();
            }

            if (token) {
                Tools.CustomRequestHeaders.Authorization = 'Bearer ' + token;
                Tools.CustomRequestHeaders['x-ms-version'] = '2017-11-09';
                Tools.UseCustomRequestHeaders = true;
            } else {
                delete Tools.CustomRequestHeaders.Authorization;
                delete Tools.CustomRequestHeaders['x-ms-version'];
                Tools.UseCustomRequestHeaders = false;
            }

            const assets = await loadPromise(
                root,
                file,
                sc,
                (e: any) => onProgress(e),
                (s: any, m: any, e: any) => {
                    console.error('Error loading model. Try Ctrl-F5', s, e);
                    success = false;
                    setIsLoading(undefined);
                }
            );

            if (success) {
                assets.addAllToScene();
                advancedTextureRef.current = GUI.AdvancedDynamicTexture.CreateFullscreenUI(
                    'UI'
                );
                setIsLoading(false);
                engineRef.current.resize();
                if (onSceneLoaded) {
                    onSceneLoaded(sc);
                }
            }
        }

        function onProgress(e: BABYLON.ISceneLoaderProgressEvent) {
            if (e.total) {
                setLoadProgress(e.loaded / e.total);
            } else {
                setLoadProgress(0);
            }
        }

        if (!sceneRef.current) {
            const canvas = document.getElementById(
                canvasId
            ) as HTMLCanvasElement; // Get the canvas element
            const engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine
            engineRef.current = engine;
            const sc = new BABYLON.Scene(engine);
            sceneRef.current = sc;
            sc.clearColor = new BABYLON.Color4(0, 0, 0, 0);
            hovMaterial.current = new BABYLON.StandardMaterial('hover', sc);
            hovMaterial.current.diffuseColor = BABYLON.Color3.FromHexString(
                currentRenderMode.meshHoverColor
            );

            coloredHovMaterial.current = new BABYLON.StandardMaterial(
                'colHov',
                sc
            );
            coloredHovMaterial.current.diffuseColor = BABYLON.Color3.FromHexString(
                currentRenderMode.coloredMeshHoverColor
            );

            new BABYLON.HemisphericLight(
                'light',
                new BABYLON.Vector3(1, 1, 0),
                sc
            );

            if (modelUrl) {
                let url = modelUrl;
                if (url === 'Globe') {
                    url =
                        'https://3dvstoragecontainer.blob.core.windows.net/3dvblobcontainer/world/World3.gltf';
                }

                const n = url.lastIndexOf('/') + 1;
                load(getToken, url.substring(0, n), url.substring(n), sc);
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

    // Handle mesh zooming
    useEffect(() => {
        function createOrZoomCamera() {
            const zoomTo = (zoomToMeshIds || []).join(',');
            if (
                !isLoading &&
                sceneRef.current?.meshes?.length &&
                (!cameraRef.current ||
                    prevZoomToIds.current !== zoomTo ||
                    prevHideUnzoomedRef.current !== unzoomedMeshOpacity)
            ) {
                prevHideUnzoomedRef.current = unzoomedMeshOpacity;
                meshMap.current = {};
                for (const mesh of sceneRef.current.meshes) {
                    if (mesh.id) {
                        meshMap.current[mesh.id] = mesh;
                    }

                    mesh.computeWorldMatrix(true);
                    mesh.visibility =
                        unzoomedMeshOpacity !== undefined &&
                        zoomToMeshIds?.length &&
                        !zoomToMeshIds.includes(mesh.id)
                            ? unzoomedMeshOpacity
                            : 1;
                }

                // Only zoom if the Ids actually changed, not just a re-render
                if (!cameraRef.current || prevZoomToIds.current !== zoomTo) {
                    prevZoomToIds.current = zoomTo;
                    const someMeshFromTheArrayOfMeshes =
                        sceneRef.current.meshes[0];
                    let meshes = sceneRef.current.meshes;
                    if (zoomToMeshIds?.length) {
                        const meshList: BABYLON.AbstractMesh[] = [];
                        for (const id of zoomToMeshIds) {
                            const m = meshMap.current[id];
                            if (m) {
                                meshList.push(m);
                            }
                        }

                        meshes = meshList;
                    }

                    someMeshFromTheArrayOfMeshes.setBoundingInfo(
                        totalBoundingInfo(meshes)
                    );

                    someMeshFromTheArrayOfMeshes.showBoundingBox = false;

                    const es = someMeshFromTheArrayOfMeshes.getBoundingInfo()
                        .boundingBox.extendSize;
                    const es_scaled = es.scale(zoomToMeshIds?.length ? 5 : 3);
                    const width = es_scaled.x;
                    const height = es_scaled.y;
                    const depth = es_scaled.z;
                    const radius = Math.max(width, height, depth);

                    const center = someMeshFromTheArrayOfMeshes.getBoundingInfo()
                        .boundingBox.centerWorld;

                    const canvas = document.getElementById(
                        canvasId
                    ) as HTMLCanvasElement;

                    if (!cameraRef.current) {
                        const camera = new BABYLON.ArcRotateCamera(
                            'camera',
                            0,
                            Math.PI / 2.5,
                            radius,
                            center,
                            sceneRef.current
                        );

                        camera.attachControl(canvas, false);
                        cameraRef.current = camera;
                        cameraRef.current.zoomOn(meshes, true);
                        cameraRef.current.radius = radius;
                    } else {
                        const positionFrom = cameraRef.current.position;
                        const targetFrom = cameraRef.current.target;
                        const radiusFrom = cameraRef.current.radius;
                        cameraRef.current.zoomOn(meshes, true);
                        cameraRef.current.radius = radius;
                        const positionTo = cameraRef.current.position;
                        const targetTo = cameraRef.current.target;
                        const radiusTo = cameraRef.current.radius;
                        cameraRef.current.position = positionFrom;
                        cameraRef.current.target = targetFrom;
                        const ease = new BABYLON.CubicEase();
                        ease.setEasingMode(
                            BABYLON.EasingFunction.EASINGMODE_EASEINOUT
                        );
                        BABYLON.Animation.CreateAndStartAnimation(
                            'an1',
                            cameraRef.current,
                            'position',
                            30,
                            30,
                            positionFrom,
                            positionTo,
                            BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT,
                            ease
                        );
                        BABYLON.Animation.CreateAndStartAnimation(
                            'an2',
                            cameraRef.current,
                            'target',
                            30,
                            30,
                            targetFrom,
                            targetTo,
                            BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT,
                            ease
                        );
                        BABYLON.Animation.CreateAndStartAnimation(
                            'an3',
                            cameraRef.current,
                            'radius',
                            30,
                            30,
                            radiusFrom,
                            radiusTo,
                            BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT,
                            ease
                        );
                    }
                }
            }
        }

        createOrZoomCamera();
    }, [isLoading, zoomToMeshIds, unzoomedMeshOpacity]);

    if (!originalMaterials.current && sceneRef.current?.meshes?.length) {
        originalMaterials.current = {};
        for (const mesh of sceneRef.current.meshes) {
            if (mesh.material) {
                originalMaterials.current[mesh.id] = mesh.material;
            }
        }
    }

    const shouldIgnore = (mesh: BABYLON.AbstractMesh) => {
        let ignore = false;
        if (coloredMeshItems) {
            ignore = !!coloredMeshItems?.find((mi) => mi.meshId === mesh.id);
        }

        return ignore;
    };

    useEffect(() => {
        if (renderMode) {
            setCurrentRenderMode(renderMode);
        }
    }, [renderMode]);

    const restoreMeshMaterials = () => {
        if (sceneRef.current?.meshes?.length && !isLoading) {
            if (meshesAreOriginal.current) {
                for (const mesh of sceneRef.current.meshes) {
                    mesh.material = originalMaterials.current[mesh.id];
                }
            } else {
                for (const mesh of sceneRef.current.meshes) {
                    mesh.material = shaderMaterial.current;
                }
            }
        }
    };

    // Update render mode
    useEffect(() => {
        if (sceneRef.current?.meshes?.length) {
            hovMaterial.current.diffuseColor = BABYLON.Color3.FromHexString(
                currentRenderMode.meshHoverColor
            );

            coloredHovMaterial.current.diffuseColor = BABYLON.Color3.FromHexString(
                currentRenderMode.coloredMeshHoverColor
            );

            if (
                (!currentRenderMode.baseColor ||
                    !currentRenderMode.fresnelColor) &&
                !meshesAreOriginal.current
            ) {
                for (const mesh of sceneRef.current.meshes) {
                    const ignore = shouldIgnore(mesh);
                    if (!ignore) {
                        const material = originalMaterials.current[mesh.id];
                        if (material) {
                            mesh.material = material;
                        }
                    }
                }

                hovMaterial.current.alpha = 1;
                coloredHovMaterial.current.alpha = 1;
                hovMaterial.current.wireframe = !!currentRenderMode.isWireframe;
                coloredHovMaterial.current.wireframe = !!currentRenderMode.isWireframe;
                meshesAreOriginal.current = true;
            }

            if (currentRenderMode.baseColor && currentRenderMode.fresnelColor) {
                const baseColor = hexToColor4(currentRenderMode.baseColor);
                const fresnelColor = hexToColor4(
                    currentRenderMode.fresnelColor
                );
                const material = makeShaderMaterial(
                    sceneRef.current,
                    baseColor,
                    fresnelColor,
                    currentRenderMode.opacity
                );

                shaderMaterial.current = material;
                if (
                    !!currentRenderMode.isWireframe ||
                    (currentRenderMode.baseColor &&
                        currentRenderMode.fresnelColor)
                ) {
                    for (const mesh of sceneRef.current.meshes) {
                        if (mesh?.material) {
                            const ignore = shouldIgnore(mesh);
                            if (
                                currentRenderMode.baseColor &&
                                currentRenderMode.fresnelColor &&
                                !ignore
                            ) {
                                mesh.material = shaderMaterial.current;
                                mesh.material.wireframe =
                                    currentRenderMode.isWireframe || false;
                                meshesAreOriginal.current = false;
                            }
                        }
                    }
                }

                if (
                    currentRenderMode.baseColor &&
                    currentRenderMode.fresnelColor
                ) {
                    hovMaterial.current.alpha = 0.5;
                    coloredHovMaterial.current.alpha = 0.5;
                } else {
                    hovMaterial.current.alpha = 1;
                    coloredHovMaterial.current.alpha = 1;
                }
                hovMaterial.current.wireframe = !!currentRenderMode.isWireframe;
                coloredHovMaterial.current.wireframe = !!currentRenderMode.isWireframe;
            }
        }
    }, [currentRenderMode, isLoading]);

    // Handle isWireframe changes
    useEffect(() => {
        if (sceneRef.current?.meshes?.length) {
            for (const mesh of sceneRef.current.meshes) {
                if (mesh?.material) {
                    mesh.material.wireframe = !!currentRenderMode.isWireframe;
                }
            }

            hovMaterial.current.wireframe = !!currentRenderMode.isWireframe;
            coloredHovMaterial.current.wireframe = !!currentRenderMode.isWireframe;
        }
    }, [currentRenderMode.isWireframe]);

    // This is really our componentDidMount/componentWillUnmount stuff
    useEffect(() => {
        // If this cleanup gets called with a non-empty scene, we can destroy the scene as the component is going away
        // This should save a lot of memory for large scenes
        const canvas = document.getElementById(canvasId);
        let observer: ResizeObserver;
        if (canvas) {
            observer = new ResizeObserver(
                debounce(() => {
                    if (engineRef.current) {
                        engineRef.current.resize();
                    }
                }, 10)
            );
            observer.observe(canvas);
        }

        return () => {
            if (sceneRef.current) {
                if (debug) {
                    console.log('Unmount - has scene');
                }

                if (observer) {
                    observer.disconnect();
                }

                try {
                    sceneRef.current.dispose();
                    if (engineRef.current) {
                        engineRef.current.dispose();
                    }
                } catch {
                    console.warn('unable to dispose scene');
                }
            }

            sceneRef.current = null;
            cameraRef.current = null;
        };
    }, [modelUrl]);

    // Reload model if url changes
    useEffect(() => {
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

    // Add the marker spheres
    useEffect(() => {
        const spheres: BABYLON.Mesh[] = [];
        if (markers && sceneRef.current) {
            for (const marker of markers) {
                let sphereMaterial = new BABYLON.StandardMaterial(
                    SphereMaterial,
                    sceneRef.current
                );
                const rgba = hexToColor4(marker.color);
                sphereMaterial.diffuseColor = BABYLON.Color3.FromInts(
                    rgba.r * 255,
                    rgba.g * 255,
                    rgba.b * 255
                );
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
                sphereMaterial.diffuseColor = BABYLON.Color3.FromInts(
                    rgba.r * 255,
                    rgba.g * 255,
                    rgba.b * 255
                );
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
    }, [markers, modelUrl]);

    // SETUP LOGIC FOR onMeshHover
    useEffect(() => {
        if (debug) {
            console.log('hover effect' + (scene ? ' with scene' : ' no scene'));
        }
        if (
            scene &&
            onMeshHoverRef.current &&
            (markers || coloredMeshItems || showMeshesOnHover)
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
                    if (mesh?.id) {
                        // reset mesh color if hightlighted mesh does not match the picked mesh AND the picked mesh is not currently selected
                        if (
                            highlightedMeshRef.current &&
                            highlightedMeshRef.current !== mesh.id
                        ) {
                            const meshToReset = scene.meshes.find(
                                (m) => m.id === highlightedMeshRef.current
                            );

                            if (meshToReset) {
                                const isColored = coloredMeshItems?.find(
                                    (m) => m.meshId === meshToReset.id
                                );
                                meshToReset.material = isColored
                                    ? coloredMaterials.current[meshToReset.id]
                                    : meshesAreOriginal.current
                                    ? originalMaterials.current[meshToReset.id]
                                    : shaderMaterial.current;
                            }

                            highlightedMeshRef.current = null;
                        } else if (!highlightedMeshRef.current) {
                            // highlight the mesh
                            const isColored = coloredMeshItems?.find(
                                (m) => m.meshId === mesh.id
                            );
                            highlightedMeshRef.current = mesh.id;

                            // If it is selected, get its original color, not its current color
                            if (isColored) {
                                if (showHoverOnSelected) {
                                    mesh.material = coloredHovMaterial.current;
                                }
                            } else {
                                mesh.material = hovMaterial.current;
                            }
                        }
                    } else if (highlightedMeshRef.current) {
                        // reset the highlighted mesh color if no mesh is picked
                        const lastMesh = scene.meshes.find(
                            (m) => m.id === highlightedMeshRef.current
                        );
                        if (lastMesh) {
                            const isColored = coloredMeshItems?.find(
                                (m) => m.meshId === lastMesh.id
                            );

                            lastMesh.material = isColored
                                ? coloredMaterials.current[lastMesh.id]
                                : meshesAreOriginal.current
                                ? originalMaterials.current[lastMesh.id]
                                : shaderMaterial.current;
                        }
                        highlightedMeshRef.current = null;
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
                    onMeshHoverRef.current(marker, mesh, scene, e);
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
    }, [
        scene,
        markers,
        showHoverOnSelected,
        coloredMeshItems,
        currentRenderMode
    ]);

    // SETUP LOGIC FOR onMeshClick
    useEffect(() => {
        let pt: BABYLON.Observer<BABYLON.PointerInfo>;
        if (debug) {
            console.log(
                'pointerTap effect' + (scene ? ' with scene' : ' no scene')
            );
        }
        if (scene && onMeshClickRef.current) {
            const pointerTap = (e: any) => {
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

                if (onMeshClickRef.current) {
                    onMeshClickRef.current(marker, mesh, scene, e.event);
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

    // Camera move handler
    useEffect(() => {
        let pt: BABYLON.Observer<BABYLON.PointerInfo>;
        if (debug) {
            console.log(
                'pointerMove effect' + (scene ? ' with scene' : ' no scene')
            );
        }
        if (scene && onCameraMoveRef.current) {
            const cameraMove = (e: any) => {
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

    // SETUP LOGIC FOR HANDLING COLORING MESHES
    useEffect(() => {
        if (debug) {
            console.log(
                'color meshes based on coloredmeshitems prop' +
                    (scene ? ' with scene' : ' no scene')
            );
        }
        if (scene && coloredMeshItems && !isLoading) {
            if (debug) {
                console.log('coloring meshes');
            }

            try {
                for (const coloredMesh of coloredMeshItems) {
                    if (coloredMesh.meshId) {
                        const mesh: BABYLON.AbstractMesh = scene?.meshes?.find(
                            (mesh) => mesh.id === coloredMesh.meshId
                        );

                        if (mesh) {
                            colorMesh(mesh, coloredMesh.color);
                        }
                    }
                }
            } catch {
                console.warn('unable to color mesh');
            }
        }

        return () => {
            restoreMeshMaterials();
            for (const material of coloredMaterials.current) {
                sceneRef.current?.removeMaterial(material);
                material.dispose(true, true);
            }

            coloredMaterials.current = [];
        };
    }, [coloredMeshItems, isLoading, currentRenderMode]);

    const colorMesh = (mesh: AbstractMesh, color: string) => {
        const material = new BABYLON.StandardMaterial(
            'coloredMeshMaterial',
            sceneRef.current
        );
        if (color) {
            material.diffuseColor = BABYLON.Color3.FromHexString(color);
        } else {
            material.diffuseColor = BABYLON.Color3.FromHexString(
                currentRenderMode.coloredMeshColor
            );
        }

        material.wireframe = !!currentRenderMode.isWireframe;

        if (currentRenderMode.baseColor && currentRenderMode.fresnelColor) {
            material.alpha = 0.5;
        }

        mesh.material = material;
        coloredMaterials.current[mesh.id] = material;
    };

    const theme = useTheme();
    const customStyles = getSceneViewStyles(theme);
    return (
        <div className={customStyles.root}>
            <canvas
                className={
                    isLoading
                        ? customStyles.canvas
                        : `${customStyles.canvasVisible} ${customStyles.canvas}`
                }
                id={canvasId}
                touch-action="none"
            />
            {isLoading && (
                <ProgressIndicator
                    styles={getProgressStyles(theme)}
                    description={`Loading model (${Math.floor(
                        loadProgress * 100
                    )}%)...`}
                    percentComplete={loadProgress}
                    barHeight={10}
                />
            )}
            {isLoading === undefined && (
                <div className={customStyles.errorMessage}>
                    Error loading model. Try Ctrl-F5
                </div>
            )}
            {tooltipText && (
                <div
                    className={customStyles.globeTooltip}
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

export default SceneView;
