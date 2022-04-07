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
import { AbstractMesh, HighlightLayer, Tools } from 'babylonjs';
import { createBadgeGroup, getBoundingBox } from './SceneView.Utils';
import { makeMaterial, outlineMaterial, ToColor3 } from './Shaders';
import {
    DefaultViewerModeObjectColor,
    IADTBackgroundColor,
    TransparentTexture,
    ViewerModeObjectColors
} from '../../Models/Constants';
import { getProgressStyles, getSceneViewStyles } from './SceneView.styles';
import { withErrorBoundary } from '../../Models/Context/ErrorBoundary';
import { sleep } from '../AutoComplete/AutoComplete';

const debug = false;

function debugLog(s: string) {
    if (debug) {
        console.log(s);
    }
}

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

let dummyProgress = 0; // Progress doesn't work for GLBs so fake it

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
    onBadgeGroupHover,
    showMeshesOnHover,
    objectColors,
    zoomToMeshIds,
    unzoomedMeshOpacity,
    onSceneLoaded,
    getToken,
    coloredMeshItems,
    showHoverOnSelected,
    outlinedMeshitems,
    isWireframe,
    badgeGroups,
    backgroundColor
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
    const shaderMaterial = useRef<any>();
    const originalMaterials = useRef<any>();
    const meshesAreOriginal = useRef(true);
    const reflectionTexture = useRef<BABYLON.Texture>(null);
    const outlinedMeshes = useRef<BABYLON.AbstractMesh[]>([]);
    const clonedHighlightMeshes = useRef<BABYLON.AbstractMesh[]>([]);
    const highlightLayer = useRef<HighlightLayer>(null);
    const badgeGroupsRef = useRef<any[]>([]);
    const [currentObjectColor, setCurrentObjectColor] = useState(
        DefaultViewerModeObjectColor
    );
    const backgroundColorRef = useRef<IADTBackgroundColor>(null);
    const meshMap = useRef<any>(null);
    const prevZoomToIds = useRef('');
    const prevHideUnzoomedRef = useRef<number>(undefined);
    const materialCacheRef = useRef<any[]>([]);
    const pointerActive = useRef(false);

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
        debugLog('-----------New instance-----------');
        newInstanceRef.current = true;
    }

    debugLog('SceneView Render');

    // INITIALIZE AND LOAD SCENE
    const init = useCallback(() => {
        debugLog('**************init');

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

            dummyProgress = 0;
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
                createOrZoomCamera();
                advancedTextureRef.current = GUI.AdvancedDynamicTexture.CreateFullscreenUI(
                    'UI'
                );
                sortMeshesOnLoad();
                setIsLoading(false);
                engineRef.current.resize();
                if (onSceneLoaded) {
                    onSceneLoaded(sc);
                }
            }
        }

        function onProgress(e: BABYLON.ISceneLoaderProgressEvent) {
            let progress = e.total ? e.loaded / e.total : 0;
            if (!e.lengthComputable) {
                dummyProgress += dummyProgress > 0.8 ? 0.001 : 0.003;
                progress = dummyProgress > 0.99 ? 0.99 : dummyProgress;
            }
            setLoadProgress(progress);
        }

        if (!sceneRef.current) {
            const canvas = document.getElementById(
                canvasId
            ) as HTMLCanvasElement; // Get the canvas element
            const engine = new BABYLON.Engine(canvas, true, { stencil: true }); // Generate the BABYLON 3D engine
            engineRef.current = engine;
            const sc = new BABYLON.Scene(engine);
            sceneRef.current = sc;
            sc.clearColor = new BABYLON.Color4(0, 0, 0, 0);

            //This layer is a bug fix for transparency not blending with background html on certain graphic cards like in macs.
            //The texture is 99% transparent but forces the engine to blend the colors.
            const layer = new BABYLON.Layer('', '', sceneRef.current, true);
            layer.texture = BABYLON.Texture.CreateFromBase64String(
                TransparentTexture,
                'layerImg',
                sceneRef.current
            );

            hovMaterial.current = new BABYLON.StandardMaterial('hover', sc);
            hovMaterial.current.diffuseColor = BABYLON.Color3.FromHexString(
                currentObjectColor.meshHoverColor
            );

            coloredHovMaterial.current = new BABYLON.StandardMaterial(
                'colHov',
                sc
            );
            coloredHovMaterial.current.diffuseColor = BABYLON.Color3.FromHexString(
                currentObjectColor.coloredMeshHoverColor
            );

            highlightLayer.current = new BABYLON.HighlightLayer('hl1', scene, {
                blurHorizontalSize: 0.5,
                blurVerticalSize: 0.5
            });

            const light = new BABYLON.HemisphericLight(
                'light',
                new BABYLON.Vector3(1, 1, 0),
                sc
            );
            light.diffuse = new BABYLON.Color3(0.8, 0.8, 0.8);
            light.specular = new BABYLON.Color3(1, 1, 1);
            light.groundColor = new BABYLON.Color3(0.2, 0.2, 0.2);

            if (modelUrl) {
                let url = modelUrl;
                if (url === 'Globe') {
                    url =
                        'https://3dvstoragecontainer.blob.core.windows.net/3dvblobcontainer/world/World3.gltf';
                }

                const n = url.lastIndexOf('/') + 1;
                load(getToken, url.substring(0, n), url.substring(n), sc);
            }
        }

        return sceneRef.current;
    }, [canvasId, modelUrl]);

    const sortMeshesOnLoad = () => {
        for (const mesh of sceneRef.current.meshes) {
            //Set the alpha index for the meshes for alpha sorting later
            mesh.alphaIndex = 1;
        }
    };
    const createOrZoomCamera = () => {
        const zoomTo = (zoomToMeshIds || []).join(',');
        if (
            sceneRef.current?.meshes?.length &&
            (!cameraRef.current ||
                prevZoomToIds.current !== zoomTo ||
                prevHideUnzoomedRef.current !== unzoomedMeshOpacity)
        ) {
            debugLog('createOrZoomCamera');
            prevHideUnzoomedRef.current = unzoomedMeshOpacity;
            meshMap.current = cameraRef.current ? meshMap.current : {};
            for (const mesh of sceneRef.current.meshes) {
                if (!cameraRef.current && mesh.id) {
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
                const someMeshFromTheArrayOfMeshes = sceneRef.current.meshes[0];
                let meshes = sceneRef.current.meshes;
                if (zoomToMeshIds?.length) {
                    const meshList: BABYLON.AbstractMesh[] = [];
                    for (const id of zoomToMeshIds) {
                        const m = meshMap.current?.[id];
                        if (m) {
                            meshList.push(m);
                        }
                    }

                    if (meshList.length) {
                        meshes = meshList;
                    }
                }

                let bbox = getBoundingBox(meshes);
                if (!bbox) {
                    // Bad meshnames passed
                    meshes = sceneRef.current.meshes;
                    bbox = getBoundingBox(meshes);
                }

                someMeshFromTheArrayOfMeshes.setBoundingInfo(bbox);

                someMeshFromTheArrayOfMeshes.showBoundingBox = false;

                const es = someMeshFromTheArrayOfMeshes.getBoundingInfo()
                    .boundingBox.extendSize;
                const es_scaled = es.scale(
                    zoomToMeshIds && zoomToMeshIds.length < 10 ? 5 : 3
                );
                const width = es_scaled.x;
                const height = es_scaled.y;
                const depth = es_scaled.z;
                const radius = Math.max(width, height, depth);

                const center = someMeshFromTheArrayOfMeshes.getBoundingInfo()
                    .boundingBox.centerWorld;

                const canvas = document.getElementById(
                    canvasId
                ) as HTMLCanvasElement;

                // First time in after loading - create the camera
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

                    // Register a render loop to repeatedly render the scene
                    engineRef.current.runRenderLoop(() => {
                        if (cameraRef.current) {
                            sceneRef.current.render();
                        }
                    });
                } else {
                    // Here if the caller changed zoomToMeshIds - zoom the existing camera
                    // First save the current camera position
                    const positionFrom = cameraRef.current.position;
                    const targetFrom = cameraRef.current.target;
                    const radiusFrom = cameraRef.current.radius;
                    // Now move it immediately to where we want it and save the new position
                    cameraRef.current.zoomOn(meshes, true);
                    cameraRef.current.radius = radius;
                    const positionTo = cameraRef.current.position;
                    const targetTo = cameraRef.current.target;
                    const radiusTo = cameraRef.current.radius;
                    // Reset camera back to original position
                    cameraRef.current.position = positionFrom;
                    cameraRef.current.target = targetFrom;
                    // And animate to the desired position
                    const ease = new BABYLON.CubicEase();
                    ease.setEasingMode(
                        BABYLON.EasingFunction.EASINGMODE_EASEINOUT
                    );
                    BABYLON.Animation.CreateAndStartAnimation(
                        'an1',
                        cameraRef.current,
                        'position',
                        30, // FPS
                        30, // Number of frames (ie 1 second)
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
    };

    // Handle mesh zooming
    useEffect(() => {
        debugLog('Mesh zooming');
        if (!isLoading) {
            createOrZoomCamera();
        }
    }, [zoomToMeshIds, unzoomedMeshOpacity]);

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

    //Get the index of the current objectColor to use as an ID for caching
    const currentColorId = () => {
        return ViewerModeObjectColors.indexOf(currentObjectColor);
    };

    useEffect(() => {
        if (objectColors) {
            setCurrentObjectColor(objectColors);
        }
    }, [objectColors]);

    const restoreMeshMaterials = () => {
        if (sceneRef.current?.meshes?.length && !isLoading) {
            if (meshesAreOriginal.current) {
                for (const mesh of sceneRef.current.meshes) {
                    mesh.material = originalMaterials.current[mesh.id];
                }
            } else {
                for (const mesh of sceneRef.current.meshes) {
                    //Meshes with higher alphaIndex are highlight clones and should not have their material swapped
                    if (mesh.alphaIndex > 1) continue;
                    mesh.material = shaderMaterial.current;
                }
            }
        }
    };

    useEffect(() => {
        createBadgeGroups();
        return () => {
            clearBadgeGroups(false);
        };
    }, [badgeGroups, isLoading]);

    useEffect(() => {
        if (backgroundColor !== backgroundColorRef?.current) {
            backgroundColorRef.current = backgroundColor;
            clearBadgeGroups(true);
            createBadgeGroups();
        }
    }, [backgroundColor]);

    const clearBadgeGroups = (force: boolean) => {
        const groupsToRemove = [];
        badgeGroupsRef?.current.forEach((badgeGroupRef) => {
            // remove badge if group is no longer in prop
            if (
                !badgeGroups?.find((bg) => bg.id === badgeGroupRef.name) ||
                force
            ) {
                debugLog('removing badge');
                advancedTextureRef.current.removeControl(badgeGroupRef);
                groupsToRemove.push(badgeGroupRef);
            }
        });
        groupsToRemove?.forEach((group) => {
            badgeGroupsRef.current = badgeGroupsRef.current.filter(
                (bg) => bg.name !== group.name
            );
        });
    };

    const createBadgeGroups = () => {
        if (badgeGroups && advancedTextureRef.current && sceneRef.current) {
            badgeGroups.forEach((bg) => {
                // only add badge group if not already present
                if (
                    !badgeGroupsRef.current.find(
                        (badgeGroupRef) => badgeGroupRef.name === bg.id
                    )
                ) {
                    debugLog('adding badge group');
                    const badgeGroup = createBadgeGroup(
                        bg,
                        backgroundColor,
                        onBadgeGroupHover
                    );
                    advancedTextureRef.current.addControl(badgeGroup);
                    const mesh = sceneRef.current.meshes.find(
                        (m) => m.id === bg.meshId
                    );
                    badgeGroup.linkWithMesh(mesh);

                    // badges can only be linked to meshes after being added to the scene
                    // so adding a delay in making it visible so it doesn't jump
                    const waitUntilPostioned = async () => {
                        await sleep(1);
                        badgeGroup.isVisible = true;
                    };
                    waitUntilPostioned();
                    badgeGroupsRef.current.push(badgeGroup);
                }
            });
        }
    };

    // Update render mode
    useEffect(() => {
        debugLog('Render Mode Effect');
        if (sceneRef.current?.meshes?.length) {
            const currentObjectColorId = currentColorId();

            //Reset the reflection Texture
            reflectionTexture.current = null;
            if (currentObjectColor.reflectionTexture) {
                reflectionTexture.current = BABYLON.Texture.CreateFromBase64String(
                    currentObjectColor.reflectionTexture,
                    currentObjectColorId + '_reflectionTexture',
                    sceneRef.current
                );
                reflectionTexture.current.coordinatesMode = 1;
            }

            //Use the matching cached hover material or create a new one, cache it, and use it
            hovMaterial.current =
                materialCacheRef.current[
                    currentObjectColorId + currentObjectColor.meshHoverColor
                ] ||
                (materialCacheRef.current[
                    currentObjectColorId + currentObjectColor.meshHoverColor
                ] = makeMaterial(
                    'hover',
                    sceneRef.current,
                    hexToColor4(currentObjectColor.meshHoverColor),
                    hexToColor4(
                        currentObjectColor.fresnelColor ||
                            currentObjectColor.meshHoverColor
                    ),
                    reflectionTexture.current,
                    currentObjectColor.lightingStyle
                ));

            //Use the matching cached selected-hover material or create a new one, cache it, and use it
            coloredHovMaterial.current =
                materialCacheRef.current[
                    currentObjectColorId +
                        currentObjectColor.coloredMeshHoverColor
                ] ||
                (materialCacheRef.current[
                    currentObjectColorId +
                        currentObjectColor.coloredMeshHoverColor
                ] = makeMaterial(
                    'hover',
                    sceneRef.current,
                    hexToColor4(currentObjectColor.coloredMeshHoverColor),
                    hexToColor4(
                        currentObjectColor.fresnelColor ||
                            currentObjectColor.coloredMeshHoverColor
                    ),
                    reflectionTexture.current,
                    currentObjectColor.lightingStyle
                ));

            if (
                (!currentObjectColor.baseColor ||
                    !currentObjectColor.fresnelColor) &&
                !meshesAreOriginal.current
            ) {
                for (const mesh of sceneRef.current.meshes) {
                    const ignore = shouldIgnore(mesh);
                    if (!ignore) {
                        const material = originalMaterials.current[mesh.id];
                        mesh.useVertexColors =
                            currentObjectColor.lightingStyle < 1;
                        if (material) {
                            mesh.material = material;
                            mesh.material.wireframe = !!isWireframe;
                        }
                    }
                }

                hovMaterial.current.wireframe = !!isWireframe;
                coloredHovMaterial.current.wireframe = !!isWireframe;
                meshesAreOriginal.current = true;
            }

            if (
                currentObjectColor.baseColor &&
                currentObjectColor.fresnelColor
            ) {
                const baseColor = hexToColor4(currentObjectColor.baseColor);
                const fresnelColor = hexToColor4(
                    currentObjectColor.fresnelColor
                );
                const material = makeMaterial(
                    'col',
                    sceneRef.current,
                    baseColor,
                    fresnelColor,
                    reflectionTexture.current,
                    currentObjectColor.lightingStyle
                );

                shaderMaterial.current = material;
                if (
                    !!isWireframe ||
                    (currentObjectColor.baseColor &&
                        currentObjectColor.fresnelColor)
                ) {
                    for (const mesh of sceneRef.current.meshes) {
                        if (mesh?.material) {
                            const ignore = shouldIgnore(mesh);
                            if (
                                currentObjectColor.baseColor &&
                                currentObjectColor.fresnelColor &&
                                !ignore
                            ) {
                                mesh.material = shaderMaterial.current;
                                mesh.useVertexColors =
                                    currentObjectColor.lightingStyle < 1;
                                mesh.material.wireframe = isWireframe || false;
                                meshesAreOriginal.current = false;
                            }
                        }
                    }
                }

                hovMaterial.current.wireframe = !!isWireframe;
                coloredHovMaterial.current.wireframe = !!isWireframe;
            }
        }
    }, [isWireframe, isLoading, currentObjectColor]);

    // Handle isWireframe changes
    useEffect(() => {
        debugLog('isWireframe Effect');
        if (sceneRef.current?.meshes?.length) {
            for (const mesh of sceneRef.current.meshes) {
                if (mesh?.material) {
                    mesh.material.wireframe = !!isWireframe;
                }
            }

            hovMaterial.current.wireframe = !!isWireframe;
            coloredHovMaterial.current.wireframe = !!isWireframe;
        }
    }, [isWireframe, objectColors]);

    // This is really our componentDidMount/componentWillUnmount stuff
    useEffect(() => {
        debugLog('Mount');
        // If this cleanup gets called with a non-empty scene, we can destroy the scene as the component is going away
        // This should save a lot of memory for large scenes
        const canvas = document.getElementById(canvasId);
        let observer: ResizeObserver;
        if (canvas) {
            observer = new ResizeObserver(
                debounce(() => {
                    if (engineRef.current) {
                        debugLog('Resize');
                        engineRef.current.resize();
                    }
                }, 10)
            );
            observer.observe(canvas);
        }

        return () => {
            if (sceneRef.current) {
                debugLog('Unmount - has scene');

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

            originalMaterials.current = null;
            meshMap.current = null;
            materialCacheRef.current = [];
            badgeGroupsRef.current = [];
            sceneRef.current = null;
            cameraRef.current = null;
            reflectionTexture.current = null;
        };
    }, [modelUrl]);

    // Reload model if url changes
    useEffect(() => {
        debugLog('init effect' + (scene ? ' with scene ' : ' no scene '));
        if (modelUrl && modelUrl !== modelUrlRef.current) {
            // Reload if modelUrl changes
            modelUrlRef.current = modelUrl;
            setIsLoading(true);
            setScene(() => init());
        }

        return () => {
            for (const material of materialCacheRef.current) {
                sceneRef.current?.removeMaterial(material);
                material.dispose(true, true);
            }
        };
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
        debugLog('hover effect' + (scene ? ' with scene' : ' no scene'));
        let pt: BABYLON.Observer<BABYLON.PointerInfo>;
        if (scene) {
            // setting flag based on mouse down (i.e camera is being moved) to stop hover events firing at the same time
            pt = scene.onPointerObservable.add((eventData) => {
                if (eventData.type === BABYLON.PointerEventTypes.POINTERDOWN) {
                    pointerActive.current = true;
                } else if (
                    eventData.type === BABYLON.PointerEventTypes.POINTERUP
                ) {
                    pointerActive.current = false;
                }
            });
        }
        if (
            scene &&
            onMeshHoverRef.current &&
            (markers || coloredMeshItems || showMeshesOnHover)
        ) {
            scene.onPointerMove = (e, p) => {
                if (!pointerActive.current) {
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
                                const meshToReset =
                                    meshMap.current?.[
                                        highlightedMeshRef.current
                                    ];

                                if (meshToReset) {
                                    const isColored = coloredMeshItems?.find(
                                        (m) => m.meshId === meshToReset.id
                                    );
                                    meshToReset.material = isColored
                                        ? coloredMaterials.current[
                                              meshToReset.id
                                          ]
                                        : meshesAreOriginal.current
                                        ? originalMaterials.current[
                                              meshToReset.id
                                          ]
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
                                        mesh.material =
                                            coloredHovMaterial.current;
                                    }
                                } else {
                                    mesh.material = hovMaterial.current;
                                }
                            }
                        } else if (highlightedMeshRef.current) {
                            // reset the highlighted mesh color if no mesh is picked
                            const lastMesh =
                                meshMap.current?.[highlightedMeshRef.current];
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
                        debugLog('pointer move');
                        try {
                            onMeshHoverRef.current(marker, mesh, scene, e);
                        } catch {
                            console.log('Error calling hover event on scene');
                        }
                        lastMarkerRef.current = marker;
                        lastMeshRef.current = mesh;
                    }
                }
            };
        }

        return () => {
            debugLog('hover clean' + (scene ? ' with scene' : ' no scene'));
            if (pt) {
                scene.onPointerObservable.remove(pt);
            }
        };
    }, [
        scene,
        markers,
        showHoverOnSelected,
        coloredMeshItems,
        currentObjectColor
    ]);

    // SETUP LOGIC FOR onMeshClick
    useEffect(() => {
        let pt: BABYLON.Observer<BABYLON.PointerInfo>;
        debugLog('pointerTap effect' + (scene ? ' with scene' : ' no scene'));
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
                    try {
                        onMeshClickRef.current(marker, mesh, scene, e.event);
                    } catch {
                        console.log('Error calling tap event on scene');
                    }
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
            debugLog('pointerTap effect clean');
            if (pt) {
                scene.onPointerObservable.remove(pt);
            }
        };
    }, [scene, markers]);

    // Camera move handler
    useEffect(() => {
        let pt: BABYLON.Observer<BABYLON.PointerInfo>;
        debugLog('pointerMove effect' + (scene ? ' with scene' : ' no scene'));
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
            debugLog('pointerMove effect clean');
            if (pt) {
                scene.onPointerObservable.remove(pt);
            }
        };
    }, [scene]);

    // SETUP LOGIC FOR HANDLING COLORING MESHES
    useEffect(() => {
        debugLog(
            'color meshes based on coloredmeshitems prop' +
                (scene ? ' with scene' : ' no scene')
        );

        if (scene && coloredMeshItems && !isLoading) {
            if (debug) {
                console.time('coloring meshes');
            }
            try {
                for (const coloredMesh of coloredMeshItems) {
                    if (coloredMesh.meshId) {
                        const mesh: BABYLON.AbstractMesh =
                            meshMap.current?.[coloredMesh.meshId];
                        colorMesh(mesh, coloredMesh.color);
                    }
                }
            } catch {
                console.warn('unable to color mesh');
            }
            if (debug) {
                console.timeEnd('coloring meshes');
            }
        }

        return () => {
            debugLog('Mesh coloring cleanup');
            restoreMeshMaterials();
            coloredMaterials.current = [];
        };
    }, [coloredMeshItems, isLoading, isWireframe, currentObjectColor]);

    const colorMesh = (mesh: AbstractMesh, color: string) => {
        if (!mesh) {
            return;
        }

        // Creating materials is VERY expensive, so try and avoid it
        const col = color || currentObjectColor?.coloredMeshColor;
        const fresnelCol = currentObjectColor?.fresnelColor || color;

        const materialId = currentColorId() + col;

        let material = materialCacheRef.current[materialId];
        if (!material) {
            material = makeMaterial(
                'coloredMeshMaterial',
                sceneRef.current,
                hexToColor4(col),
                hexToColor4(fresnelCol),
                reflectionTexture.current,
                currentObjectColor.lightingStyle
            );

            materialCacheRef.current[materialId] = material;
            debugLog('Creating material for ' + materialId);
        }

        material.wireframe = !!isWireframe;
        mesh.material = material;
        coloredMaterials.current[mesh.id] = material;
    };

    // Handle outlinedMeshItems
    useEffect(() => {
        debugLog('Outline Mesh effect');
        if (outlinedMeshitems) {
            for (const item of outlinedMeshitems) {
                let meshToOutline: BABYLON.Mesh =
                    meshMap.current?.[item.meshId];
                if (meshToOutline) {
                    try {
                        if (currentObjectColor.lightingStyle > 0) {
                            //Alpha_ADD blended meshes do not work well with highlight layers.
                            //If we are alpha blending, we will duplicate the mesh, highlight the duplicate and overlay it to properly layer the highlight
                            const clone = meshToOutline.clone(
                                '',
                                null,
                                true,
                                false
                            );
                            clone.material = outlineMaterial(sceneRef.current);
                            clone.alphaIndex = 2;
                            clone.isPickable = false;
                            clonedHighlightMeshes.current.push(clone);
                            sceneRef.current.meshes.push(clone);
                            meshToOutline = clone;
                        }
                        highlightLayer.current.addMesh(
                            meshToOutline,
                            ToColor3(
                                hexToColor4(
                                    item.color
                                        ? item.color
                                        : currentObjectColor.outlinedMeshSelectedColor
                                )
                            )
                        );

                        outlinedMeshes.current.push(meshToOutline);
                    } catch {
                        console.error('Unable to highlight mesh');
                    }
                }
            }
        }

        return () => {
            debugLog('Outline Mesh cleanup');
            for (const mesh of outlinedMeshes.current) {
                highlightLayer.current.removeMesh(mesh as BABYLON.Mesh);
            }
            //This array keeps growing in length even though it is completely emptied during cleanup...
            //Is this best practice for resetting an array?
            outlinedMeshes.current = [];

            //If we have cloned meshes for highlight, delete them
            if (clonedHighlightMeshes.current) {
                for (const mesh of clonedHighlightMeshes.current) {
                    mesh?.dispose();
                    //Assume that all new meshes are highlight clones and decrement the scene mesh array after disposal to prevent overflow
                    if (sceneRef.current.meshes)
                        sceneRef.current.meshes.length--;
                }
                clonedHighlightMeshes.current = [];
            }
        };
    }, [outlinedMeshitems]);

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

export default withErrorBoundary(SceneView);
