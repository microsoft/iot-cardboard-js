import React, {useState} from "react";
import SceneComponent from "./SceneComponent";
import { Scene, SceneLoader, FreeCamera, Vector3, HemisphericLight, Mesh, PointerEventTypes } from "@babylonjs/core";
import "@babylonjs/loaders/glTF";


export default () => {
    let mouseDown = false;

    const [z, setZ] = useState(0);
    const [y, setY] = useState(0);

    const onSceneReady = async (scene: Scene) => {
        const camera = new FreeCamera("camera1", new Vector3(0, 5, -10), scene);
        camera.setTarget(Vector3.Zero());

        scene.onPointerObservable.add((pointerInfo) => {
            switch (pointerInfo.type) {
                case PointerEventTypes.POINTERDOWN:
                    mouseDown = true;
                    break;
                case PointerEventTypes.POINTERUP:
                    mouseDown = false;
                    break;
            }
        });

        const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);

        light.intensity = 0.7;

        SceneLoader.Append("https://3dvstoragecontainer.blob.core.windows.net/3dvblobcontainer/", "Cube.gltf", scene, function(scene) {
            console.log(scene)
        });
    }

    const onRender = (scene: any) => {
        const cube: Mesh = scene.getMeshByName("__root__");
        if(cube && mouseDown) {
            cube.rotation = new Vector3(cube.rotation.x, cube.rotation.y + 0.01, cube.rotation.z + 0.01);
            setZ(cube.rotation.z);
            setY(cube.rotation.y);
        }
    };

    return (
        <div style={{width: '100%', height: '500px', position: 'relative', fontFamily: 'sans-serif'}}>
            <SceneComponent antialias onSceneReady={onSceneReady} onRender={onRender} id="my-canvas" />
            <div style={{background: 'white', position: "absolute", width: '200px', height: '480px', left: '10px', top: '10px'}}>
                <div style={{fontSize: '16px', fontWeight: 'bold', margin: '10px'}}>Cube</div>
                <div style={{fontSize: '14px', margin: '10px'}}>Z rotation:<br/>{z}</div>
                <div style={{fontSize: '14px', margin: '10px'}}>Y rotation:<br/>{y}</div>
            </div>
        </div>
    )
};