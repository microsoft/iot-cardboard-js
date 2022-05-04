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
        UIElement: <ModelLabel label={'Marker 1'} />,
        showIfOccluded: true
    };

    const marker2: Marker = {
        name: 'Marker 2',
        id: 'id' + createGUID(),
        attachedMeshIds: ['tank6_LOD0.016_primitive1'],
        showIfOccluded: true,
        UIElement: <ModelLabel label={'Marker 2'} />
    };

    const marker3: Marker = {
        name: 'Marker 3',
        id: 'id' + createGUID(),
        attachedMeshIds: ['tank1_LOD0'],
        showIfOccluded: true,
        UIElement: <ModelLabel label={'Marker 3'} />
    };

    const marker4: Marker = {
        name: 'Marker 4',
        id: 'id' + createGUID(),
        attachedMeshIds: ['tank3_LOD0_primitive2'],
        showIfOccluded: true,
        UIElement: <ModelLabel label={'Marker 4'} />
    };

    const marker5: Marker = {
        name: 'Marker 5',
        id: 'id' + createGUID(),
        attachedMeshIds: ['tank3_LOD0.004_primitive0'],
        showIfOccluded: true,
        UIElement: <ModelLabel label={'Marker 5'} />
    };

    const marker6: Marker = {
        name: 'Marker 6',
        id: 'id' + createGUID(),
        attachedMeshIds: ['tank4_LOD0_primitive0'],
        showIfOccluded: true,
        UIElement: <ModelLabel label={'Marker 6'} />
    };

    const marker7: Marker = {
        name: 'Marker 7',
        id: 'id' + createGUID(),
        attachedMeshIds: ['tank4_LOD0.007_primitive0'],
        showIfOccluded: true,
        UIElement: <ModelLabel label={'Marker 7'} />
    };

    const marker8: Marker = {
        name: 'Marker 8',
        id: 'id' + createGUID(),
        attachedMeshIds: ['tank6_LOD0.003_primitive0'],
        showIfOccluded: true,
        UIElement: <ModelLabel label={'Marker 8'} />
    };

    const marker9: Marker = {
        name: 'Marker 9',
        id: 'id' + createGUID(),
        attachedMeshIds: ['tank6_LOD0.015_primitive0'],
        showIfOccluded: true,
        UIElement: <ModelLabel label={'Marker 9'} />
    };

    const marker10: Marker = {
        name: 'Marker 10',
        id: 'id' + createGUID(),
        attachedMeshIds: ['shellAndMisc_primitive1'],
        showIfOccluded: true,
        UIElement: <ModelLabel label={'Marker 10'} />
    };

    const marker11: Marker = {
        name: 'Marker 11',
        id: 'id' + createGUID(),
        attachedMeshIds: ['Cube.013'],
        showIfOccluded: true,
        UIElement: <ModelLabel label={'Marker 11'} />
    };

    return (
        <div style={wrapperStyle}>
            <div style={{ flex: 1, width: '100%' }}>
                <SceneView
                    modelUrl="https://cardboardresources.blob.core.windows.net/cardboard-mock-files/OutdoorTanks.gltf"
                    markers={[
                        marker,
                        marker2,
                        marker3,
                        marker4,
                        marker5,
                        marker6,
                        marker7,
                        marker8,
                        marker9,
                        marker10,
                        marker11
                    ]}
                    onMeshClick={(mesh, e) => meshClick(mesh, e)}
                />
            </div>
        </div>
    );
};
