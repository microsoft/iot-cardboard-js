import * as BABYLON from '@babylonjs/core/Legacy/legacy';
import '@babylonjs/loaders';
// import * as GUI from '@babylonjs/gui';
import React, { useState, useCallback, useEffect } from 'react';
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

function BabylonSandbox(props: IBabylonSandboxProps) {
    const { styles } = props;
    const classNames = getClassNames(styles, {
        theme: useTheme()
    });

    const [canvasId] = useState(createGUID());
    const [currentMesh, setCurrentMesh] = useState<BABYLON.AbstractMesh>(); //maybe currentMesh should be an object with X Y Z rotation, position?
    const [scene, setScene] = useState<BABYLON.Scene>();
    const [engine, setEngine] = useState<BABYLON.Engine>();
    // let gizmoManager: BABYLON.GizmoManager = null;
    // let camera: BABYLON.ArcRotateCamera | BABYLON.FreeCamera = null;
    const [gizmoManager, setGizmoManager] = useState<BABYLON.GizmoManager>(
        undefined
    );

    //everything in a single useEffect with refs
    //instead of setEngine --> do engine.current = something -> doesn't handle a rerender
    //so either do all refs (Babylon) or all ??
    // put all effects together -> use refs
    //except do need the first useEffect for canvas --> after that, change all states to refs

    // setting up engine based on the canvas
    useEffect(() => {
        const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        console.log(canvas);
        if (canvas) {
            setEngine(new BABYLON.Engine(canvas, true));
        }
    }, [canvasId]);

    // setting up scene based on engine
    useEffect(() => {
        if (engine) {
            setScene(new BABYLON.Scene(engine));
        }
    }, [engine]);

    // setting up camera, light, gizmo manager, etc. based on scene
    useEffect(() => {
        if (scene) {
            const arcRotate = true;
            const camera = setupCamera(scene, arcRotate);
            const light = setupLight(scene);
            const gizmoManager = new BABYLON.GizmoManager(scene);
            gizmoManager.usePointerToAttachGizmos = false;
            gizmoManager.rotationGizmoEnabled = true;
            gizmoManager.positionGizmoEnabled = true;
            // gizmoManager.gizmos.boundingBoxGizmo.ignoreChildren = true;

            BABYLON.SceneLoader.ImportMeshAsync(
                '',
                // 'https://assets.babylonjs.com/meshes/',
                'https://dl.dropbox.com/s/s1p66hldqurou0w/Xwing_rig.glb',
                // 'https://dl.dropbox.com/s/2cq4fnsg8nqxckg/TruckBoxesEnginesPastmachine.gltf',
                // 'https://dl.dropbox.com/s/t1wepbusypqevn4/mercedes.glb',
                // 'both_houses_scene.babylon'
                'Xwing_rig.glb'
                // 'TruckBoxesEnginesPastmachine.gltf'
                // 'mercedes.glb'
            ).then((result) => {
                const meshes = result.meshes;
                console.log(result);
            });

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
                    setCurrentMesh(hit.pickedMesh);
                    // console.log(hit.pickedMesh);
                    // setGizmoManager(new BABYLON.GizmoManager(scene));
                    const pickedMesh = hit.pickedMesh;
                    pickedMesh.rotationQuaternion = null;
                    gizmoManager.attachToMesh(pickedMesh);
                    console.log('gizmo?');
                    // handlePickedMesh(pickedMesh);
                    console.log(
                        'clicked mesh: ',
                        pickedMesh.name,
                        'at position: ',
                        pickedMesh.absolutePosition,
                        'and local rotation: ',
                        pickedMesh.rotation
                    );
                }
            };

            // setGizmoManager(new BABYLON.GizmoManager(scene));

            engine.runRenderLoop(() => {
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
    useEffect(() => {
        if (currentMesh) {
            // gizmoManager.usePointerToAttachGizmos = false;
            // gizmoManager.rotationGizmoEnabled = true;
            // gizmoManager.positionGizmoEnabled = true;
            // gizmoManager.attachToMesh(currentMesh);
            // console.log('gizmo?');
            console.log(currentMesh.position.x);
        }
    }, [currentMesh]);

    // let xRotation = 0;

    const handleChange = ({ target }) => {
        currentMesh
            ? (currentMesh.rotation.x = target.value)
            : console.log('no current mesh');
        console.log(currentMesh.rotation.x);
    };

    // if (scene && camera) {
    //     scene.render();
    // }

    return (
        <div className={classNames.root}>
            <canvas id={canvasId} height="120%"></canvas>
            <div>
                <label htmlFor="xRotation">X: </label>
                <input
                    id="xRotation"
                    value={
                        currentMesh ? currentMesh.rotation.x : 'no current mesh'
                    }
                    onChange={handleChange}
                />
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
