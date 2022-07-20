import React from 'react';
import SceneView from './SceneView';
import {
    Marker,
    TransformedElementItem
} from '../../Models/Classes/SceneView.types';
import { ModelLabel } from '../ModelLabel/ModelLabel';
import { createGUID } from '../../Models/Services/Utils';
import { getDefaultStoryDecorator } from '../../Models/Services/StoryUtilities';
import { SceneViewWithGizmoWrapper } from './SceneViewWithGizmoWrapper';

const wrapperStyle = { width: 'auto', height: 'auto' };

export default {
    title: 'Components/SceneView',
    component: 'SceneView',
    decorators: [getDefaultStoryDecorator(wrapperStyle)],
    parameters: {
        chromatic: { delay: 10000 } // give the model time to load
    }
};

const defaultGizmoElementItem: TransformedElementItem = {
    meshIds: ['tank6_LOD0.003_primitive0', 'tank6_LOD0.003_primitive1'],
    parentMeshId: 'tank6_LOD0.003_primitive0'
};

export const Gizmo = () => {
    return (
        <div style={wrapperStyle}>
            <div style={{ flex: 1, width: '100%' }}>
                <SceneViewWithGizmoWrapper
                    modelUrl="https://cardboardresources.blob.core.windows.net/cardboard-mock-files/OutdoorTanks.gltf"
                    defaultGizmoElementItem={defaultGizmoElementItem}
                />
            </div>
        </div>
    );
};

