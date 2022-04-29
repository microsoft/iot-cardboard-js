import React from 'react';
import SceneView from './SceneView';
import { Marker } from '../../Models/Classes/SceneView.types';
import { ModelLabel } from '../ModelLabel/ModelLabel';
import { createGUID } from '../../Models/Services/Utils';
import { getDefaultStoryDecorator } from '../../Models/Services/StoryUtilities';

const wrapperStyle = { width: 'auto', height: 'auto' };

export default {
    title: 'Components/SceneView',
    component: 'SceneView',
    decorators: [getDefaultStoryDecorator(wrapperStyle)]
};

export const Globe = () => {
    const markers: Marker[] = [
        {
            id: 'ID' + createGUID(),
            name: 'Ibhayi',
            UIElement: <ModelLabel label="Ibhayi" />,
            latitude: -33.872,
            longitude: 25.571
        },
        {
            id: 'ID' + createGUID(),
            name: 'Ponta Grossa',
            UIElement: <ModelLabel label="Ponta Grossa" />,
            latitude: -25.0994,
            longitude: -50.1583
        },
        {
            id: 'ID' + createGUID(),
            name: 'Putian',
            UIElement: <ModelLabel label="Putian" />,
            latitude: 25.433,
            longitude: 119.0167
        },
        {
            id: 'ID' + createGUID(),
            name: 'Magor',
            UIElement: <ModelLabel label="Magor" />,
            latitude: 51.5804,
            longitude: -2.833
        },
        {
            id: 'ID' + createGUID(),
            name: 'Ningbo',
            UIElement: <ModelLabel label="Ningbo" />,
            latitude: 29.8667,
            longitude: 121.55
        },
        {
            id: 'ID' + createGUID(),
            name: 'Passa Fundo',
            UIElement: <ModelLabel label="Passa Fundo" />,
            latitude: -28.2624,
            longitude: -52.409
        },
        {
            id: 'ID' + createGUID(),
            name: 'Tocancipa',
            UIElement: <ModelLabel label="Tocancipa" />,
            latitude: 4.9667,
            longitude: -73.9167
        },
        {
            id: 'ID' + createGUID(),
            name: 'Leuven',
            UIElement: <ModelLabel label="Leuven" />,
            latitude: 50.8795,
            longitude: 4.7005
        },
        {
            id: 'ID' + createGUID(),
            name: 'Uberlandia',
            UIElement: <ModelLabel label="Uberlandia" />,
            latitude: -18.9231,
            longitude: -48.2886
        }
    ];

    const meshClick = (mesh: any, e: any) => {
        if (!mesh && !e) {
            console.log('Hello');
        }
    };

    return (
        <div style={wrapperStyle}>
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

    const marker: Marker = {
        name: 'Marker 1',
        id: 'id' + createGUID(),
        attachedMeshIds: ['Cube.003'],
        UIElement: <ModelLabel label={"This one doesn't"} />,
        showIfOccluded: true
    };

    const marker2: Marker = {
        name: 'Marker 2',
        id: 'id' + createGUID(),
        attachedMeshIds: ['tank6_LOD0.016_primitive1'],
        showIfOccluded: true,
        UIElement: <ModelLabel label={'This one hides'} />
    };

    return (
        <div style={wrapperStyle}>
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
