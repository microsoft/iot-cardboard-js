import React, { useState } from 'react';
import { SceneViewCesium } from './SceneViewCesium';
import { Marker } from '../../Models/Classes/SceneView.types';

export default {
    title: 'Components/SceneViewCesium'
};

export const Globe = () => {
    const markers: Marker[] = [
        {
            name: 'San Francisco',
            latitude: 37.655,
            longitude: -122.4175,
            color: { r: 0, g: 255, b: 0 },
            isNav: true
        },
        {
            name: 'Ibhayi',
            latitude: -33.872,
            longitude: 25.571,
            color: { r: 255, g: 0, b: 0 },
            isNav: true
        },
        {
            name: 'Ponta Grossa',
            latitude: -25.0994,
            longitude: -50.1583,
            color: { r: 255, g: 0, b: 0 },
            isNav: true
        },
        {
            name: 'Putian',
            latitude: 25.433,
            longitude: 119.0167,
            color: { r: 255, g: 0, b: 0 },
            isNav: true
        },
        {
            name: 'Magor',
            latitude: 51.5804,
            longitude: -2.833,
            color: { r: 255, g: 0, b: 0 },
            isNav: true
        },
        {
            name: 'Ningbo',
            latitude: 29.8667,
            longitude: 121.55,
            color: { r: 255, g: 0, b: 0 },
            isNav: true
        },
        {
            name: 'Passa Fundo',
            latitude: -28.2624,
            longitude: -52.409,
            color: { r: 255, g: 0, b: 0 },
            isNav: true
        },
        {
            name: 'Tocancipa',
            latitude: 4.9667,
            longitude: -73.9167,
            color: { r: 255, g: 0, b: 0 },
            isNav: true
        },
        {
            name: 'Leuven',
            latitude: 50.8795,
            longitude: 4.7005,
            color: { r: 255, g: 0, b: 0 },
            isNav: true
        },
        {
            name: 'Uberlandia',
            latitude: -18.9231,
            longitude: -48.2886,
            color: { r: 255, g: 0, b: 0 },
            isNav: true
        }
    ];

    return (
        <div style={{ height: '100%', position: 'relative' }}>
            <SceneViewCesium modelUrl="Globe" markers={markers} />
        </div>
    );
};

export const Truck = () => {
    const [selectedMeshes, setSelectedMeshes] = useState<string[]>([]);
    const markerClick = (_marker: Marker, mesh: any) => {
        if (mesh?.name) {
            const meshes = [...selectedMeshes];
            const n = meshes.indexOf(mesh.name);
            if (n >= 0) {
                meshes.splice(n, 1);
            } else {
                meshes.push(mesh.name);
            }

            setSelectedMeshes(meshes);
        }
    };

    return (
        <div
            style={{
                height: '100%',
                position: 'relative'
            }}
        >
            <SceneViewCesium
                selectedMeshNames={selectedMeshes}
                modelUrl="https://3dvstoragecontainer.blob.core.windows.net/3dvblobcontainer/model/Car.gltf"
                onMarkerClick={(marker, mesh) => markerClick(marker, mesh)}
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
            <SceneViewCesium modelUrl="https://3dvstoragecontainer.blob.core.windows.net/3dvblobcontainer/factory/4992245be3164456a07d1b237c24f016.gltf" />
        </div>
    );
};

export const OilRig = () => {
    return (
        <div
            style={{
                height: '100%',
                position: 'relative'
            }}
        >
            <SceneViewCesium modelUrl="https://3dvstoragecontainer.blob.core.windows.net/3dvblobcontainer/Oil.gltf" />
        </div>
    );
};
