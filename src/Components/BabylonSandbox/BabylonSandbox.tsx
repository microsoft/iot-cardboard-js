import * as BABYLON from '@babylonjs/core/Legacy/legacy';
import '@babylonjs/loaders';
import * as GUI from '@babylonjs/gui';
import React, { useState, useEffect, useRef } from 'react';
import {
    IBabylonSandboxProps,
    IBabylonSandboxStyleProps,
    IBabylonSandboxStyles
} from './BabylonSandbox.types';
import { getStyles } from './BabylonSandbox.styles';
import { classNamesFunction, useTheme, styled } from '@fluentui/react';
import { createGUID } from '../../Models/Services/Utils';

const getClassNames = classNamesFunction<
    IBabylonSandboxStyleProps,
    IBabylonSandboxStyles
>();

/**
 * Sets up the camera for scene.
 */
function setupCamera(
    scene: BABYLON.Scene,
    arcRotate: boolean,
    center?: BABYLON.Vector3
): BABYLON.ArcRotateCamera | BABYLON.FreeCamera {
    // Creates, angles, distances and targets the camera
    const camera = arcRotate
        ? new BABYLON.ArcRotateCamera(
              'Camera',
              0,
              Math.PI / 2.5,
              33,
              center ? center : BABYLON.Vector3.Zero(),
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
    const engineRef = useRef<BABYLON.Engine>(null);
    const pickedMeshRef = useRef<BABYLON.AbstractMesh>(null);
    const gizmoManagerRef = useRef<BABYLON.GizmoManager>(undefined);

    // setting up engine based on the canvas & scene based on engine
    useEffect(() => {
        const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        if (canvas) {
            engineRef.current = new BABYLON.Engine(canvas, true);
            setScene(new BABYLON.Scene(engineRef.current));
        }
    }, [canvasId]);

    // setting up camera, light, gizmo manager, etc. based on scene
    useEffect(() => {
        if (scene) {
            const arcRotate = true;
            const camera = setupCamera(scene, arcRotate);
            setupLight(scene);
            gizmoManagerRef.current = new BABYLON.GizmoManager(scene);
            const gizmoManager = gizmoManagerRef.current;
            gizmoManager.usePointerToAttachGizmos = false;
            gizmoManager.rotationGizmoEnabled = true;
            gizmoManager.positionGizmoEnabled = true;

            BABYLON.SceneLoader.ImportMeshAsync(
                '',
                'https://dl.dropbox.com/s/2cq4fnsg8nqxckg/TruckBoxesEnginesPastmachine.gltf',
                'TruckBoxesEnginesPastmachine.gltf'
            );

            //////////// GUI STUFF //////////////////////////////////////////
            const guiCanvas = GUI.AdvancedDynamicTexture.CreateFullscreenUI(
                'UI'
            );

            // X Y Z label
            const rotationTB = new GUI.TextBlock(
                '',
                'xRotation: \n\nyRotation: \n\nzRotation: '
            );
            rotationTB.width = '160px';
            rotationTB.height = '120px';
            rotationTB.color = 'white';
            rotationTB.verticalAlignment =
                GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
            rotationTB.horizontalAlignment =
                GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;

            guiCanvas.addControl(rotationTB);

            const positionTB = new GUI.TextBlock(
                '',
                'xPosition: \n\nyPosition: \n\nzPosition: '
            );
            positionTB.width = '200px';
            positionTB.height = '120px';
            positionTB.color = 'white';
            positionTB.verticalAlignment =
                GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
            positionTB.horizontalAlignment =
                GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;

            guiCanvas.addControl(positionTB);

            scene.actionManager = new BABYLON.ActionManager(scene);

            scene.actionManager.registerAction(
                new BABYLON.ExecuteCodeAction(
                    {
                        trigger: BABYLON.ActionManager.OnEveryFrameTrigger
                    },
                    function () {
                        if (pickedMeshRef.current) {
                            let text =
                                'xRotation: ' +
                                convertRadiansToDegrees(
                                    pickedMeshRef.current.rotation.x
                                );
                            text +=
                                '\n\nyRotation: ' +
                                convertRadiansToDegrees(
                                    pickedMeshRef.current.rotation.y
                                );
                            text +=
                                '\n\nzRotation: ' +
                                convertRadiansToDegrees(
                                    pickedMeshRef.current.rotation.z
                                );
                            rotationTB.text = text;
                            text =
                                'xPosition: ' +
                                pickedMeshRef.current.position.x.toFixed(2);
                            text +=
                                '\n\nyPosition: ' +
                                pickedMeshRef.current.position.y.toFixed(2);
                            text +=
                                '\n\nzPosition: ' +
                                pickedMeshRef.current.position.z.toFixed(2);
                            positionTB.text = text;
                        }
                    }
                )
            );

            //////////// GUI STUFF //////////////////////////////////////////

            scene.onPointerDown = function castRay() {
                const ray = scene.createPickingRay(
                    scene.pointerX,
                    scene.pointerY,
                    BABYLON.Matrix.Identity(),
                    camera
                );

                const hit = scene.pickWithRay(ray);

                if (hit.pickedMesh) {
                    pickedMeshRef.current = hit.pickedMesh;
                    pickedMeshRef.current.rotationQuaternion = null;
                    gizmoManager.attachToMesh(pickedMeshRef.current);
                }
            };

            engineRef.current.runRenderLoop(() => {
                scene.render();
            });
        }
    }, [scene]);

    return (
        <div className={classNames.root}>
            <canvas id={canvasId} height="190%"></canvas>
        </div>
    );
}

export default styled<
    IBabylonSandboxProps,
    IBabylonSandboxStyleProps,
    IBabylonSandboxStyles
>(BabylonSandbox, getStyles);
