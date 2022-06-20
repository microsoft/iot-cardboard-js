import * as BABYLON from '@babylonjs/core/Legacy/legacy';
import '@babylonjs/loaders';
import * as GUI from '@babylonjs/gui';
import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
    IBabylonSandboxProps,
    IBabylonSandboxStyleProps,
    IBabylonSandboxStyles
} from './BabylonSandbox.types';
import { getStyles } from './BabylonSandbox.styles';
import { classNamesFunction, useTheme, styled } from '@fluentui/react';
import { Engine } from '../ADT3DBuilder/ADT3DBuilder.stories.local';
import { createGUID } from '../../Models/Services/Utils';
import ValueRangeBuilder from '../ValueRangeBuilder/ValueRangeBuilder';
import { UtilityLayerRenderer } from '@babylonjs/core/Legacy/legacy';

const getClassNames = classNamesFunction<
    IBabylonSandboxStyleProps,
    IBabylonSandboxStyles
>();

/**
 * Sets up the camera for scene.
 */
function setupCamera(
    scene: BABYLON.Scene,
    arcRotate: boolean
): BABYLON.ArcRotateCamera | BABYLON.FreeCamera {
    // Creates, angles, distances and targets the camera
    const camera = arcRotate
        ? new BABYLON.ArcRotateCamera(
              'Camera',
              0,
              Math.PI / 2.5,
              33,
              //   new BABYLON.Vector3(0, 0, 0),
              BABYLON.Vector3.Zero(),
              scene
          )
        : new BABYLON.FreeCamera(
              'camera1',
              new BABYLON.Vector3(0, 5, -10),
              scene
          );

    // This positions the camera
    if (camera instanceof BABYLON.ArcRotateCamera) {
        camera.setPosition(new BABYLON.Vector3(0, 5, -2));
    } else {
        camera.setTarget(BABYLON.Vector3.Zero());
    }

    // This attaches the camera to the canvas
    camera.attachControl(scene.getEngine().getRenderingCanvas(), true);

    return camera;
}

/**
 * Sets up lighting for scene.
 */
function setupLight(scene: BABYLON.Scene): BABYLON.HemisphericLight {
    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    const light = new BABYLON.HemisphericLight(
        'light1',
        new BABYLON.Vector3(0, 1, 0),
        scene
    );

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.7;

    return light;
}

function convertRadiansToDegrees(radians) {
    return (radians * (360 / (Math.PI * 2))).toFixed(2);
}

