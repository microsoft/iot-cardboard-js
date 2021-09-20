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

export const SceneView: React.FC<SceneViewProps> = ({modelUrl, cameraRadius, cameraCenter, labels}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [loadProgress, setLoadProgress] = useState(0);
    const [scene, setScene] = useState(null);

    useEffect(() => {
        const canvas = document.getElementById('canvas') as HTMLCanvasElement;
        const engine = new BABYLON.Engine(canvas, true);
        const tempScene = new BABYLON.Scene(engine);
        tempScene.clearColor = new BABYLON.Color4(9 / 255, 8 / 255, 35 / 255);
        const center = cameraCenter || new BABYLON.Vector3(0, 0, 0);
        const camera = new BABYLON.ArcRotateCamera('camera', 3.2, Math.PI / 2.5, cameraRadius, center, tempScene, true);
        camera.attachControl(canvas, false);
    
        new BABYLON.HemisphericLight('light', new BABYLON.Vector3(1, 1, 0), tempScene);
        new BABYLON.HemisphericLight('light', new BABYLON.Vector3(-1, -1, 0), tempScene);
        new BABYLON.HemisphericLight('light', new BABYLON.Vector3(1, -1, 0), tempScene);
        new BABYLON.HemisphericLight('light', new BABYLON.Vector3(-1, 1, 0), tempScene);

        async function load (root: string, file: string, scene: any) {
            const assets = await loadPromise(root, file, scene, (e) => onProgress(e), () => setIsLoading(undefined));
            assets.addAllToScene();
            setScene(scene);
            setIsLoading(false);
        }

        if (modelUrl) {
            const n = modelUrl.lastIndexOf('/') + 1;
            const root = modelUrl.substring(0, n);
            const file = modelUrl.substring(n);
            load(root, file, tempScene);
        }
        
        engine.runRenderLoop(() => { tempScene.render(); });
        window.addEventListener('resize', () => { engine.resize(); });

        function onProgress(e: any) {
            if (e.total) {
                setLoadProgress(e.loaded/e.total);
            } else {
                setLoadProgress(0);
            }
        }
      }, [modelUrl]);

      useEffect(() => {
          const rects: any[] = [];
          const advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
            if(labels && scene) {
                labels.forEach(item => {
                    const rect = new GUI.Rectangle();
                    rect.width = '150px';
                    rect.height = '100px';
                    rect.cornerRadius = 10;
                    rect.color = '#364944';
                    rect.thickness = 1;
                    rect.background = '#161B36';
                    rects.push(rect);
                    advancedTexture.addControl(rect);
                
                    const label = new GUI.TextBlock();
                    label.color = 'white'
                    label.text = item.metric + '\n\n' + item.value.toFixed(5);
                    rect.addControl(label);
                    const targetMesh = scene?.meshes.find(mesh => mesh.id === item.meshId);
                    if (targetMesh) {
                        rect.linkWithMesh(targetMesh); 
                    }
                });
            }

            return () => {
                for (const rect of rects) {
                    advancedTexture.removeControl(rect); 
                }
            }

      }, [labels, scene]);



    return (
        <div className='sceneview-container'>
            <canvas id='canvas' touch-action='none'/>
            {isLoading && <ProgressIndicator className='sceneview-progressbar' styles={{ itemDescription: { color: 'white', fontSize: 26, marginTop: 10 } }}
                description={`Loading (${Math.floor(loadProgress * 100)}%)...`} percentComplete={loadProgress} barHeight={10} />}
            {isLoading === undefined && <div className='sceneview-errormessage' style={{}}>Error loading model</div>}
        </div>
    )
}