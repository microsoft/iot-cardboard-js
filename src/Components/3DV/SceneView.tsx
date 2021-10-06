import React, { useState, useEffect } from 'react';
import * as BABYLON from 'babylonjs';
import 'babylonjs-loaders';
import { ProgressIndicator } from '@fluentui/react';
import '@babylonjs/loaders/glTF';
import './SceneView.scss';
import * as GUI from 'babylonjs-gui';
import { SceneViewProps } from '../../Models/Constants/Interfaces';

const widths = [
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0.2796875,
    0.2765625,
    0.3546875,
    0.5546875,
    0.5546875,
    0.8890625,
    0.665625,
    0.190625,
    0.3328125,
    0.3328125,
    0.3890625,
    0.5828125,
    0.2765625,
    0.3328125,
    0.2765625,
    0.3015625,
    0.5546875,
    0.5546875,
    0.5546875,
    0.5546875,
    0.5546875,
    0.5546875,
    0.5546875,
    0.5546875,
    0.5546875,
    0.5546875,
    0.2765625,
    0.2765625,
    0.584375,
    0.5828125,
    0.584375,
    0.5546875,
    1.0140625,
    0.665625,
    0.665625,
    0.721875,
    0.721875,
    0.665625,
    0.609375,
    0.7765625,
    0.721875,
    0.2765625,
    0.5,
    0.665625,
    0.5546875,
    0.8328125,
    0.721875,
    0.7765625,
    0.665625,
    0.7765625,
    0.721875,
    0.665625,
    0.609375,
    0.721875,
    0.665625,
    0.94375,
    0.665625,
    0.665625,
    0.609375,
    0.2765625,
    0.3546875,
    0.2765625,
    0.4765625,
    0.5546875,
    0.3328125,
    0.5546875,
    0.5546875,
    0.5,
    0.5546875,
    0.5546875,
    0.2765625,
    0.5546875,
    0.5546875,
    0.221875,
    0.240625,
    0.5,
    0.221875,
    0.8328125,
    0.5546875,
    0.5546875,
    0.5546875,
    0.5546875,
    0.3328125,
    0.5,
    0.2765625,
    0.5546875,
    0.5,
    0.721875,
    0.5,
    0.5,
    0.5,
    0.3546875,
    0.259375,
    0.353125,
    0.5890625
];
const avg = 0.5279276315789471;

function measureText(str: string, fontSize: number) {
    return (
        Array.from(str).reduce(
            (acc, cur) => acc + (widths[cur.charCodeAt(0)] ?? avg),
            0
        ) * fontSize
    );
}

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
            () => onError()
        );
    });
}

export const SceneView: React.FC<SceneViewProps> = ({
    modelUrl,
    cameraRadius,
    cameraCenter,
    labels
}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [loadProgress, setLoadProgress] = useState(0);
    const [scene, setScene] = useState(null);

    function onProgress(e: any) {
        if (e.total) {
            setLoadProgress(e.loaded / e.total);
        } else {
            setLoadProgress(0);
        }
    }

    async function load(root: string, file: string, scene: any) {
        const assets = await loadPromise(
            root,
            file,
            scene,
            (e) => onProgress(e),
            () => setIsLoading(undefined)
        );
        assets.addAllToScene();
        setScene(scene);
        setIsLoading(false);
    }

    useEffect(() => {
        const canvas = document.getElementById('canvas') as HTMLCanvasElement;
        const engine = new BABYLON.Engine(canvas, true);
        const tempScene = new BABYLON.Scene(engine);
        tempScene.clearColor = new BABYLON.Color4(0, 0, 0, 0);
        const center = cameraCenter || new BABYLON.Vector3(0, 0, 0);
        const camera = new BABYLON.ArcRotateCamera(
            'camera',
            3.2,
            Math.PI / 2.5,
            cameraRadius,
            center,
            tempScene,
            true
        );
        camera.attachControl(canvas, false);

        new BABYLON.HemisphericLight(
            'light',
            new BABYLON.Vector3(1, 1, 0),
            tempScene
        );
        new BABYLON.HemisphericLight(
            'light',
            new BABYLON.Vector3(-1, -1, 0),
            tempScene
        );
        new BABYLON.HemisphericLight(
            'light',
            new BABYLON.Vector3(1, -1, 0),
            tempScene
        );
        new BABYLON.HemisphericLight(
            'light',
            new BABYLON.Vector3(-1, 1, 0),
            tempScene
        );

        if (modelUrl) {
            const n = modelUrl.lastIndexOf('/') + 1;
            load(modelUrl.substring(0, n), modelUrl.substring(n), tempScene);
        }

        engine.runRenderLoop(() => {
            tempScene.render();
        });

        const resize = () => {
            engine.resize();
        };
        window.addEventListener('resize', resize);

        return () => {
            window.removeEventListener('resize', resize);
            if (scene) {
                scene.dispose();
            }
            if (engine) {
                engine.dispose();
            }
        };
    }, [modelUrl]);

    useEffect(() => {
        const rects: any[] = [];
        const advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI(
            'UI'
        );
        if (labels && scene) {
            labels.forEach((item) => {
                const text1 = item.metric;
                const text2 = item.value.toFixed(5);
                const text = text1 + '\n\n' + text2;
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
                advancedTexture.addControl(rect);

                const label = new GUI.TextBlock();
                label.color = item.color || 'white';
                label.text = text;
                rect.addControl(label);
                const targetMesh = scene?.meshes?.find(
                    (mesh) => mesh.id === item.meshId
                );
                if (targetMesh) {
                    rect.linkWithMesh(targetMesh);
                    if (item.color) {
                        // TODO: Better color handling
                        targetMesh.material.albedoColor = BABYLON.Color3.FromHexString(
                            item.color
                        );
                    }
                }
            });
        }

        return () => {
            for (const rect of rects) {
                advancedTexture.removeControl(rect);
            }
        };
    }, [labels, scene]);

    return (
        <div className="cb-sceneview-container">
            <canvas
                id="canvas"
                touch-action="none"
                className="cb-sceneview-canvas"
            />
            {isLoading && modelUrl && (
                <ProgressIndicator
                    className="cb-sceneview-progressbar"
                    styles={{
                        itemDescription: {
                            color: 'white',
                            fontSize: 26,
                            marginTop: 10
                        }
                    }}
                    description={`Loading (${Math.floor(
                        loadProgress * 100
                    )}%)...`}
                    percentComplete={loadProgress}
                    barHeight={10}
                />
            )}
            {isLoading === undefined && (
                <div className="cb-sceneview-errormessage" style={{}}>
                    Error loading model
                </div>
            )}
        </div>
    );
};
