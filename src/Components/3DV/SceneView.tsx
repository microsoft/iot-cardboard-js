import * as BABYLON from '@babylonjs/core/Legacy/legacy';
import '@babylonjs/loaders';
import * as GUI from '@babylonjs/gui';
import { ProgressIndicator, useTheme } from '@fluentui/react';
import React, {
    forwardRef,
    useCallback,
    useEffect,
    useImperativeHandle,
    useRef,
    useState
} from 'react';
import './SceneView.scss';
import {
    createGUID,
    getDebugLogger,
    hexToColor4
} from '../../Models/Services/Utils';
import {
    ICameraPosition,
    ISceneViewProps,
    ColoredMeshGroup,
    Marker,
    SceneViewCallbackHandler
} from '../../Models/Classes/SceneView.types';
import {
    CameraZoomMultiplier,
    Scene_Marker,
    SphereMaterial
} from '../../Models/Constants/SceneView.constants';
import { AbstractMesh, HighlightLayer, Tools } from '@babylonjs/core';
import {
    convertLatLonToVector3,
    createBadgeGroup,
    elementsOverlap,
    getBoundingBox,
    getCameraPosition,
    getMarkerPosition,
    removeGroupedItems
} from './SceneView.Utils';
import {
    makeMaterial,
    outlineMaterial,
    ToColor3,
    SetWireframe
} from './Shaders';
import {
    CameraInteraction,
    DefaultViewerModeObjectColor,
    globeUrl,
    IADTBackgroundColor,
    TransparentTexture,
    ViewerModeObjectColors
} from '../../Models/Constants';
import { getProgressStyles, getSceneViewStyles } from './SceneView.styles';
import { withErrorBoundary } from '../../Models/Context/ErrorBoundary';
import { sleep } from '../AutoComplete/AutoComplete';
import { ModelGroupLabel } from '../ModelGroupLabel/ModelGroupLabel';
import { MarkersPlaceholder } from './Internal/MarkersPlaceholder';
import { Markers } from './Internal/Markers';

const debugLogging = false;
const debugLog = getDebugLogger('SceneView', debugLogging);

function debounce(func: any, timeout = 300) {
    let timer: any;
    return () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func();
        }, timeout);
    };
}

let dummyProgress = 0; // Progress doesn't work for GLBs so fake it

const getModifiedTime = (url): Promise<string> => {
    const promise = new Promise<string>((resolve) => {
        const headers = new Headers();
        headers.append('Range', 'bytes=1-2');
        headers.append('x-ms-version', '2017-11-09');
        if (Tools.CustomRequestHeaders.Authorization) {
            headers.append(
                'Authorization',
                Tools.CustomRequestHeaders.Authorization
            );
        }

        // HEAD can give a CORS error
        fetch(url, { method: 'GET', headers: headers })
            .then((response) => {
                const dt = new Date(response.headers.get('Last-Modified'));
                if (
                    dt.toString() === 'Invalid Date' ||
                    dt.toISOString() === '1970-01-01T00:00:00.000Z'
                ) {
                    resolve('');
                }
                resolve(dt.toISOString());
            })
            .catch(() => {
                resolve('');
            });
    });
    return promise;
};

async function loadPromise(
    root: string,
    filename: string,
    engine: BABYLON.Engine,
    onProgress: (event: BABYLON.ISceneLoaderProgressEvent) => void,
    onError: (scene: BABYLON.Scene, message: string, exception?: any) => void
): Promise<BABYLON.Scene> {
    try {
        let mod = await getModifiedTime(root + filename);
        mod = mod ? '?' + mod : '';
        return new Promise((resolve) => {
            BABYLON.Database.IDBStorageEnabled = true;
            engine.disableManifestCheck = true;
            BABYLON.SceneLoader.ShowLoadingScreen = false;
            BABYLON.SceneLoader.Load(
                root,
                filename + mod,
                engine,
                (scene) => {
                    resolve(scene);
                },
                (e) => onProgress(e),
                (s, m, e) => onError(s, m, e)
            );
        });
    } catch (e) {
        console.log(e);
        onError(null, e.message, e);
    }
}