export const Globe = () => {
    const markers: Marker[] = [
        {
            id: 'ID' + createGUID(),
            name: 'Ibhayi',
            UIElement: <ModelLabel label="Ibhayi" />,
            latitude: -33.872,
            longitude: 25.571,
            allowGrouping: true
        },
        {
            id: 'ID' + createGUID(),
            name: 'Ponta Grossa',
            UIElement: <ModelLabel label="Ponta Grossa" />,
            latitude: -25.0994,
            longitude: -50.1583,
            allowGrouping: true
        },
        {
            id: 'ID' + createGUID(),
            name: 'Putian',
            UIElement: <ModelLabel label="Putian" />,
            latitude: 25.433,
            longitude: 119.0167,
            allowGrouping: true
        },
        {
            id: 'ID' + createGUID(),
            name: 'Magor',
            UIElement: <ModelLabel label="Magor" />,
            latitude: 51.5804,
            longitude: -2.833,
            allowGrouping: true
        },
        {
            id: 'ID' + createGUID(),
            name: 'Ningbo',
            UIElement: <ModelLabel label="Ningbo" />,
            latitude: 29.8667,
            longitude: 121.55,
            allowGrouping: true
        },
        {
            id: 'ID' + createGUID(),
            name: 'Passa Fundo',
            UIElement: <ModelLabel label="Passa Fundo" />,
            latitude: -28.2624,
            longitude: -52.409,
            allowGrouping: true
        },
        {
            id: 'ID' + createGUID(),
            name: 'Tocancipa',
            UIElement: <ModelLabel label="Tocancipa" />,
            latitude: 4.9667,
            longitude: -73.9167,
            allowGrouping: true
        },
        {
            id: 'ID' + createGUID(),
            name: 'Leuven',
            UIElement: <ModelLabel label="Leuven" />,
            latitude: 50.8795,
            longitude: 4.7005,
            allowGrouping: true
        },
        {
            id: 'ID' + createGUID(),
            name: 'Uberlandia',
            UIElement: <ModelLabel label="Uberlandia" />,
            latitude: -18.9231,
            longitude: -48.2886,
            allowGrouping: true
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

export const MarkersWithSimpleModel = () => {
    const markers: Marker[] = [
        {
            name: 'Marker 1',
            id: 'id' + createGUID(),
            attachedMeshIds: ['Cube.003'],
            UIElement: <ModelLabel label={'Marker 1'} />,
            showIfOccluded: true,
            allowGrouping: true
        },

        {
            name: 'Marker 2',
            id: 'id' + createGUID(),
            attachedMeshIds: ['tank6_LOD0.016_primitive1'],
            showIfOccluded: true,
            UIElement: <ModelLabel label={'Marker 2'} />,
            allowGrouping: true
        },

        {
            name: 'Marker 3',
            id: 'id' + createGUID(),
            attachedMeshIds: ['tank1_LOD0'],
            showIfOccluded: true,
            UIElement: <ModelLabel label={'Marker 3'} />,
            allowGrouping: true
        },
        {
            name: 'Marker 4',
            id: 'id' + createGUID(),
            attachedMeshIds: ['tank3_LOD0.004_primitive0'],
            showIfOccluded: true,
            UIElement: <ModelLabel label={'Marker 5'} />,
            allowGrouping: true
        },
        {
            name: 'Marker 5',
            id: 'id' + createGUID(),
            attachedMeshIds: ['tank4_LOD0.007_primitive0'],
            showIfOccluded: true,
            UIElement: <ModelLabel label={'Marker 7'} />,
            allowGrouping: true
        },
        {
            name: 'Marker 6',
            id: 'id' + createGUID(),
            attachedMeshIds: ['tank6_LOD0.003_primitive0'],
            showIfOccluded: true,
            UIElement: <ModelLabel label={'Marker 8'} />,
            allowGrouping: true
        }
    ];

    return (
        <div style={wrapperStyle}>
            <div style={{ flex: 1, width: '100%' }}>
                <SceneView
                    modelUrl="https://cardboardresources.blob.core.windows.net/cardboard-mock-files/OutdoorTanks.gltf"
                    markers={markers}
                />
            </div>
        </div>
    );
};

export const MarkersWithComplexModel = () => {
    const markers: Marker[] = [
        {
            name: 'Marker 1',
            id: 'id' + createGUID(),
            attachedMeshIds: ['MODULE_SILOS_530_LOD1'],
            UIElement: <ModelLabel label={'Marker 1'} />,
            showIfOccluded: true,
            allowGrouping: true
        },
        {
            name: 'Marker 2',
            id: 'id' + createGUID(),
            attachedMeshIds: ['MODULE_SILOS_178_LOD1'],
            showIfOccluded: true,
            UIElement: <ModelLabel label={'Marker 2'} />,
            allowGrouping: true
        },
        {
            name: 'Marker 3',
            id: 'id' + createGUID(),
            attachedMeshIds: ['WAREHOUSE_001_LOD1_002'],
            showIfOccluded: true,
            UIElement: <ModelLabel label={'Marker 4'} />,
            allowGrouping: true
        },
        {
            name: 'Marker 4',
            id: 'id' + createGUID(),
            attachedMeshIds: ['Pipes_Foundation_20_LOD1_001'],
            showIfOccluded: true,
            UIElement: <ModelLabel label={'Marker 6'} />,
            allowGrouping: true
        },
        {
            name: 'Marker 5',
            id: 'id' + createGUID(),
            attachedMeshIds: ['pCube1_LOD1'],
            showIfOccluded: true,
            UIElement: <ModelLabel label={'Marker 7'} />,
            allowGrouping: true
        }
    ];

    return (
        <div style={wrapperStyle}>
            <div style={{ flex: 1, width: '100%' }}>
                <SceneView
                    modelUrl="https://cardboardresources.blob.core.windows.net/cardboard-mock-files/refinery_scene_textured_1m.glb"
                    markers={markers}
                />
            </div>
        </div>
    );
};

export const MarkersWithGroupingDisabled = () => {
    const markers: Marker[] = [
        {
            name: 'Marker 1',
            id: 'id' + createGUID(),
            attachedMeshIds: ['Cube.003'],
            UIElement: <ModelLabel label={'Marker 1'} />,
            showIfOccluded: true
        },

        {
            name: 'Marker 2',
            id: 'id' + createGUID(),
            attachedMeshIds: ['tank6_LOD0.016_primitive1'],
            showIfOccluded: true,
            UIElement: <ModelLabel label={'Marker 2'} />
        },

        {
            name: 'Marker 3',
            id: 'id' + createGUID(),
            attachedMeshIds: ['tank1_LOD0'],
            showIfOccluded: true,
            UIElement: <ModelLabel label={'Marker 3'} />
        },
        {
            name: 'Marker 4',
            id: 'id' + createGUID(),
            attachedMeshIds: ['tank3_LOD0.004_primitive0'],
            showIfOccluded: true,
            UIElement: <ModelLabel label={'Marker 5'} />
        },
        {
            name: 'Marker 5',
            id: 'id' + createGUID(),
            attachedMeshIds: ['tank4_LOD0.007_primitive0'],
            showIfOccluded: true,
            UIElement: <ModelLabel label={'Marker 7'} />
        },
        {
            name: 'Marker 6',
            id: 'id' + createGUID(),
            attachedMeshIds: ['tank6_LOD0.003_primitive0'],
            showIfOccluded: true,
            UIElement: <ModelLabel label={'Marker 8'} />
        }
    ];

    return (
        <div style={wrapperStyle}>
            <div style={{ flex: 1, width: '100%' }}>
                <SceneView
                    modelUrl="https://cardboardresources.blob.core.windows.net/cardboard-mock-files/OutdoorTanks.gltf"
                    markers={markers}
                />
            </div>
        </div>
    );
};
