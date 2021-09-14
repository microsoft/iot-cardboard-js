// THIS CODE AND INFORMATION IS PROVIDED AS IS WITHOUT WARRANTY OF
// ANY KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING BUT NOT LIMITED TO
// THE IMPLIED WARRANTIES OF MERCHANTABILITY AND/OR FITNESS FOR A
// PARTICULAR PURPOSE.
//
// Copyright (c) Microsoft. All rights reserved
//

import React, {useState, useEffect} from 'react';
import * as BABYLON from 'babylonjs';
import 'babylonjs-loaders';
import { ProgressIndicator } from '@fluentui/react';
import "@babylonjs/loaders/glTF";
import './SceneView.scss';

interface SceneViewProps {
    root: string;
    gtlfFile: string;
    cameraRadius:number; 
    cameraCenter?: any;
}

async function loadPromise(root, file, scene, onProgress: any, onError: any): Promise<BABYLON.AssetContainer> {
    return new Promise((resolve) => {
        BABYLON.SceneLoader.LoadAssetContainer(root, file, scene,
        (container) => { resolve(container); }, (e) => onProgress(e), () => onError());
    });
}

export const SceneView: React.FC<SceneViewProps> = ({root, gtlfFile, cameraRadius, cameraCenter}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [loadProgress, setLoadProgress] = useState(0);

    useEffect(() => {
        const canvas = document.getElementById('canvas') as HTMLCanvasElement;
        const engine = new BABYLON.Engine(canvas, true);
        const scene = new BABYLON.Scene(engine);
        scene.clearColor = new BABYLON.Color4(9 / 255, 8 / 255, 35 / 255);
        const center = cameraCenter || new BABYLON.Vector3(0, 0, 0);
        const camera = new BABYLON.ArcRotateCamera('camera', 3.2, Math.PI / 2.5, cameraRadius, center, scene, true);
        camera.attachControl(canvas, false);
    
        new BABYLON.HemisphericLight('light', new BABYLON.Vector3(1, 1, 0), scene);
        new BABYLON.HemisphericLight('light', new BABYLON.Vector3(-1, -1, 0), scene);
        new BABYLON.HemisphericLight('light', new BABYLON.Vector3(1, -1, 0), scene);
        new BABYLON.HemisphericLight('light', new BABYLON.Vector3(-1, 1, 0), scene);

        async function load (scene: any) {
            const assets = await loadPromise(root, gtlfFile, scene, (e) => onProgress(e), () => setIsLoading(undefined));
            assets.addAllToScene();
            setIsLoading(false);
        }

        if (root && gtlfFile) {
            load(scene);
        }
        
        engine.runRenderLoop(() => { scene.render(); });
        window.addEventListener('resize', () => { engine.resize(); });

        function onProgress(e: any) {
            if (e.total) {
                //ToDo get prpgress working
                // setLoadProgress(e.loaded/e.total);
            } else {
                setLoadProgress(0);
            }
        }
      });



    return (
        <div className='container'>
            <canvas id='canvas' touch-action='none'/>
            {isLoading && <ProgressIndicator className='progressbar' styles={{ itemDescription: { color: 'white', fontSize: 26, marginTop: 10 } }}
                description={`Loading (${Math.floor(loadProgress * 100)}%)...`} percentComplete={loadProgress} barHeight={10} />}
            {isLoading === undefined && <div className='errormessage' style={{}}>Error loading model</div>}
        </div>
    )
}