function SceneView(props: ISceneViewProps, ref) {
    const {
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
        cameraPosition,
        coloredMeshItems,
        showHoverOnSelected,
        outlinedMeshitems,
        isWireframe,
        badgeGroups,
        backgroundColor,
        cameraInteractionType
    } = props;
    const [isLoading, setIsLoading] = useState(true);
    const [loadProgress, setLoadProgress] = useState(0);
    const [canvasId] = useState(createGUID());
    const [scene, setScene] = useState<BABYLON.Scene>(undefined);
    const onMeshClickRef = useRef<SceneViewCallbackHandler>(null);
    const onMeshHoverRef = useRef<SceneViewCallbackHandler>(null);
    const onCameraMoveRef = useRef<(position: ICameraPosition) => void>(null);
    const advancedTextureRef = useRef<GUI.AdvancedDynamicTexture>(undefined);
    const sceneRef = useRef<BABYLON.Scene>(null);
    const engineRef = useRef<BABYLON.Engine>(null);
    const cameraRef = useRef<BABYLON.ArcRotateCamera>(null);
    const lastMeshRef = useRef<BABYLON.AbstractMesh>(null);
    const modelUrlRef = useRef('blank');
    const newInstanceRef = useRef(false);
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
    const lastCameraPositionOnMouseMoveRef = useRef('');
    const initialCameraRadiusRef = useRef(0);
    const zoomedCameraRadiusRef = useRef(0);
    const zoomedMeshesRef = useRef([]);
    const lastCameraPositionRef = useRef('');

    const [markersAndPositions, setMarkersAndPositions] = useState<
        { marker: Marker; left: number; top: number }[]
    >([]);

    // These next two lines are important! The handlers change very frequently (every parent render)
    // So copy their values into refs so as not to disturb our state/re-render (we only need the latest value when we want to fire)
    onMeshClickRef.current = onMeshClick;
    onCameraMoveRef.current = onCameraMove;
    onMeshHoverRef.current = onMeshHover;
    if (debugLogging && !newInstanceRef.current) {
        debugLog('debug', 'debug', '-----------New instance-----------');
        newInstanceRef.current = true;
    }

    debugLog('debug', 'debug', 'SceneView Render');
    const url = modelUrl === 'Globe' ? globeUrl : modelUrl;

    const sortMeshesOnLoad = () => {
        for (const mesh of sceneRef.current.meshes) {
            //Set the alpha index for the meshes for alpha sorting later
            mesh.alphaIndex = 1;
        }
    };

    useEffect(() => {
        const pos = JSON.stringify(cameraPosition || {});
        if (
            pos !== lastCameraPositionRef.current &&
            cameraRef.current &&
            cameraPosition
        ) {
            lastCameraPositionRef.current = pos;
            cameraRef.current.position = cameraPosition.position;
            cameraRef.current.target = cameraPosition.target;
            cameraRef.current.radius = cameraPosition.radius;
        }
        //
    }, [cameraPosition, isLoading]);

    const createOrZoomCamera = useCallback(
        (meshIds?: string[]) => {
            const zoomMeshIds = meshIds || zoomToMeshIds;
            const zoomTo = (zoomMeshIds || []).join(',');
            // Only zoom if the Ids actually changed, not just a re-render or mesh ids have been passed to this function
            const shouldZoom =
                meshIds?.length > 0 || prevZoomToIds.current !== zoomTo;
            if (
                sceneRef.current?.meshes?.length &&
                (!cameraRef.current ||
                    shouldZoom ||
                    prevHideUnzoomedRef.current !== unzoomedMeshOpacity)
            ) {
                debugLog('debug', 'debug', 'createOrZoomCamera');
                prevHideUnzoomedRef.current = unzoomedMeshOpacity;
                meshMap.current = cameraRef.current ? meshMap.current : {};
                for (const mesh of sceneRef.current.meshes) {
                    if (!cameraRef.current && mesh.id) {
                        meshMap.current[mesh.id] = mesh;
                    }

                    mesh.computeWorldMatrix(true);
                    mesh.visibility =
                        unzoomedMeshOpacity !== undefined &&
                        zoomMeshIds?.length &&
                        !zoomMeshIds.includes(mesh.id)
                            ? unzoomedMeshOpacity
                            : 1;
                }

                if (!cameraRef.current || shouldZoom) {
                    prevZoomToIds.current = zoomTo;
                    const someMeshFromTheArrayOfMeshes =
                        sceneRef.current.meshes[0];
                    let meshes = sceneRef.current.meshes;
                    if (zoomMeshIds?.length) {
                        const meshList: BABYLON.AbstractMesh[] = [];
                        for (const id of zoomMeshIds) {
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

                    zoomedMeshesRef.current = meshes;
                    someMeshFromTheArrayOfMeshes.setBoundingInfo(bbox);
                    someMeshFromTheArrayOfMeshes.showBoundingBox = false;

                    const es = someMeshFromTheArrayOfMeshes.getBoundingInfo()
                        .boundingBox.extendSize;
                    const es_scaled = es.scale(
                        zoomMeshIds && zoomMeshIds.length < 10 ? 5 : 3
                    );
                    const width = es_scaled.x;
                    const height = es_scaled.y;
                    const depth = es_scaled.z;
                    let radius = Math.max(width, height, depth);

                    const center = someMeshFromTheArrayOfMeshes.getBoundingInfo()
                        .boundingBox.centerWorld;

                    const canvas = document.getElementById(
                        canvasId
                    ) as HTMLCanvasElement;

                    // First time in after loading - create the camera
                    if (!cameraRef.current) {
                        initialCameraRadiusRef.current = radius;
                        const camera = new BABYLON.ArcRotateCamera(
                            'camera',
                            0,
                            Math.PI / 2.5,
                            radius,
                            center,
                            sceneRef.current
                        );

                        camera.attachControl(canvas, false);
                        camera.lowerRadiusLimit = 0;
                        cameraRef.current = camera;
                        cameraRef.current.zoomOn(meshes, true);
                        cameraRef.current.radius = radius;
                        cameraRef.current.wheelPrecision =
                            (3 * 40) / bbox.boundingSphere.radius;

                        // Register a render loop to repeatedly render the scene
                        engineRef.current.runRenderLoop(() => {
                            if (cameraRef.current) {
                                sceneRef.current.render();

                                // Update FPS counter
                                const fps = document.getElementById('FPS');
                                fps.innerHTML =
                                    'FPS: ' +
                                    engineRef.current.getFps().toFixed();
                            }
                        });
                    } else {
                        // ensure if zoom to mesh ids are set we return to the original radius
                        if (!zoomMeshIds?.length) {
                            radius = initialCameraRadiusRef.current;
                        }
                        zoomedCameraRadiusRef.current = radius;
                        // Here if the caller changed zoomToMeshIds - zoom the existing camera
                        zoomCamera(radius, meshes, 30);
                    }
                }
            }
        },
        [canvasId, unzoomedMeshOpacity, zoomToMeshIds]
    );

    // Handle mesh zooming
    useEffect(() => {
        debugLog('debug', 'debug', 'Mesh zooming');
        if (!isLoading) {
            createOrZoomCamera();
        }
    }, [zoomToMeshIds, unzoomedMeshOpacity, isLoading, createOrZoomCamera]);

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
                    if (mesh.alphaIndex <= 1) {
                        mesh.material = shaderMaterial.current;
                    }
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

    useEffect(() => {
        if (cameraInteractionType && cameraRef.current) {
            switch (cameraInteractionType) {
                case CameraInteraction.Pan:
                    cameraRef.current._panningMouseButton = 0;
                    break;
                case CameraInteraction.Rotate:
                    cameraRef.current._panningMouseButton = 2;
                    break;
                default:
                    break;
            }
        }
    }, [cameraInteractionType, isLoading]);

    useImperativeHandle(ref, () => ({
        zoomCamera: (zoom: boolean) => {
            if (cameraRef.current) {
                if (zoom) {
                    zoomCamera(
                        cameraRef.current.radius - CameraZoomMultiplier,
                        zoomedMeshesRef.current,
                        5,
                        true
                    );
                } else {
                    zoomCamera(
                        cameraRef.current.radius + CameraZoomMultiplier,
                        zoomedMeshesRef.current,
                        5,
                        true
                    );
                }
            }
        },
        resetCamera: (meshIds: string[]) => {
            if (meshIds?.length) {
                createOrZoomCamera(meshIds);
            } else {
                zoomCamera(
                    initialCameraRadiusRef.current,
                    sceneRef.current.meshes,
                    30
                );
            }
        }
    }));

    const zoomCamera = (
        radius: number,
        meshes: AbstractMesh[],
        frames: number,
        zoomOnly?: boolean
    ) => {
        const positionFrom = cameraRef.current.position;
        const targetFrom = cameraRef.current.target;
        const radiusFrom = cameraRef.current.radius;
        // Now move it immediately to where we want it and save the new position
        cameraRef.current.zoomOn(meshes, true);
        const positionTo = cameraRef.current.position;
        const targetTo = cameraRef.current.target;
        const radiusTo = radius;
        // Reset camera back to original position
        cameraRef.current.position = positionFrom;
        cameraRef.current.target = targetFrom;
        const ease = new BABYLON.CubicEase();
        ease.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
        if (!zoomOnly) {
            BABYLON.Animation.CreateAndStartAnimation(
                'an1',
                cameraRef.current,
                'position',
                30,
                frames,
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
                frames,
                targetFrom,
                targetTo,
                BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT,
                ease
            );
        }
        BABYLON.Animation.CreateAndStartAnimation(
            'an3',
            cameraRef.current,
            'radius',
            30,
            frames,
            radiusFrom,
            radiusTo,
            BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT,
            ease
        );
    };

    const clearBadgeGroups = (force: boolean) => {
        debugLog('debug', 'clearBadgeGroups');
        const groupsToRemove = [];
        badgeGroupsRef?.current.forEach((badgeGroupRef) => {
            // remove badge if group is no longer in prop
            if (
                !badgeGroups?.find((bg) => bg.id === badgeGroupRef.name) ||
                force
            ) {
                debugLog('debug', 'removing badge');
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
            debugLog('debug', 'createBadgeGroups');
            badgeGroups.forEach((bg) => {
                const mesh = sceneRef.current.meshes.find(
                    (m) => m.id === bg.meshId
                );
                // only add badge group if not already present and mesh exists
                if (
                    !badgeGroupsRef.current.find(
                        (badgeGroupRef) => badgeGroupRef.name === bg.id
                    ) &&
                    mesh
                ) {
                    debugLog('debug', 'adding badge group');
                    const badgeGroup = createBadgeGroup(
                        bg,
                        backgroundColor,
                        onBadgeGroupHover
                    );
                    advancedTextureRef.current.addControl(badgeGroup);
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
        debugLog('debug', 'Render Mode Effect');
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
                    currentObjectColor.lightingStyle,
                    backgroundColorRef.current.objectLuminanceRatio
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
                    currentObjectColor.lightingStyle,
                    backgroundColorRef.current.objectLuminanceRatio
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
                            SetWireframe(mesh.material, !!isWireframe);
                        }
                    }
                }

                SetWireframe(hovMaterial.current, !!isWireframe);
                SetWireframe(coloredHovMaterial.current, !!isWireframe);
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
                    currentObjectColor.lightingStyle,
                    backgroundColorRef.current.objectLuminanceRatio
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
                                SetWireframe(
                                    mesh.material,
                                    isWireframe || false
                                );
                                meshesAreOriginal.current = false;
                            }
                        }
                    }
                }

                SetWireframe(hovMaterial.current, !!isWireframe);
                SetWireframe(
                    coloredHovMaterial.current.wireframe,
                    !!isWireframe
                );
            }
        }
    }, [isWireframe, isLoading, currentObjectColor]);

    // Handle isWireframe changes
    useEffect(() => {
        debugLog('debug', 'isWireframe Effect');
        if (sceneRef.current?.meshes?.length) {
            for (const mesh of sceneRef.current.meshes) {
                if (mesh?.material) {
                    SetWireframe(mesh.material, !!isWireframe);
                }
            }

            SetWireframe(hovMaterial.current, !!isWireframe);
            SetWireframe(coloredHovMaterial.current, !!isWireframe);
        }
    }, [isWireframe, objectColors]);

    // This is really our componentDidMount/componentWillUnmount stuff
    useEffect(() => {
        debugLog('debug', 'Mount');
        // If this cleanup gets called with a non-empty scene, we can destroy the scene as the component is going away
        // This should save a lot of memory for large scenes
        const canvas = document.getElementById(canvasId);
        let observer: ResizeObserver;
        if (canvas) {
            observer = new ResizeObserver(
                debounce(() => {
                    if (engineRef.current) {
                        debugLog('debug', 'Resize');
                        engineRef.current.resize();
                        createMarkersWithPosition();
                    }
                }, 10)
            );
            observer.observe(canvas);
        }

        return () => {
            if (sceneRef.current) {
                debugLog('debug', 'Unmount - has scene');

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

    // INITIALIZE AND LOAD SCENE
    const init = useCallback(() => {
        debugLog('debug', '**************init');

        //TODO: load this private blob by getting token and using proxy for blob service REST API
        async function load(
            getToken: () => Promise<string>,
            root: string,
            file: string
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
            setLoadProgress(0);

            const sc = await loadPromise(
                root,
                file,
                engineRef.current,
                (e: any) => onProgress(e),
                (s: any, m: any, e: any) => {
                    console.error('Error loading model. Try Ctrl-F5', s, e);
                    success = false;
                    setIsLoading(undefined);
                }
            );

            if (success) {
                sceneRef.current = sc;
                createOrZoomCamera();
                advancedTextureRef.current = GUI.AdvancedDynamicTexture.CreateFullscreenUI(
                    'UI'
                );

                sortMeshesOnLoad();

                sceneRef.current.clearColor = new BABYLON.Color4(0, 0, 0, 0);

                //This layer is a bug fix for transparency not blending with background html on certain graphic cards like in macs.
                //The texture is 99% transparent but forces the engine to blend the colors.
                const layer = new BABYLON.Layer('', '', sceneRef.current, true);
                layer.texture = BABYLON.Texture.CreateFromBase64String(
                    TransparentTexture,
                    'layerImg',
                    sceneRef.current
                );

                hovMaterial.current = new BABYLON.StandardMaterial(
                    'hover',
                    sceneRef.current
                );
                hovMaterial.current.diffuseColor = BABYLON.Color3.FromHexString(
                    currentObjectColor.meshHoverColor
                );

                coloredHovMaterial.current = new BABYLON.StandardMaterial(
                    'colHov',
                    sceneRef.current
                );
                coloredHovMaterial.current.diffuseColor = BABYLON.Color3.FromHexString(
                    currentObjectColor.coloredMeshHoverColor
                );

                highlightLayer.current = new BABYLON.HighlightLayer(
                    'hl1',
                    sceneRef.current,
                    {
                        isStroke: true,
                        mainTextureRatio: 2,
                        blurHorizontalSize: 0.4,
                        blurVerticalSize: 0.4
                    }
                );

                const light = new BABYLON.HemisphericLight(
                    'light',
                    new BABYLON.Vector3(1, 1, 0),
                    sceneRef.current
                );
                light.diffuse = new BABYLON.Color3(0.8, 0.8, 0.8);
                light.specular = new BABYLON.Color3(1, 1, 1);
                light.groundColor = new BABYLON.Color3(0.2, 0.2, 0.2);

                setScene(sceneRef.current);
                setIsLoading(false);
                engineRef.current.resize();
                if (onSceneLoaded) {
                    onSceneLoaded(sceneRef.current);
                }

                const ssao = new BABYLON.SSAO2RenderingPipeline(
                    'ssao',
                    sceneRef.current,
                    {
                        ssaoRatio: 1, // Ratio of the SSAO post-process, in a lower resolution
                        blurRatio: 1 // Ratio of the combine post-process (combines the SSAO and the scene)
                    }
                );
                ssao.radius = 8;
                ssao.totalStrength = 0.9;
                ssao.expensiveBlur = true;
                ssao.samples = 16;
                ssao.maxZ = 100;
                sceneRef.current.postProcessRenderPipelineManager.attachCamerasToRenderPipeline(
                    'ssao',
                    cameraRef.current
                );

                const defaultPipeline = new BABYLON.DefaultRenderingPipeline(
                    'default',
                    true,
                    sceneRef.current,
                    [cameraRef.current]
                );
                defaultPipeline.fxaaEnabled = true;
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
            if (modelUrl) {
                const n = url.lastIndexOf('/') + 1;
                load(getToken, url.substring(0, n), url.substring(n));
            }
        }

        return sceneRef.current;
    }, [
        canvasId,
        createOrZoomCamera,
        currentObjectColor.coloredMeshHoverColor,
        currentObjectColor.meshHoverColor,
        getToken,
        modelUrl,
        onSceneLoaded,
        url
    ]);

    // Reload model if url changes
    useEffect(() => {
        debugLog(
            'debug',
            'init effect' + (scene ? ' with scene ' : ' no scene ')
        );
        if (modelUrl && modelUrl !== modelUrlRef.current) {
            // Reload if modelUrl changes
            modelUrlRef.current = modelUrl;
            setIsLoading(true);
            init();
        }

        return () => {
            for (const material of materialCacheRef.current) {
                sceneRef.current?.removeMaterial(material);
                material.dispose(true, true);
            }
            materialCacheRef.current = [];
        };
    }, [modelUrl, init]);

    // Add spheres for tracking markers
    useEffect(() => {
        const spheres: BABYLON.Mesh[] = [];
        let cm: BABYLON.Observer<BABYLON.Scene>;
        if (markers && sceneRef.current) {
            for (const marker of markers) {
                const position =
                    marker.position ||
                    convertLatLonToVector3(marker.latitude, marker.longitude);
                const sphereMaterial = new BABYLON.StandardMaterial(
                    SphereMaterial,
                    sceneRef.current
                );
                sphereMaterial.alpha = 0;
                const sphere = BABYLON.Mesh.CreateSphere(
                    `${Scene_Marker}${marker.name}`,
                    16,
                    1,
                    sceneRef.current
                );
                sphere.position = position;
                sphere.material = sphereMaterial;
                spheres.push(sphere);
            }
        }

        // ensure scene is loaded and rendered before we add markers.
        // It needs to be rendered so we can calculate position and occulsion of markers
        if (!isLoading && sceneRef.current) {
            sceneRef.current.render(); // Marker globes may not have rendered yet
            if (markers) {
                cm = sceneRef.current.onAfterRenderObservable.add(function () {
                    // Only do marker work if camera has actually moved
                    const pos = JSON.stringify(
                        getCameraPosition(cameraRef.current)
                    );

                    if (pos != lastCameraPositionOnMouseMoveRef.current) {
                        lastCameraPositionOnMouseMoveRef.current = pos;
                        createMarkersWithPosition();
                    }
                });
            }
        }

        return () => {
            for (const sphere of spheres) {
                sceneRef.current?.removeMesh(sphere);
                sphere.dispose(true, true);
            }

            if (cm) {
                sceneRef.current?.onAfterRenderObservable?.remove(cm);
            }
        };
    }, [markers, modelUrl, isLoading]);

    const createMarkersWithPosition = useCallback(() => {
        const markersAndPositions: {
            marker: Marker;
            top: number;
            left: number;
        }[] = [];
        if (markers) {
            markers.forEach((marker) => {
                const position = getMarkerPosition(
                    marker,
                    meshMap.current,
                    sceneRef.current,
                    cameraRef.current,
                    engineRef.current
                );
                if (position) {
                    const markerToRenderUIElement = document.getElementById(
                        marker.id
                    );
                    const posLeft =
                        position?.left -
                        markerToRenderUIElement.clientWidth / 2;

                    const posTop =
                        position?.top -
                        markerToRenderUIElement.clientHeight / 2;
                    //create first group
                    if (markersAndPositions.length === 0) {
                        marker.GroupedUIElement = null;
                        markersAndPositions.push({
                            marker: marker,
                            left: posLeft,
                            top: posTop
                        });
                    } else {
                        const element = markersAndPositions.find((m) =>
                            elementsOverlap(m, markerToRenderUIElement, {
                                left: posLeft,
                                top: posTop
                            })
                        );

                        // add to existing group
                        if (element) {
                            const groupItems =
                                element.marker.GroupedUIElement?.props
                                    ?.groupItems || [];

                            if (!groupItems.length) {
                                groupItems.push({
                                    label: element.marker.name,
                                    id: element.marker.scene?.id,
                                    onItemClick:
                                        element.marker.UIElement?.props
                                            ?.onLabelClick
                                });
                            }

                            if (
                                !groupItems.find(
                                    (item) => item.label === marker.name
                                )
                            ) {
                                groupItems.push({
                                    label: marker.name,
                                    id: marker?.scene?.id,
                                    onItemClick:
                                        marker?.UIElement?.props?.onLabelClick
                                });
                            }

                            const groupedUIElement = (
                                <ModelGroupLabel
                                    label={groupItems.length}
                                    groupItems={groupItems}
                                />
                            );
                            if (
                                !element.marker.UIElement?.props?.groupItems
                                    ?.length
                            ) {
                                element.left = position?.left - 20;
                                element.top = position?.top - 20;
                            }
                            element.marker.GroupedUIElement = groupedUIElement;
                        } else {
                            removeGroupedItems(markersAndPositions, marker);
                            // create new group
                            marker.GroupedUIElement = null;
                            markersAndPositions.push({
                                marker: marker,
                                left: posLeft,
                                top: posTop
                            });
                        }
                    }
                } else {
                    removeGroupedItems(markersAndPositions, marker);
                }
            });

            setMarkersAndPositions(markersAndPositions);
        }
    }, [markers]);

    // SETUP LOGIC FOR onMeshHover
    useEffect(() => {
        debugLog(
            'debug',
            'hover effect' + (scene ? ' with scene' : ' no scene')
        );
        let pt: BABYLON.Observer<BABYLON.PointerInfo>;
        if (scene) {
            // setting flag based on mouse down (i.e camera is being moved) to stop hover events firing at the same time
            pt = scene.onPointerObservable.add((eventData) => {
                if (eventData.type === BABYLON.PointerEventTypes.POINTERDOWN) {
                    pointerActive.current = true;
                    // update panningSensibility based on current zoom level
                    cameraRef.current.panningSensibility =
                        (8 /
                            (cameraRef.current.radius *
                                Math.tan(cameraRef.current.fov / 2) *
                                2)) *
                        engineRef.current.getRenderHeight(true);
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
            (coloredMeshItems || showMeshesOnHover)
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

                    if (mesh !== lastMeshRef.current) {
                        debugLog('debug', 'pointer move');
                        try {
                            onMeshHoverRef.current(mesh, scene, e);
                        } catch {
                            console.log('Error calling hover event on scene');
                        }
                        lastMeshRef.current = mesh;
                    }
                }
            };
        }

        return () => {
            debugLog(
                'debug',
                'hover clean' + (scene ? ' with scene' : ' no scene')
            );
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
        debugLog(
            'debug',
            'pointerTap effect' + (scene ? ' with scene' : ' no scene')
        );
        if (scene && onMeshClickRef.current) {
            const pointerTap = (e: any) => {
                const p = e.pickInfo;
                const mesh: BABYLON.AbstractMesh = p?.pickedMesh;

                if (onMeshClickRef.current) {
                    try {
                        onMeshClickRef.current(mesh, scene, e.event);
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
            debugLog('debug', 'pointerTap effect clean');
            if (pt) {
                scene.onPointerObservable.remove(pt);
            }
        };
    }, [scene, markers]);

    // Pointer move handler
    useEffect(() => {
        let pt: BABYLON.Observer<BABYLON.PointerInfo>;
        debugLog(
            'debug',
            'pointerMove effect' + (scene ? ' with scene' : ' no scene')
        );
        if (scene && onCameraMoveRef.current) {
            const cameraMove = () => {
                if (onCameraMoveRef.current && cameraRef.current) {
                    onCameraMoveRef.current(
                        getCameraPosition(cameraRef.current)
                    );
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
            debugLog('debug', 'pointerMove effect clean');
            if (pt) {
                scene.onPointerObservable.remove(pt);
            }
        };
    }, [scene]);

    // SETUP LOGIC FOR HANDLING COLORING MESHES
    useEffect(() => {
        debugLog(
            'debug',
            'color meshes based on coloredmeshitems prop' +
                (scene ? ' with scene' : ' no scene')
        );

        if (scene && coloredMeshItems && !isLoading) {
            if (debugLogging) {
                console.time('coloring meshes');
            }
            try {
                const coloredMeshGroups: ColoredMeshGroup[] = [];

                // group colored meshes
                coloredMeshItems.forEach((coloredMesh) => {
                    // create first group
                    if (coloredMeshGroups.length === 0) {
                        coloredMeshGroups.push({
                            meshId: coloredMesh.meshId,
                            colors: [coloredMesh.color],
                            currentColor: 0
                        });
                    } else {
                        const group = coloredMeshGroups.find(
                            (g) => g.meshId === coloredMesh.meshId
                        );

                        // add to exsiting group
                        if (group) {
                            group.colors.push(coloredMesh.color);
                        } else {
                            // create new group
                            coloredMeshGroups.push({
                                meshId: coloredMesh.meshId,
                                colors: [coloredMesh.color],
                                currentColor: 0
                            });
                        }
                    }
                });

                for (const coloredMeshGroup of coloredMeshGroups) {
                    const mesh: BABYLON.AbstractMesh =
                        meshMap.current?.[coloredMeshGroup.meshId];
                    colorMesh(
                        mesh,
                        coloredMeshGroup.colors[coloredMeshGroup.currentColor]
                    );
                }

                const nextColor = function (
                    currentColor: number,
                    totalColors: number
                ) {
                    return currentColor + 1 >= totalColors
                        ? 0
                        : currentColor + 1;
                };

                const transition = 250;
                const interval = 500;
                let elapsed = 0;

                const transitionNrm = function () {
                    return (elapsed - interval) / transition;
                };

                scene.beforeRender = () => {
                    elapsed += 10;
                    if (elapsed >= interval) {
                        if (elapsed <= interval + transition) {
                            for (const coloredMeshGroup of coloredMeshGroups) {
                                if (coloredMeshGroup.colors.length > 1) {
                                    const mesh: BABYLON.AbstractMesh =
                                        meshMap.current?.[
                                            coloredMeshGroup.meshId
                                        ];
                                    const transitionColor = BABYLON.Color3.Lerp(
                                        BABYLON.Color3.FromHexString(
                                            coloredMeshGroup.colors[
                                                coloredMeshGroup.currentColor
                                            ]
                                        ),
                                        BABYLON.Color3.FromHexString(
                                            coloredMeshGroup.colors[
                                                nextColor(
                                                    coloredMeshGroup.currentColor,
                                                    coloredMeshGroup.colors
                                                        .length
                                                )
                                            ]
                                        ),
                                        transitionNrm()
                                    );
                                    colorMesh(
                                        mesh,
                                        transitionColor.toHexString()
                                    );
                                }
                            }
                        } else {
                            for (const coloredMeshGroup of coloredMeshGroups) {
                                if (coloredMeshGroup.colors.length > 1) {
                                    const mesh: BABYLON.AbstractMesh =
                                        meshMap.current?.[
                                            coloredMeshGroup.meshId
                                        ];
                                    elapsed = 0;
                                    coloredMeshGroup.currentColor = nextColor(
                                        coloredMeshGroup.currentColor,
                                        coloredMeshGroup.colors.length
                                    );
                                    colorMesh(
                                        mesh,
                                        coloredMeshGroup.colors[
                                            coloredMeshGroup.currentColor
                                        ]
                                    );
                                }
                            }
                        }
                    }
                };
            } catch {
                console.warn('unable to color mesh');
            }
            if (debugLogging) {
                console.timeEnd('coloring meshes');
            }
        }

        return () => {
            debugLog('debug', 'Mesh coloring cleanup');
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
                currentObjectColor.lightingStyle,
                backgroundColorRef.current.objectLuminanceRatio
            );

            materialCacheRef.current[materialId] = material;
            debugLog('debug', 'Creating material for ' + materialId);
        }

        SetWireframe(material, !!isWireframe);
        mesh.material = material;
        coloredMaterials.current[mesh.id] = material;
    };

    // Handle outlinedMeshItems
    useEffect(() => {
        debugLog('debug', 'Outline Mesh effect');
        if (outlinedMeshitems) {
            for (const item of outlinedMeshitems) {
                const currentMesh: BABYLON.Mesh =
                    meshMap.current?.[item.meshId];
                if (currentMesh) {
                    let meshToOutline = currentMesh;
                    try {
                        if (currentMesh.material.wireframe === true) {
                            // When outlining a wireframed object, we only want to outline the silhouette, not the wireframe
                            // lines themselves.  To do this we need to duplicate the mesh, disable wireframe rendering and set
                            // the alpha to 0 so we do not see it.
                            const clone = currentMesh.clone(
                                '',
                                null,
                                true,
                                false
                            );

                            // For some reason when rendering the duplicated outline mesh at 1:1 scale we get outline artifacts
                            // on the wireframe itself.  We scale this up slightly to alleviate this.
                            clone.scaling = new BABYLON.Vector3(
                                1.01,
                                1.01,
                                1.01
                            );

                            clone.material = new BABYLON.StandardMaterial(
                                'standard',
                                scene
                            );
                            clone.material.alpha = 0.0;
                            clone.alphaIndex = 2;
                            clone.isPickable = false;
                            clonedHighlightMeshes.current.push(clone);
                            sceneRef.current.meshes.push(clone);
                            meshToOutline = clone;
                            highlightLayer.current.addExcludedMesh(currentMesh);
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
            debugLog('debug', 'Outline Mesh cleanup');
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
                    if (sceneRef.current?.meshes)
                        sceneRef.current.meshes.length--;
                }
                clonedHighlightMeshes.current = [];
            }

            for (const mesh of outlinedMeshitems) {
                highlightLayer.current.removeExcludedMesh(
                    meshMap.current?.[mesh.meshId]
                );
            }
        };
    }, [outlinedMeshitems, meshMap.current]);

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
            <Markers markersAndPositions={markersAndPositions} />
            {isLoading && url && (
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
            <MarkersPlaceholder markers={markers} />
        </div>
    );
}

export default withErrorBoundary(forwardRef(SceneView));
