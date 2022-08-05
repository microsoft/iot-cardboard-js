import * as BABYLON from '@babylonjs/core/Legacy/legacy';
import '@babylonjs/loaders';
import * as GUI from '@babylonjs/gui';
import {
    MessageBar,
    MessageBarType,
    ProgressIndicator,
    useTheme
} from '@fluentui/react';
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
    deepCopy,
    getDebugLogger,
    hexToColor4
} from '../../Models/Services/Utils';
import {
    ICameraPosition,
    ISceneViewProps,
    ColoredMeshGroup,
    Marker,
    SceneViewCallbackHandler,
    TransformedElementItem,
    CustomMeshItem,
    TransformInfo
} from '../../Models/Classes/SceneView.types';
import {
    CameraZoomMultiplier,
    Scene_Marker,
    SphereMaterial
} from '../../Models/Constants/SceneView.constants';
import {
    AbstractMesh,
    HighlightLayer,
    Tools,
    UtilityLayerRenderer
} from '@babylonjs/core';
import {
    convertLatLonToVector3,
    elementsOverlap,
    getBoundingBox,
    getCameraPosition,
    getMarkerPosition,
    removeGroupedItems,
    transformInfoFromMesh,
    transformMeshFromTransformInfo
} from './SceneView.Utils';
import {
    makeMaterial,
    makeStandardMaterial,
    ToColor3,
    SetWireframe
} from './Shaders';
import {
    CameraInteraction,
    DefaultViewerModeObjectColor,
    globeUrl,
    IADTBackgroundColor,
    TransparentTexture,
    ViewerModeObjectColors,
    ViewerObjectStyle
} from '../../Models/Constants';
import { getProgressStyles, getSceneViewStyles } from './SceneView.styles';
import { withErrorBoundary } from '../../Models/Context/ErrorBoundary';
import { ModelGroupLabel } from '../ModelGroupLabel/ModelGroupLabel';
import { MarkersPlaceholder } from './Internal/MarkersPlaceholder';
import { Markers } from './Internal/Markers';
import axios from 'axios';
import { LoadingErrorMessage } from './Internal/LoadingErrorMessage';
import { useTranslation } from 'react-i18next';

export const showFpsCounter = false;
const debugBabylon = false;
const debugLogging = true;
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