function BabylonSandbox(props: IBabylonSandboxProps) {
    const { styles } = props;
    const classNames = getClassNames(styles, {
        theme: useTheme()
    });

    const [canvasId] = useState(createGUID());
    const [scene, setScene] = useState<BABYLON.Scene>();
    // const [engine, setEngine] = useState<BABYLON.Engine>();
    const engineRef = useRef<BABYLON.Engine>(null);
    const pickedMeshRef = useRef<BABYLON.AbstractMesh>(null);
    const gizmoManagerRef = useRef<BABYLON.GizmoManager>(undefined);
    // const utilLayer = useRef<UtilityLayerRenderer>(null);

    //everything in a single useEffect with refs
    //instead of setEngine --> do engine.current = something -> doesn't handle a rerender
    //so either do all refs (Babylon) or all ??
    // put all effects together -> use refs
    //except do need the first useEffect for canvas --> after that, change all states to refs

    // setting up engine based on the canvas & scene based on engine
    useEffect(() => {
        const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        console.log(canvas);
        if (canvas) {
            engineRef.current = new BABYLON.Engine(canvas, true);
            setScene(new BABYLON.Scene(engineRef.current));
        }
    }, [canvasId]);

    // // setting up scene based on engine
    // useEffect(() => {
    //     if (engine) {
    //         setScene(new BABYLON.Scene(engine));
    //     }
    // }, [engine]);

    // setting up camera, light, gizmo manager, etc. based on scene
    useEffect(() => {
        if (scene) {
            const arcRotate = true;
            const camera = setupCamera(scene, arcRotate);
            const light = setupLight(scene);
            gizmoManagerRef.current = new BABYLON.GizmoManager(scene);
            const gizmoManager = gizmoManagerRef.current;
            gizmoManager.usePointerToAttachGizmos = false;
            gizmoManager.rotationGizmoEnabled = true;
            gizmoManager.positionGizmoEnabled = true;
            // gizmoManager.gizmos.boundingBoxGizmo.ignoreChildren = true;

            BABYLON.SceneLoader.ImportMeshAsync(
                '',
                // 'https://assets.babylonjs.com/meshes/',
                // 'https://dl.dropbox.com/s/s1p66hldqurou0w/Xwing_rig.glb',
                'https://dl.dropbox.com/s/2cq4fnsg8nqxckg/TruckBoxesEnginesPastmachine.gltf',
                // 'https://dl.dropbox.com/s/t1wepbusypqevn4/mercedes.glb',
                // 'both_houses_scene.babylon'
                // 'Xwing_rig.glb'
                'TruckBoxesEnginesPastmachine.gltf'
                // 'mercedes.glb'
            ).then((result) => {
                const meshes = result.meshes;
                console.log(result);
            });

            //////////// GUI STUFF //////////////////////////////////////////
            const guiCanvas = GUI.AdvancedDynamicTexture.CreateFullscreenUI(
                'UI'
            );

            // X Y Z label???
            const xRotTB = new GUI.TextBlock('', 'xRotation: ');
            xRotTB.width = '150px';
            xRotTB.height = '40px';
            xRotTB.color = 'white';
            xRotTB.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
            xRotTB.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;

            guiCanvas.addControl(xRotTB);

            const yRotTB = new GUI.TextBlock('', 'yRotation: ');
            yRotTB.width = '150px';
            yRotTB.height = '40px';
            yRotTB.color = 'white';
            yRotTB.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
            yRotTB.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;

            guiCanvas.addControl(yRotTB);

            const zRotTB = new GUI.TextBlock('', 'zRotation: ');
            zRotTB.width = '150px';
            zRotTB.height = '40px';
            zRotTB.color = 'white';
            zRotTB.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
            zRotTB.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;

            guiCanvas.addControl(zRotTB);

            scene.actionManager = new BABYLON.ActionManager(scene);

            scene.actionManager.registerAction(
                new BABYLON.ExecuteCodeAction(
                    {
                        trigger: BABYLON.ActionManager.OnEveryFrameTrigger
                    },
                    function () {
                        if (pickedMeshRef.current) {
                            xRotTB.text =
                                'xRotation: ' +
                                convertRadiansToDegrees(
                                    pickedMeshRef.current.rotation.x
                                );
                            yRotTB.text =
                                'yRotation: ' +
                                convertRadiansToDegrees(
                                    pickedMeshRef.current.rotation.y
                                );
                            zRotTB.text =
                                'zRotation: ' +
                                convertRadiansToDegrees(
                                    pickedMeshRef.current.rotation.z
                                );
                        }
                    }
                )
            );

            //////////// GUI STUFF //////////////////////////////////////////

            scene.onPointerDown = function castRay() {
                // scene.onKeyboardObservable.clear();

                const ray = scene.createPickingRay(
                    scene.pointerX,
                    scene.pointerY,
                    BABYLON.Matrix.Identity(),
                    camera
                );

                const hit = scene.pickWithRay(ray);

                if (hit.pickedMesh) {
                    pickedMeshRef.current = hit.pickedMesh;
                    // console.log(hit.pickedMesh);
                    // setGizmoManager(new BABYLON.GizmoManager(scene));
                    pickedMeshRef.current.rotationQuaternion = null;
                    gizmoManager.attachToMesh(pickedMeshRef.current);
                    console.log('gizmo?');
                    console.log(
                        'clicked mesh: ',
                        pickedMeshRef.current.name,
                        'at position: ',
                        pickedMeshRef.current.absolutePosition,
                        'and local rotation: ',
                        pickedMeshRef.current.rotation
                    );
                }
            };

            // setGizmoManager(new BABYLON.GizmoManager(scene));

            engineRef.current.runRenderLoop(() => {
                scene.render();
            });
        }
    }, [scene]);

    // scene.onMeshImportedObservable
    // scene.meshUnderPointer

    // function handlePickedMesh(pickedMesh: BABYLON.AbstractMesh) {
    //     gizmoManager.attachToMesh(pickedMesh);
    //     console.log('gizmo?');
    // }

    // have as a handle change
    // only reason to use state is if React cares --> so just use Babylon
    // useEffect(() => {
    //     if (currentMesh) {
    //         // gizmoManager.usePointerToAttachGizmos = false;
    //         // gizmoManager.rotationGizmoEnabled = true;
    //         // gizmoManager.positionGizmoEnabled = true;
    //         // gizmoManager.attachToMesh(currentMesh);
    //         // console.log('gizmo?');
    //         console.log(currentMesh.position.x);
    //     }
    // }, [currentMesh]);

    // let xRotation = 0;

    // const handleChange = ({ target }) => {
    //     currentMesh
    //         ? (currentMesh.rotation.x = target.value)
    //         : console.log('no current mesh');
    //     console.log(currentMesh.rotation.x);
    // };

    // if (scene && camera) {
    //     scene.render();
    // }

    return (
        <div className={classNames.root}>
            <canvas id={canvasId} height="120%"></canvas>
            <div>
                {/* <label htmlFor="xRotation">X: </label>
                <input
                    id="xRotation"
                    value={
                        currentMesh ? currentMesh.rotation.x : 'no current mesh'
                    }
                    onChange={handleChange}
                /> */}
            </div>
        </div>
    );
}

export default styled<
    IBabylonSandboxProps,
    IBabylonSandboxStyleProps,
    IBabylonSandboxStyles
>(BabylonSandbox, getStyles);

// do this under onPointerMove for scene???
// and then the panel re-renders
// setTransformInfo({
//     rotation: {
//         x: currentMesh.rotation.x,
//         y: currentMesh.rotation.y,
//         z: currentMesh.rotation.z
//     },
//     position: {
//         x: currentMesh.position.x,
//         y: currentMesh.position.y,
//         z: currentMesh.position.z
//     }
// })
