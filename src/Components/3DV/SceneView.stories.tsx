import React from 'react';
import SceneView from './SceneView';
import { Marker } from '../../Models/Classes/SceneView.types';
import { LocationBadge } from '../ADT3DGlobe/LocationBadge';

export default {
    title: 'Components/SceneView',
    component: 'SceneView'
};

export const Globe = () => {
    const markers: Marker[] = [
        {
            name: 'Ibhayi',
            latitude: -33.872,
            longitude: 25.571,
            color: '#f00',
            isNav: true
        },
        {
            name: 'Ponta Grossa',
            latitude: -25.0994,
            longitude: -50.1583,
            color: '#f00',
            isNav: true
        },
        {
            name: 'Putian',
            latitude: 25.433,
            longitude: 119.0167,
            color: '#f00',
            isNav: true
        },
        {
            name: 'Magor',
            latitude: 51.5804,
            longitude: -2.833,
            color: '#f00',
            isNav: true
        },
        {
            name: 'Ningbo',
            latitude: 29.8667,
            longitude: 121.55,
            color: '#f00',
            isNav: true
        },
        {
            name: 'Passa Fundo',
            latitude: -28.2624,
            longitude: -52.409,
            color: '#f00',
            isNav: true
        },
        {
            name: 'Tocancipa',
            latitude: 4.9667,
            longitude: -73.9167,
            color: '#f00',
            isNav: true
        },
        {
            name: 'Leuven',
            latitude: 50.8795,
            longitude: 4.7005,
            color: '#f00',
            isNav: true
        },
        {
            name: 'Uberlandia',
            latitude: -18.9231,
            longitude: -48.2886,
            color: '#f00',
            isNav: true
        }
    ];

    const meshClick = (mesh: any, e: any) => {
        if (!mesh && !e) {
            console.log('Hello');
        }
    };

    const marker = new Marker();
    marker.attachedMeshIds = ['tank4_LOD0.006_primitive2'];
    marker.ui = <LocationBadge label={'The tank'} />;

    return (
        <div style={{ height: '100%', position: 'relative', display: 'flex' }}>
            <div style={{ flex: 1, width: '100%' }}>
                <SceneView
                    modelUrl="Globe"
                    markers={markers}
                    onMeshClick={(mesh, e) => meshClick(mesh, e)}
                />
            </div>
        </div>
    );
};

export const Markers = () => {
    const meshClick = (mesh: any, e: any) => {
        if (!mesh && !e) {
            console.log('Hello');
        }
    };

    const marker = new Marker();
    marker.name = 'Text';
    marker.attachedMeshIds = ['Cube.003'];
    marker.color = '#ff0000';
    marker.ui = <LocationBadge label={"This one doesn't"} />;
    marker.showIfOccluded = true;

    const marker2 = new Marker();
    marker2.attachedMeshIds = ['tank6_LOD0.016_primitive1'];
    marker2.color = '#f00';
    marker2.ui = <LocationBadge label={'This one hides'} />;

    return (
        <div style={{ height: '100%', position: 'relative', display: 'flex' }}>
            <div style={{ flex: 1, width: '100%' }}>
                <SceneView
                    modelUrl="https://cardboardresources.blob.core.windows.net/cardboard-mock-files/OutdoorTanks.gltf"
                    markers={[marker, marker2]}
                    onMeshClick={(mesh, e) => meshClick(mesh, e)}
                />
            </div>
        </div>
    );
};
