import React from 'react';
import { Marker, SceneView } from './SceneView';
import * as BABYLON from 'babylonjs';

export default {
    title: 'Components/SceneView'
};

export const Truck = () => {
    const meshClick = (marker: Marker, mesh: any, e: any) => {
        if (mesh) {
            (mesh.material as any).albedoColor = BABYLON.Color3.FromHexString(
                '#fff000'
            );
        }
    };

    return (
        <div
            style={{
                height: '400px',
                position: 'relative'
            }}
        >
            <SceneView
                modelUrl="https://3dvstoragecontainer.blob.core.windows.net/3dvblobcontainer/model/Car.gltf"
                cameraRadius={100}
                onMarkerClick={(marker, mesh, e) => meshClick(marker, mesh, e)}
            />
        </div>
    );
};

export const Factory = () => {
    const meshClick = (marker: Marker, mesh: any, e: any) => {
        if (mesh) {
            (mesh.material as any).albedoColor = BABYLON.Color3.FromHexString(
                '#fff000'
            );
        }
    };

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
                onMarkerClick={(marker, mesh, e) => meshClick(marker, mesh, e)}
            />
        </div>
    );
};
