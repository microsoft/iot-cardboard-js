import React from 'react';
import { SceneView } from './SceneView';
import { Vector3 } from 'babylonjs';

export default {
    title: 'Components/SceneView'
};

export const Truck = () => {
    return (
        <div
            style={{
                height: '100%',
                position: 'relative'
            }}
        >
            <SceneView
                modelUrl="https://3dvstoragecontainer.blob.core.windows.net/3dvblobcontainer/model/Car.gltf"
                cameraRadius={800}
                cameraCenter={new Vector3(0, 100, 0)}
            />
        </div>
    );
};

export const Factory = () => {
    return (
        <div
            style={{
                height: '100%',
                position: 'relative'
            }}
        >
            <SceneView
                modelUrl="https://3dvstoragecontainer.blob.core.windows.net/3dvblobcontainer/factory/4992245be3164456a07d1b237c24f016.gltf"
                cameraRadius={100}
            />
        </div>
    );
};
