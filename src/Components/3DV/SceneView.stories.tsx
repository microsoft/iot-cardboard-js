import React from 'react';
import { SceneView } from './SceneView';

export default {
    title: 'Components/SceneView'
};

export const Truck = () => {
    return (
        <div
            style={{
                height: '400px',
                position: 'relative'
            }}
        >
            <SceneView
                modelUrl="https://3dvstoragecontainer.blob.core.windows.net/3dvblobcontainer/model/Car.gltf"
                cameraRadius={800}
            />
        </div>
    );
};

export const Factory = () => {
    return (
        <div
            style={{
                height: '400px',
                position: 'relative'
            }}
        >
            <SceneView
                modelUrl="https://3dvstoragecontainer.blob.core.windows.net/3dvblobcontainer/engine/4992245be3164456a07d1b237c24f016.obj"
                cameraRadius={100}
            />
        </div>
    );
};
