import React from 'react';
import SceneView from './SceneView';
import { Marker } from '../../Models/Classes/SceneView.types';

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
        <div style={{ height: '100%', position: 'relative', display: 'flex' }}>
            <div style={{ flex: 1, width: '100%' }}>
                <SceneView
                    modelUrl="Globe"
                    markers={markers}
                    onMeshClick={(marker, mesh, e) =>
                        meshClick(marker, mesh, e)
                    }
                />
            </div>
        </div>
    );
};
