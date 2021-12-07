import React from 'react';
import { SceneView } from './SceneView';
import { Marker } from '../../Models/Classes/SceneView.types';

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
            <SceneView modelUrl="https://3dvstoragecontainer.blob.core.windows.net/3dvblobcontainer/model/Car.gltf" />
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
            <SceneView modelUrl="https://3dvstoragecontainer.blob.core.windows.net/3dvblobcontainer/factory/4992245be3164456a07d1b237c24f016.gltf" />
        </div>
    );
};

export const Globe = () => {
    const markers: Marker[] = [
        {
            name: 'Ibhayi',
            latitude: -33.872,
            longitude: 25.571,
            color: BABYLON.Color3.Red(),
            isNav: true
        },
        {
            name: 'Ponta Grossa',
            latitude: -25.0994,
            longitude: -50.1583,
            color: BABYLON.Color3.Red(),
            isNav: true
        },
        {
            name: 'Putian',
            latitude: 25.433,
            longitude: 119.0167,
            color: BABYLON.Color3.Red(),
            isNav: true
        },
        {
            name: 'Magor',
            latitude: 51.5804,
            longitude: -2.833,
            color: BABYLON.Color3.Red(),
            isNav: true
        },
        {
            name: 'Ningbo',
            latitude: 29.8667,
            longitude: 121.55,
            color: BABYLON.Color3.Red(),
            isNav: true
        },
        {
            name: 'Passa Fundo',
            latitude: -28.2624,
            longitude: -52.409,
            color: BABYLON.Color3.Red(),
            isNav: true
        },
        {
            name: 'Tocancipa',
            latitude: 4.9667,
            longitude: -73.9167,
            color: BABYLON.Color3.Red(),
            isNav: true
        },
        {
            name: 'Leuven',
            latitude: 50.8795,
            longitude: 4.7005,
            color: BABYLON.Color3.Red(),
            isNav: true
        },
        {
            name: 'Uberlandia',
            latitude: -18.9231,
            longitude: -48.2886,
            color: BABYLON.Color3.Red(),
            isNav: true
        }
    ];

    const meshClick = (marker: Marker, mesh: any, e: any) => {
        if (!marker && !mesh && !e) {
            console.log('Hello');
        }
        // if (mesh) {
        //     (mesh.material as any).albedoColor = BABYLON.Color3.FromHexString(
        //         '#fff000'
        //     );
        // }
    };

    return (
        <div style={{ height: '100%', position: 'relative' }}>
            <SceneView
                modelUrl="https://3dvstoragecontainer.blob.core.windows.net/3dvblobcontainer/world/World3.gltf"
                markers={markers}
                onMarkerClick={(marker, mesh, e) => meshClick(marker, mesh, e)}
            />
        </div>
    );
};