const getModifiedTime = async (url): Promise<string> => {
    return axios(url, {
        method: 'GET',
        headers: {
            Range: 'bytes=1-2',
            'x-ms-version': '2017-11-09',
            ...(Tools.CustomRequestHeaders.Authorization && {
                Authorization: Tools.CustomRequestHeaders.Authorization
            })
        }
    })
        .then((response) => {
            const dt = new Date(response.headers['last-modified']);
            if (
                dt.toString() === 'Invalid Date' ||
                dt.toISOString() === '1970-01-01T00:00:00.000Z'
            ) {
                return '';
            }
            return dt.toISOString();
        })
        .catch(() => {
            return null;
        });
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
        allowModelDimensionErrorMessage,
        backgroundColor,
        cameraInteractionType,
        cameraPosition,
        coloredMeshItems,
        getToken,
        gizmoElementItem,
        gizmoTransformItem,
        markers,
        modelUrl,
        objectColor,
        objectStyle,
        onCameraMove,
        onMeshClick,
        onMeshHover,
        onSceneLoaded,
        outlinedMeshitems,
        setGizmoTransformItem,
        showHoverOnSelected,
        showMeshesOnHover,
        transformedElementItems,
        unzoomedMeshOpacity,
        zoomToMeshIds
    } = props;
    const [isLoading, setIsLoading] = useState(true);
    const [loadProgress, setLoadProgress] = useState(0);
    const [loadingError, setLoadingError] = useState<
        null | 'generic' | 'network'
    >(null);
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
    const reflectionTexture = useRef<BABYLON.BaseTexture>(null);
    const outlinedMeshes = useRef<BABYLON.AbstractMesh[]>([]);
    const clonedHighlightMeshes = useRef<BABYLON.AbstractMesh[]>([]);
    const highlightLayer = useRef<HighlightLayer>(null);
    const utilLayer = useRef<UtilityLayerRenderer>(null);
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
    const initialCameraTargetRef = useRef(new BABYLON.Vector3(0, 0, 0));
    const zoomedMeshesRef = useRef([]);
    const lastCameraPositionRef = useRef('');
    const markersRef = useRef<Marker[]>(null);
    const previouslyTransformedElements = useRef<CustomMeshItem[]>([]);
    const gizmoManagerRef = useRef<BABYLON.GizmoManager>(undefined);
    const gizmoTransformItemDraftRef = useRef<TransformedElementItem>(null);

    const [markersAndPositions, setMarkersAndPositions] = useState<
        { marker: Marker; left: number; top: number }[]
    >([]);

    const [showModelError, setShowModelError] = useState(false);

    const isWireframe = objectStyle === ViewerObjectStyle.Wireframe;

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

    const preProcessMeshesOnLoad = () => {
        let uniqueNumber = 0;
        //Initial loop to check for issues and cleanup meshes.
        for (const mesh of sceneRef.current.meshes) {
            //Let's make sure that all mesh ids are unique
            const matchingId = sceneRef.current.meshes.filter(
                (x) => x.id == mesh.id
            );
            if (matchingId.length > 1) {
                //Throw an error here
                console.warn(
                    'Loaded model contains objects with duplicate names. 3D Scenes Studio only supports 3d models with unique object names. Attempting to recover by forcing unique names...'
                );
                console.warn(
                    matchingId.length + ' objects with name: ' + mesh.id
                );
                //Append unique numbers to the ids and move on
                for (let i = 0; i < matchingId.length; i++) {
                    matchingId[i].id += i;
                }
            }

            //If the mesh is an InstancedMesh, break the mesh instancing to handle it as an independent object
            if (mesh.isAnInstance) {
                debugLog('debug', 'Breaking mesh instance: ', mesh.name);
                const instancedMesh = mesh as BABYLON.InstancedMesh;
                instancedMesh.sourceMesh.clone(
                    instancedMesh.name + uniqueNumber,
                    instancedMesh.parent
                );
                uniqueNumber++;
                sceneRef.current.removeMesh(mesh);
                mesh.dispose();
                continue;
            }

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
                    // if zooming to an element set scale a little further out than if its the whole model
                    const scaleFactor = zoomMeshIds?.length ? 5 : 3;
                    const es_scaled = es.scale(scaleFactor);
                    const width = es_scaled.x;
                    const height = es_scaled.y;
                    const depth = es_scaled.z;
                    const radius = Math.max(width, height, depth);

                    // check if the largest dimension is ALOT larger than the smallest dimension.
                    // This can be caused by erroneous meshes which need to be fixed in a modelling tool
                    if (
                        allowModelDimensionErrorMessage &&
                        radius > Math.min(width, height, depth) * 1000
                    ) {
                        setShowModelError(true);
                    } else {
                        setShowModelError(false);
                    }

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
                        cameraRef.current = camera;
                        cameraRef.current.zoomOn(meshes, true);
                        cameraRef.current.radius = radius;
                        cameraRef.current.lowerRadiusLimit = 0;
                        // set upperRadiusLimit to be greater than the starting radius to allow the user to zoom out if they wish
                        cameraRef.current.upperRadiusLimit = radius * 2;
                        // set the maxZ of the camera to be higher than the upperRadiusLimit to ensure it will not clip when zoomed out
                        cameraRef.current.maxZ =
                            cameraRef.current.upperRadiusLimit * 2;
                        cameraRef.current.wheelPrecision =
                            (3 * 40) / bbox.boundingSphere.radius;

                        // zoomOn zooms on a mesh to be at the min distance where we could see it fully in the current viewport.
                        // This means is won't necessarily center the model,
                        // so storing the camera target so then when we reset it will be the same as when we first render
                        initialCameraTargetRef.current = deepCopy(
                            cameraRef.current.target
                        );

                        // Register a render loop to repeatedly render the scene
                        engineRef.current.runRenderLoop(() => {
                            if (cameraRef.current) {
                                sceneRef.current.render();

                                // Update FPS counter
                                if (showFpsCounter) {
                                    const fps = document.getElementById('FPS');
                                    fps.innerHTML =
                                        'FPS: ' +
                                        engineRef.current.getFps().toFixed();
                                }
                            }
                        });
                    } else {
                        // ensure if zoom to mesh ids are set we zoom to the meshes else reset
                        if (zoomMeshIds?.length) {
                            zoomCamera(radius, meshes, 30);
                        } else {
                            resetCamera();
                        }
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
        if (objectColor) {
            setCurrentObjectColor(objectColor);
        }
    }, [objectColor]);

    const restoreMeshMaterials = () => {
        if (sceneRef.current?.meshes?.length && !isLoading) {
            if (meshesAreOriginal.current) {
                for (const mesh of sceneRef.current.meshes) {
                    //Meshes with higher alphaIndex are highlight clones and should not have their material swapped
                    if (mesh.alphaIndex <= 1) {
                        mesh.material = originalMaterials.current[mesh.id];
                    }
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
                resetCamera();
            }
        }
    }));

    const zoomCamera = (
        radius: number,
        meshes: AbstractMesh[],
        frames: number,
        zoomOnly?: boolean
    ) => {
        const targetFrom = cameraRef.current.target;
        const radiusFrom = cameraRef.current.radius;
        // Now move it immediately to where we want it and save the new position
        cameraRef.current.zoomOn(meshes, true);
        const targetTo = cameraRef.current.target;
        const radiusTo = radius;
        // Reset camera back to original position
        cameraRef.current.target = targetFrom;
        const ease = new BABYLON.CubicEase();
        ease.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
        if (!zoomOnly) {
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

    const resetCamera = () => {
        const targetFrom = cameraRef.current.target;
        const radiusFrom = cameraRef.current.radius;
        const targetTo = initialCameraTargetRef.current;
        const radiusTo = initialCameraRadiusRef.current;

        const ease = new BABYLON.CubicEase();
        ease.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
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
    };

    // Update render mode
    useEffect(() => {
        debugLog('debug', 'Render Mode Effect');
        if (sceneRef.current?.meshes?.length) {
            const currentObjectColorId = currentColorId();

            //Reset the reflection Texture
            reflectionTexture.current = null;
            if (currentObjectColor.reflectionTexture) {
                //If the current object theme has a reflection and the property is 'default', use the default reflection.
                //Otherwise, this assumes the property contains a .env file that is base64 encoded as an octet-stream.
                //see the Babylon documentation on how to generate a .env from an HDRi or DDS environment file:
                //(https://doc.babylonjs.com/divingDeeper/materials/using/HDREnvironment)
                const reflectionAsString = currentObjectColor.reflectionTexture.startsWith(
                    'default'
                )
                    ? DefaultViewerModeObjectColor.reflectionTexture
                    : currentObjectColor.reflectionTexture;
                const cubeTexture = new BABYLON.CubeTexture(
                    reflectionAsString,
                    sceneRef.current,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    '.env'
                );

                reflectionTexture.current = cubeTexture;
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
                    reflectionTexture.current,
                    currentObjectColor.lightingStyle,
                    backgroundColorRef.current?.objectLuminanceRatio || 1
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
                    reflectionTexture.current,
                    currentObjectColor.lightingStyle,
                    backgroundColorRef.current?.objectLuminanceRatio || 1
                ));

            if (!currentObjectColor.baseColor && !meshesAreOriginal.current) {
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

            if (currentObjectColor.baseColor) {
                const baseColor = hexToColor4(currentObjectColor.baseColor);
                const material = makeMaterial(
                    'col',
                    sceneRef.current,
                    baseColor,
                    reflectionTexture.current,
                    currentObjectColor.lightingStyle,
                    backgroundColorRef.current?.objectLuminanceRatio || 1
                );

                shaderMaterial.current = material;
                if (!!isWireframe || currentObjectColor.baseColor) {
                    for (const mesh of sceneRef.current.meshes) {
                        if (mesh?.material) {
                            const ignore = shouldIgnore(mesh);
                            if (currentObjectColor.baseColor && !ignore) {
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
    }, [isWireframe, isLoading, currentObjectColor, backgroundColor]);

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
    }, [isWireframe, objectColor]);

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
            sceneRef.current = null;
            utilLayer.current = null;
            advancedTextureRef.current = null;
            cameraRef.current = null;
            reflectionTexture.current = null;
        };
    }, [modelUrl]);

    // INITIALIZE AND LOAD SCENE
    const init = useCallback(() => {
        debugLog('debug', '**************init');

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
                    if (e.innerError.request?._xhr.status === 0) {
                        // When response is undefined or xhr status is 0 axios call returns as 'Network error', this could be a CORS issue, invalid blob url or a dropped internet connection. It is not possible for us to know.
                        console.error(
                            'Error loading model. This could be a CORS issue, invalid blob url or network error.'
                        );
                        setLoadingError('network');
                    } else {
                        // even if it is not CORS related, it might still due to lack of required permissions, or just corrupted file.
                        console.error(
                            'Error loading model. Check your access role assignments for that file, or try again.',
                            s,
                            e
                        );
                        setLoadingError('generic');
                    }
                    success = false;
                    setIsLoading(false);
                }
            );

            // TODO: Wrap above promise in an AbortController to cancel in case of changing scenes before the promise resolves
            // Checking if url used in loadPromise method above matches url for model being shown in the screen avoids an error
            // that occurs when trying to control the camera of an unloaded scene, but it does not cancel the download of the
            // first model which we already navigated away from.
            if (success && modelUrl === modelUrlRef.current) {
                sceneRef.current = sc;

                preProcessMeshesOnLoad();
                createOrZoomCamera();

                sceneRef.current.clearColor = new BABYLON.Color4(
                    0,
                    0,
                    0,
                    0
                ).toLinearSpace();

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

                utilLayer.current = new BABYLON.UtilityLayerRenderer(
                    sceneRef.current
                );

                //Create the advancedDynamicTexture to hold gui elements.
                //Set the scene to the utility layer to fix sorting issues with outlines
                advancedTextureRef.current = GUI.AdvancedDynamicTexture.CreateFullscreenUI(
                    'UI',
                    true,
                    utilLayer.current.utilityLayerScene
                );

                highlightLayer.current = new BABYLON.HighlightLayer(
                    'hl1',
                    utilLayer.current.utilityLayerScene,
                    {
                        isStroke: true,
                        mainTextureRatio: 2,
                        blurHorizontalSize: 1,
                        blurVerticalSize: 1
                    }
                );
                highlightLayer.current.innerGlow = false;

                const light = new BABYLON.HemisphericLight(
                    'light',
                    new BABYLON.Vector3(1, 1, 0),
                    sceneRef.current
                );
                light.diffuse = new BABYLON.Color3(0.8, 0.8, 0.8);
                light.specular = new BABYLON.Color3(1, 1, 1);
                light.groundColor = new BABYLON.Color3(0.2, 0.2, 0.2);

                //If the default mode has a reflection texture URL, turn on the environment reflections
                if (DefaultViewerModeObjectColor.reflectionTexture) {
                    const cubeTexture = new BABYLON.CubeTexture(
                        DefaultViewerModeObjectColor.reflectionTexture,
                        sceneRef.current,
                        undefined,
                        undefined,
                        undefined,
                        undefined,
                        undefined,
                        undefined,
                        undefined,
                        '.env'
                    );

                    reflectionTexture.current = cubeTexture;
                    sceneRef.current.environmentTexture =
                        reflectionTexture.current;
                }

                setScene(sceneRef.current);
                setIsLoading(false);
                setLoadingError(null);

                //This will show the babylon inspector on the right side of the screen to view all babylon scene objects and their properties
                if (debugBabylon) {
                    sceneRef.current.debugLayer.show({
                        showInspector: true,
                        embedMode: true
                    });
                }

                engineRef.current.resize();
                if (onSceneLoaded) {
                    onSceneLoaded(sceneRef.current);
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
            setLoadingError(null);
            init();
        }

        return () => {
            // if the modelurl prop is set but has not changed from the current url we don't want to clean up the materials
            if (modelUrl && modelUrl !== modelUrlRef.current) {
                for (const material of materialCacheRef.current) {
                    sceneRef.current?.removeMaterial(material);
                    material.dispose(true, true);
                }
                materialCacheRef.current = [];
            }
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
        if (markersRef.current) {
            markersRef.current.forEach((marker) => {
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
                    if (marker.allowGrouping) {
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
                                            marker?.UIElement?.props
                                                ?.onLabelClick
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
                        markersAndPositions.push({
                            marker: marker,
                            left: posLeft,
                            top: posTop
                        });
                    }
                } else {
                    removeGroupedItems(markersAndPositions, marker);
                }
            });

            setMarkersAndPositions(markersAndPositions);
        }
    }, [markers, markersRef.current]);

    useEffect(() => {
        // ensure we have markers and the model is loaded
        if (markers && !isLoading) {
            markersRef.current = markers;
            createMarkersWithPosition();
        }
    }, [markers, isLoading]);

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
        currentObjectColor,
        backgroundColor
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
                const interval = 2000;
                let elapsed = 0;

                const transitionNrm = function () {
                    return (elapsed - interval) / transition;
                };

                scene.beforeRender = () => {
                    elapsed += sceneRef.current.deltaTime;
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
    }, [
        coloredMeshItems,
        isLoading,
        isWireframe,
        currentObjectColor,
        backgroundColor
    ]);

    const colorMesh = (mesh: AbstractMesh, color: string) => {
        if (!mesh) {
            return;
        }

        // Creating materials is VERY expensive, so try and avoid it
        const col = color || currentObjectColor?.coloredMeshColor;
        const materialId = currentColorId() + col;

        let material = materialCacheRef.current[materialId];
        if (!material) {
            material = makeStandardMaterial(
                'coloredMeshMaterial',
                sceneRef.current,
                hexToColor4(col),
                currentObjectColor.lightingStyle,
                backgroundColorRef.current?.objectLuminanceRatio || 1
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
                        // To fix issues with the outline rendering behind the object when it is occluded,
                        // we will duplicate the mesh, and use the duplicate to render the outline set to a higher
                        // alphaIndex.
                        const clone = currentMesh.clone('', null, true, false);
                        // Move the clone to a utility layer so we can draw it on top of other opaque scene elements
                        clone._scene = utilLayer.current.utilityLayerScene;
                        //Parent the clone to the mesh so that the highlight transform animates properly
                        clone.setParent(currentMesh);
                        const cloneMaterial = new BABYLON.StandardMaterial(
                            'standard',
                            utilLayer.current.utilityLayerScene
                        );
                        cloneMaterial.alpha = 0.0;
                        cloneMaterial.backFaceCulling = false;
                        clone.material = cloneMaterial;
                        clone.alphaIndex = 2;
                        clone.isPickable = false;
                        clonedHighlightMeshes.current.push(clone);
                        utilLayer.current.utilityLayerScene.meshes.push(clone);
                        meshToOutline = clone;
                        highlightLayer.current.addExcludedMesh(currentMesh);
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
            if (outlinedMeshes.current) {
                for (const mesh of outlinedMeshes.current) {
                    highlightLayer.current?.removeMesh(mesh as BABYLON.Mesh);
                }
                outlinedMeshes.current = [];
            }
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
            if (outlinedMeshitems) {
                for (const mesh of outlinedMeshitems) {
                    if (meshMap.current?.[mesh.meshId]) {
                        highlightLayer.current.removeExcludedMesh(
                            meshMap.current?.[mesh.meshId]
                        );
                    }
                }
            }
        };
    }, [outlinedMeshitems, meshMap.current]);

    // SETUP LOGIC FOR HANDLING TRANSFORMING MESHES
    useEffect(() => {
        debugLog(
            'debug',
            'transform meshes based on transformedMeshItems prop' +
                (scene ? ' with scene' : ' no scene')
        );

        if (scene && transformedElementItems && !isLoading) {
            if (debugLogging) {
                console.time('transforming meshes');
            }
            try {
                // if there is a parent mesh in previouslyTransformedElements BUT NOT in transformedElementItems
                // (meaning the element had been previously transformed but the transform is now turned off)
                // reset the element to its original state (which had been preserved in previouslyTransformedElements)
                // and remove element from previouslyTransformedElements

                // grab all parentMeshIds from the new transformedElementsItems
                const tEIParentMeshIds = transformedElementItems.map(
                    (tEI) => tEI.parentMeshId
                );
                // iterate through all previously transformed elements
                previouslyTransformedElements.current.forEach(
                    (previouslyTransformedElement) => {
                        // get mesh id for the previously transformed element
                        const prevTransParentMeshId =
                            previouslyTransformedElement.meshId;
                        // if the parentMeshIds to be transformed DOES NOT include the previouslyTransformedParentMeshId,
                        // then that means the transformation no longer applies and the element should be reset
                        if (!tEIParentMeshIds.includes(prevTransParentMeshId)) {
                            const prevTransParentMesh: BABYLON.Mesh =
                                meshMap.current?.[prevTransParentMeshId];
                            if (prevTransParentMesh) {
                                transformMeshFromTransformInfo(
                                    prevTransParentMesh,
                                    previouslyTransformedElement.transform
                                );
                            }

                            // set up to remove from previouslyTransformedElements
                            previouslyTransformedElement.meshId = null;
                        }
                    }
                );
                // remove all elements with parent mesh id of null (aka was already reset)
                previouslyTransformedElements.current = previouslyTransformedElements.current.filter(
                    (cPTE) => cPTE.meshId != null
                );

                transformedElementItems.forEach((transformedElementItem) => {
                    const meshIds = transformedElementItem.meshIds;
                    const parentMeshId = transformedElementItem.parentMeshId;
                    meshIds.forEach((meshId) => {
                        if (meshId != parentMeshId) {
                            // set parent of each mesh (that isn't the designated parent) to parent mesh
                            meshMap.current?.[meshId].setParent(
                                meshMap.current?.[parentMeshId]
                            );
                        }
                    });
                    transformMesh(transformedElementItem); // only call transform on parent mesh
                });
            } catch {
                console.warn('unable to transform mesh');
            }
            if (debugLogging) {
                console.timeEnd('transforming meshes');
            }
        }
    }, [transformedElementItems, isLoading]);

    const transformMesh = (transformedElementItem: TransformedElementItem) => {
        const parentMesh: BABYLON.Mesh =
            meshMap.current?.[transformedElementItem.parentMeshId];
        if (!parentMesh) {
            return;
        }

        parentMesh.rotationQuaternion = null; // need to do this to change mesh.rotation directly

        const pTParentMeshIds: string[] = previouslyTransformedElements.current.map(
            (pTE) => pTE.meshId
        );

        const newTransform = transformedElementItem.transform;

        // only add parentMesh to previouslyTransformedElements ONCE for the ORIGINAL status
        if (!pTParentMeshIds.includes(transformedElementItem.parentMeshId)) {
            const originalTransform = transformInfoFromMesh(parentMesh);
            previouslyTransformedElements.current.push({
                meshId: transformedElementItem.parentMeshId,
                transform: originalTransform
            });
        }

        // set mesh to new transform
        transformMeshFromTransformInfo(parentMesh, newTransform);
    };

    // Handle gizmoElementItem
    useEffect(() => {
        debugLog(
            'debug',
            'adding gizmo to parent meshes based on gizmoElementItem prop' +
                (scene ? ' with scene' : ' no scene')
        );

        if (scene && gizmoElementItem && !isLoading) {
            if (debugLogging) {
                console.time('adding gizmo to meshes');
            }
            try {
                // create a gizmoManager if one does not already exist
                if (!gizmoManagerRef.current) {
                    gizmoManagerRef.current = new BABYLON.GizmoManager(
                        scene,
                        1,
                        new BABYLON.UtilityLayerRenderer(scene)
                    );
                }
                const gizmoManager = gizmoManagerRef.current;

                // should be triggered upon leaving transforms tab
                if (!gizmoElementItem?.parentMeshId) {
                    // attach to null meshes to clear
                    gizmoManager.attachToMesh(null);
                    // snap parent mesh back to original state if a gizmoTransformItemDraftRef exists
                    // probably temporary -- ideally, would want to save transform data with mesh/under behavior
                    if (gizmoTransformItemDraftRef.current?.parentMeshId) {
                        const parentMesh: BABYLON.Mesh =
                            meshMap.current?.[
                                gizmoTransformItemDraftRef.current.parentMeshId
                            ];
                        parentMesh.rotationQuaternion = null;
                        const originalTransform =
                            gizmoTransformItemDraftRef.current.original;
                        transformMeshFromTransformInfo(
                            parentMesh,
                            originalTransform
                        );
                    }
                } else {
                    // later add support for multiple gizmoElementItems?
                    const parentMesh: BABYLON.Mesh =
                        meshMap.current?.[gizmoElementItem.parentMeshId];
                    parentMesh.rotationQuaternion = null;
                    // setting all other meshes to be children of the parent mesh
                    // so that the gizmo moves all meshes in element simultaneously
                    const meshIds = gizmoElementItem.meshIds;
                    const parentMeshId = gizmoElementItem.parentMeshId;
                    meshIds.forEach((meshId) => {
                        if (meshId != parentMeshId) {
                            meshMap.current?.[meshId].setParent(parentMesh);
                        }
                    });

                    gizmoManager.usePointerToAttachGizmos = false;
                    gizmoManager.attachToMesh(parentMesh);
                    gizmoManager.rotationGizmoEnabled = true;
                    gizmoManager.positionGizmoEnabled = true;

                    // to be accessed in updateTransform
                    let originalTransform: TransformInfo = null;

                    // capture original rotation/position when gizmoManager attaches to mesh
                    scene.onAfterRenderObservable.addOnce(() => {
                        const attachedMesh =
                            gizmoManager.gizmos.rotationGizmo.attachedMesh;

                        // set both original and transform to original state of mesh
                        originalTransform = transformInfoFromMesh(attachedMesh);

                        // allows transform values to persist clicking to and away from tab
                        // may need changing if we allow multiple elements in a sceneVisual to be gizmo'd
                        if (gizmoTransformItemDraftRef.current) {
                            const transform =
                                gizmoTransformItemDraftRef.current.transform;
                            transformMeshFromTransformInfo(
                                attachedMesh,
                                transform
                            );
                        } else {
                            gizmoTransformItemDraftRef.current = {
                                meshIds: deepCopy(meshIds),
                                parentMeshId: parentMeshId,
                                original: originalTransform,
                                transform: originalTransform
                            };
                        }

                        setGizmoTransformItem(
                            gizmoTransformItemDraftRef.current.transform
                        );
                    });

                    // on drag end for both position and rotation gizmos, update transform
                    // updating on every frame is too much for react to handle
                    const positionGizmo = gizmoManager.gizmos.positionGizmo;
                    positionGizmo.onDragEndObservable.add(() => {
                        // update the gizmoTransformItem (allows builder panel to display new position/rotation)
                        const attachedMesh =
                            gizmoManager.gizmos.positionGizmo.attachedMesh;

                        // this is the main place where transforms get set, so round here
                        gizmoTransformItemDraftRef.current.transform.position = {
                            x: Math.round(attachedMesh.position.x),
                            y: Math.round(attachedMesh.position.y),
                            z: Math.round(attachedMesh.position.z)
                        };
                        setGizmoTransformItem(
                            gizmoTransformItemDraftRef.current.transform
                        );
                    });

                    const rotationGizmo = gizmoManager.gizmos.rotationGizmo;
                    rotationGizmo.onDragEndObservable.add(() => {
                        // update the gizmoTransformItem (allows builder panel to display new position/rotation)
                        const attachedMesh =
                            gizmoManager.gizmos.positionGizmo.attachedMesh;

                        // this is the main place where transforms get set, so round here
                        gizmoTransformItemDraftRef.current.transform.rotation = {
                            x: Number(attachedMesh.rotation.x.toFixed(2)),
                            y: Number(attachedMesh.rotation.y.toFixed(2)),
                            z: Number(attachedMesh.rotation.z.toFixed(2))
                        };
                        setGizmoTransformItem(
                            gizmoTransformItemDraftRef.current.transform
                        );
                    });
                }
            } catch {
                console.warn('unable to add gizmo to mesh');
            }
            if (debugLogging) {
                console.timeEnd('adding gizmo to meshes');
            }
        }

        return () => {
            gizmoManagerRef.current?.dispose();
            gizmoManagerRef.current = null;
            // only cleanup if exiting edit behavior, not when switching tabs
            if (!gizmoElementItem) {
                gizmoTransformItemDraftRef.current = null;
            }
            debugLog('debug', 'Mesh gizmo cleanup');
        };
    }, [scene, gizmoElementItem, isLoading]);

    // Handle gizmoTransformItem
    useEffect(() => {
        if (scene && gizmoTransformItem && !isLoading) {
            try {
                if (gizmoTransformItemDraftRef.current) {
                    gizmoTransformItemDraftRef.current.transform = deepCopy(
                        gizmoTransformItem
                    );

                    const parentMesh: BABYLON.Mesh =
                        meshMap.current?.[
                            gizmoTransformItemDraftRef.current.parentMeshId
                        ];

                    // should update element when user inputs value in field
                    transformMeshFromTransformInfo(
                        parentMesh,
                        gizmoTransformItem
                    );
                }
            } catch {
                console.warn(
                    'unable to transform element based on change in transform field'
                );
            }
        }
    }, [scene, gizmoTransformItem, isLoading]);

    const theme = useTheme();
    const { t } = useTranslation();
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
            {loadingError && (
                <div className={customStyles.errorMessage}>
                    <LoadingErrorMessage errorType={loadingError} />
                </div>
            )}
            <MarkersPlaceholder markers={markers} />
            {showModelError && (
                <div className={customStyles.modelErrorMessage}>
                    <MessageBar
                        onDismiss={() => setShowModelError(false)}
                        isMultiline={false}
                        messageBarType={MessageBarType.warning}
                    >
                        {t(
                            'scenePageErrorHandling.sceneView.3dAssetDimensionError'
                        )}
                    </MessageBar>
                </div>
            )}
        </div>
    );
}

export default withErrorBoundary(forwardRef(SceneView));
