import * as BABYLON from 'babylonjs';
import 'babylonjs-loaders';
import * as GUI from 'babylonjs-gui';
import { ProgressIndicator } from '@fluentui/react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import './SceneView.scss';
import { createGUID } from '../../Models/Services/Utils';
import {
    ISceneViewProp,
    Marker,
    SceneViewCallbackHandler,
    SelectedMesh
} from '../../Models/Classes/SceneView.types';
import {
    Scene_Marker,
    Scene_Visible_Marker,
    SphereMaterial
} from '../../Models/Constants/SceneView.constants';
import { Tools } from 'babylonjs';
import { makeShaderMaterial } from './Shaders';

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

export const SceneView: React.FC<ISceneViewProp> = ({
    modelUrl,
    markers,
    onMeshClick,
    onMeshHover,
    onCameraMove,
    showMeshesOnHover,
    selectedMeshIds,
    meshSelectionColor,
    meshHoverColor,
    meshSelectionHoverColor,
    isWireframe,
    meshBaseColor,
    meshFresnelColor,
    meshOpacity,
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
    const highlightedMeshRef = useRef<SelectedMesh>(null);
    const selectedMeshesRef = useRef<SelectedMesh[]>([]);
    const coloredMeshesRef = useRef<SelectedMesh[]>([]);
    const hovMaterial = useRef<any>(null);
    const selMaterial = useRef<any>(null);
    const selHovMaterial = useRef<any>(null);
    const coloredMaterials = useRef<BABYLON.StandardMaterial[]>([]);
    const shaderMaterial = useRef<BABYLON.ShaderMaterial>();
    const originalMaterials = useRef<any>();
    const meshesAreOriginal = useRef(true);

    const hoverColor = meshHoverColor || '#F3FF14';
    const selectionColor = meshSelectionColor || '#00A8F0';
    const selectedHoverColor = meshSelectionHoverColor || '#00EDD9';

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
                    sceneRef.current
                );

                camera.attachControl(canvas, false);
                cameraRef.current = camera;
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
                hoverColor
            );
            selMaterial.current = new BABYLON.StandardMaterial('selected', sc);
            selMaterial.current.diffuseColor = BABYLON.Color3.FromHexString(
                selectionColor
            );

            selHovMaterial.current = new BABYLON.StandardMaterial('selhov', sc);
            selHovMaterial.current.diffuseColor = BABYLON.Color3.FromHexString(
                selectedHoverColor
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
            ignore = !!coloredMeshItems.find((mi) => mi.meshId === mesh.id);
        }

        if (!ignore && selectedMeshIds) {
            ignore = !!selectedMeshIds.find((id) => id === mesh.id);
        }
        return ignore;
    };

    // Update render mode
    useEffect(() => {
        if (sceneRef.current?.meshes?.length) {
            if (
                (!meshBaseColor || !meshFresnelColor) &&
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
                selMaterial.current.alpha = 1;
                selHovMaterial.current.alpha = 1;
                hovMaterial.current.wireframe = !!isWireframe;
                selMaterial.current.wireframe = !!isWireframe;
                selHovMaterial.current.wireframe = !!isWireframe;
                meshesAreOriginal.current = true;
            }

            if (meshBaseColor && meshFresnelColor) {
                const baseColor = new BABYLON.Color4(
                    meshBaseColor.r,
                    meshBaseColor.g,
                    meshBaseColor.b,
                    meshBaseColor.a
                );
                const fresnelColor = new BABYLON.Color4(
                    meshFresnelColor.r,
                    meshFresnelColor.g,
                    meshFresnelColor.b,
                    meshFresnelColor.a
                );
                const material = makeShaderMaterial(
                    sceneRef.current,
                    baseColor,
                    fresnelColor,
                    meshOpacity
                );

                shaderMaterial.current = material;
                if (!!isWireframe || (meshBaseColor && meshFresnelColor)) {
                    for (const mesh of sceneRef.current.meshes) {
                        if (mesh?.material) {
                            const ignore = shouldIgnore(mesh);
                            if (meshBaseColor && meshFresnelColor && !ignore) {
                                mesh.material = shaderMaterial.current;
                                mesh.material.wireframe = isWireframe || false;
                                meshesAreOriginal.current = false;
                            }
                        }
                    }
                }

                if (meshBaseColor && meshFresnelColor) {
                    hovMaterial.current.alpha = 0.5;
                    selMaterial.current.alpha = 0.5;
                    selHovMaterial.current.alpha = 0.5;
                } else {
                    hovMaterial.current.alpha = 1;
                    selMaterial.current.alpha = 1;
                    selHovMaterial.current.alpha = 1;
                }
                hovMaterial.current.wireframe = !!isWireframe;
                selMaterial.current.wireframe = !!isWireframe;
                selHovMaterial.current.wireframe = !!isWireframe;
            }
        }
    }, [meshBaseColor, meshFresnelColor]);

    // Handle isWireframe changes
    useEffect(() => {
        if (sceneRef.current?.meshes?.length) {
            for (const mesh of sceneRef.current.meshes) {
                if (mesh?.material) {
                    mesh.material.wireframe = !!isWireframe;
                }
            }

            hovMaterial.current.wireframe = !!isWireframe;
            selMaterial.current.wireframe = !!isWireframe;
            selHovMaterial.current.wireframe = !!isWireframe;
        }
    }, [isWireframe]);

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

            sceneRef.current = null;
            cameraRef.current = null;
            window.removeEventListener('resize', resize);
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
                sphereMaterial.diffuseColor = BABYLON.Color3.FromInts(
                    marker.color.r,
                    marker.color.g,
                    marker.color.b
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
                    marker.color.r,
                    marker.color.g,
                    marker.color.b
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

                // const mesh: BABYLON.AbstractMesh = p?.pickedMesh;
                // let marker: Marker = null;

                //     if (showMeshesOnHover) {
                //         if (mesh?.id) {
                //             // reset mesh color if hightlighted mesh does not match the picked mesh AND the picked mesh is not currently selected
                //             if (
                //                 highlightedMeshRef.current &&
                //                 highlightedMeshRef.current.id !== mesh.id
                //             ) {
                //                 const meshToReset = scene.meshes.find(
                //                     (m) => m.id === highlightedMeshRef.current.id
                //                 );

                //                 if (meshToReset) {
                //                     const isSelected = selectedMeshesRef.current.find(
                //                         (m) => m.id === meshToReset.id
                //                     );
                //                     meshToReset.material = isSelected
                //                         ? selMaterial.current
                //                         : highlightedMeshRef.current.material;
                //                 }

                //                 highlightedMeshRef.current = null;
                //             } else if (!highlightedMeshRef.current) {
                //                 // highlight the mesh
                //                 let selectedMesh: SelectedMesh;
                //                 const selMesh = selectedMeshesRef.current.find(
                //                     (m) => m.id === mesh.id
                //                 );
                //                 // If it is selected, get its original color, not its current color
                //                 if (selMesh) {
                //                     selectedMesh = {
                //                         id: mesh.id,
                //                         material: selMesh.material
                //                     };
                //                     if (showHoverOnSelected) {
                //                         mesh.material = selHovMaterial.current;
                //                     }
                //                 } else {
                //                     selectedMesh = {
                //                         id: mesh.id,
                //                         material: mesh.material
                //                     };
                //                     mesh.material = hovMaterial.current;
                //                 }
                //                 highlightedMeshRef.current = selectedMesh;
                //             }
                //         } else if (highlightedMeshRef.current) {
                //             // reset the highlighted mesh color if no mesh is picked
                //             const lastMesh = scene.meshes.find(
                //                 (m) => m.id === highlightedMeshRef.current.id
                //             );
                //             if (lastMesh) {
                //                 const isSelected = selectedMeshesRef.current.find(
                //                     (m) => m.id === lastMesh.id
                //                 );
                //                 lastMesh.material = isSelected
                //                     ? selMaterial.current
                //                     : highlightedMeshRef.current.material;
                //             }
                //             highlightedMeshRef.current = null;
                //         }
                //     }

                //     if (
                //         mesh?.name &&
                //         p?.pickedMesh?.name.startsWith(Scene_Marker)
                //     ) {
                //         for (const m of markers) {
                //             if (mesh.name === `${Scene_Marker}${m.name}`) {
                //                 marker = m;
                //                 break;
                //             }
                //         }
                //     }

                //     if (
                //         mesh !== lastMeshRef.current ||
                //         lastMarkerRef.current !== marker
                //     ) {
                //         if (debug) {
                //             console.log('pointer move');
                //         }
                //         onMeshHoverRef.current(marker, mesh, scene, e);
                //         lastMarkerRef.current = marker;
                //         lastMeshRef.current = mesh;
                //     }
            };
        }

        return () => {
            if (debug) {
                console.log(
                    'hover clean' + (scene ? ' with scene' : ' no scene')
                );
            }
        };
    }, [scene, markers, showHoverOnSelected]);

    // SETUP LOGIC FOR onMeshClick
    useEffect(() => {
        let pt: BABYLON.Observer<BABYLON.PointerInfo>;
        if (debug) {
            console.log(
                'pointerTap effect' + (scene ? ' with scene' : ' no scene')
            );
        }
        if (scene && onMeshClickRef.current) {
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

    // Color selected meshes
    useEffect(() => {
        if (selectedMeshIds) {
            for (const selectedMeshId of selectedMeshIds) {
                const mesh = sceneRef.current.meshes.find(
                    (item) => item.id === selectedMeshId
                );
                if (mesh) {
                    // only color mesh if it isn't already colored
                    if (
                        !selectedMeshesRef.current.find(
                            (m) => m.id === selectedMeshId
                        )
                    ) {
                        let m: SelectedMesh;
                        if (selectedMeshId !== highlightedMeshRef.current?.id) {
                            m = { id: mesh.id, material: mesh.material };
                        } else {
                            m = {
                                id: mesh.id,
                                material: highlightedMeshRef.current?.material
                            };
                        }
                        selectedMeshesRef.current.push(m);
                        mesh.material = selMaterial.current;
                    }
                }
            }

            // reset mesh color if not selected
            if (selectedMeshesRef.current) {
                const meshesToReset = selectedMeshesRef.current.filter(
                    (m) => !selectedMeshIds.includes(m.id)
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
                            meshToReset.id === highlightedMeshRef.current?.id &&
                            showHoverOnSelected
                        ) {
                            mesh.material = hovMaterial.current;
                        } else {
                            mesh.material = meshToReset.material;
                        }
                    }
                }
            }
        }
    }, [selectedMeshIds]);

    // Camera move handler
    useEffect(() => {
        let pt: BABYLON.Observer<BABYLON.PointerInfo>;
        if (debug) {
            console.log(
                'pointerMove effect' + (scene ? ' with scene' : ' no scene')
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
                            const material = new BABYLON.StandardMaterial(
                                'coloredMeshMaterial',
                                sceneRef.current
                            );
                            if (coloredMesh.color) {
                                material.diffuseColor = BABYLON.Color3.FromHexString(
                                    coloredMesh.color
                                );
                            } else {
                                material.diffuseColor = BABYLON.Color3.FromHexString(
                                    selectionColor
                                );
                            }

                            material.wireframe = !!isWireframe;

                            if (meshBaseColor && meshFresnelColor) {
                                material.alpha = 0.5;
                            }

                            coloredMeshesRef.current.push({
                                id: mesh.id,
                                material: mesh.material
                            });
                            mesh.material = material;
                            coloredMaterials.current.push(material);
                        }
                    }
                }
            } catch {
                console.log('unable to color mesh');
            }
        }

        return () => {
            for (const coloredMesh of coloredMeshesRef.current) {
                if (sceneRef.current) {
                    const mesh = sceneRef.current.meshes.find(
                        (item) => item.id === coloredMesh.id
                    );

                    mesh.material = coloredMesh.material;
                }

                for (const material of coloredMaterials.current) {
                    sceneRef.current?.removeMaterial(material);
                    material.dispose(true, true);
                }
            }

            coloredMeshesRef.current = [];
            coloredMaterials.current = [];
        };
    }, [coloredMeshItems, isLoading, meshBaseColor]);

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
