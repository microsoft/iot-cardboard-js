import React, {useState, useEffect} from 'react';
import * as BABYLON from 'babylonjs';
import 'babylonjs-loaders';
import { ProgressIndicator } from '@fluentui/react';
import "@babylonjs/loaders/glTF";
import './SceneView.scss';
import * as GUI from 'babylonjs-gui';
import {SceneViewProps} from '../../Models/Constants/Interfaces'

async function loadPromise(root, file, scene, onProgress: any, onError: any): Promise<BABYLON.AssetContainer> {
    return new Promise((resolve) => {
        BABYLON.SceneLoader.LoadAssetContainer(root, file, scene,
        (container) => { resolve(container); }, (e) => onProgress(e), () => onError());
    });
}

export const SceneView: React.FC<SceneViewProps> = ({data}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [loadProgress, setLoadProgress] = useState(0);

    useEffect(() => {
        const canvas = document.getElementById('canvas') as HTMLCanvasElement;
        const engine = new BABYLON.Engine(canvas, true);
        const scene = new BABYLON.Scene(engine);
        scene.clearColor = new BABYLON.Color4(9 / 255, 8 / 255, 35 / 255);
        const center = data.cameraCenter || new BABYLON.Vector3(0, 0, 0);
        const camera = new BABYLON.ArcRotateCamera('camera', 3.2, Math.PI / 2.5, data.cameraRadius, center, scene, true);
        camera.attachControl(canvas, false);
    
        new BABYLON.HemisphericLight('light', new BABYLON.Vector3(1, 1, 0), scene);
        new BABYLON.HemisphericLight('light', new BABYLON.Vector3(-1, -1, 0), scene);
        new BABYLON.HemisphericLight('light', new BABYLON.Vector3(1, -1, 0), scene);
        new BABYLON.HemisphericLight('light', new BABYLON.Vector3(-1, 1, 0), scene);

        async function load (scene: any) {
            const assets = await loadPromise(data.modelRoot, data.modelFile, scene, (e) => onProgress(e), () => setIsLoading(undefined));
            assets.addAllToScene();

            if(data.labels) {
                data.labels.forEach(item => {
                    const advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
                    const rect1 = new GUI.Rectangle();
                    rect1.width = '150px';
                    rect1.height = '100px';
                    rect1.cornerRadius = 10;
                    rect1.color = '#364944';
                    rect1.thickness = 1;
                    rect1.background = '#161B36';
                    advancedTexture.addControl(rect1);
                
                    const label1 = new GUI.TextBlock();
                    label1.color = 'white'
                    label1.text = item.metric + '\n\n' + item.value.toFixed(5);
                    rect1.addControl(label1);
                    const targetMesh = scene.meshes.find(mesh => mesh.id === item.meshId);
                    if (targetMesh) {
                        rect1.linkWithMesh(targetMesh); 
                    }
                });
            }

            setIsLoading(false);
        }

        if (data.modelRoot && data.modelFile) {
            load(scene);
        }
        
        engine.runRenderLoop(() => { scene.render(); });
        window.addEventListener('resize', () => { engine.resize(); });

        function onProgress(e: any) {
            if (e.total) {
                setLoadProgress(e.loaded/e.total);
            } else {
                setLoadProgress(0);
            }
        }
      }, [data]);



    return (
        <div className='sceneview-container'>
            <canvas id='canvas' touch-action='none'/>
            {isLoading && <ProgressIndicator className='sceneview-progressbar' styles={{ itemDescription: { color: 'white', fontSize: 26, marginTop: 10 } }}
                description={`Loading (${Math.floor(loadProgress * 100)}%)...`} percentComplete={loadProgress} barHeight={10} />}
            {isLoading === undefined && <div className='sceneview-errormessage' style={{}}>Error loading model</div>}
        </div>
    )
}