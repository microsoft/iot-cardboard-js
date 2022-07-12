import React, {
    useCallback,
    useEffect,
    useReducer,
    useRef,
    useState
} from 'react';
import SceneView from './SceneView';
import {
    Marker,
    TransformedElementItem,
    TransformInfo
} from '../../Models/Classes/SceneView.types';
import { ModelLabel } from '../ModelLabel/ModelLabel';
import { createGUID, deepCopy } from '../../Models/Services/Utils';
import { getDefaultStoryDecorator } from '../../Models/Services/StoryUtilities';
import {
    ADT3DSceneBuilderReducer,
    defaultADT3DSceneBuilderState
} from '../ADT3DSceneBuilder/ADT3DSceneBuilder.state';
import {
    SET_ELEMENT_TO_GIZMO,
    SET_GIZMO_TRANSFORM_ITEM
} from '../ADT3DSceneBuilder/ADT3DSceneBuilder.types';
import { Checkbox, Stack, TextField } from '@fluentui/react';

const wrapperStyle = { width: 'auto', height: 'auto' };

export default {
    title: 'Components/SceneView',
    component: 'SceneView',
    decorators: [getDefaultStoryDecorator(wrapperStyle)],
    parameters: {
        chromatic: { delay: 10000 } // give the model time to load
    }
};

export const SceneViewTransform = () => {
    return (
        <div>
            <div style={wrapperStyle}>
                <div style={{ flex: 1, width: '100%' }}>
                    <SceneView
                        modelUrl="https://cardboardresources.blob.core.windows.net/cardboard-mock-files/OutdoorTanks.gltf"
                        transformedElementItems={[]}
                    />
                </div>
            </div>
        </div>
    );
};

const defaultGizmoElementItems: TransformedElementItem = {
    meshIds: ['tank6_LOD0.003_primitive0', 'tank6_LOD0.003_primitive1'],
    parentMeshId: 'tank6_LOD0.003_primitive0'
};

export const SceneViewGizmo = () => {
    const [state, dispatch] = useReducer(
        ADT3DSceneBuilderReducer,
        defaultADT3DSceneBuilderState
    );
    const [isGizmo, setIsGizmo] = useState<boolean>(true);

    const setGizmoTransformItem = useCallback(
        (gizmoTransformItem: TransformInfo) => {
            dispatch({
                type: SET_GIZMO_TRANSFORM_ITEM,
                payload: gizmoTransformItem
            });
            console.log(
                'new position: ',
                gizmoTransformItem.position,
                '\nnew rotation: ',
                gizmoTransformItem.rotation
            );
        },
        []
    );

    const setGizmoElementItem = useCallback(
        (gizmoElementItem: TransformedElementItem) => {
            dispatch({
                type: SET_ELEMENT_TO_GIZMO,
                payload: gizmoElementItem
            });
        },
        []
    );

    const onGizmoChange = useCallback((event, checked?: boolean) => {
        if (!checked) {
            setGizmoElementItem({ parentMeshId: null, meshIds: null });
        } else {
            setGizmoElementItem(defaultGizmoElementItems);
        }
        setIsGizmo(!!checked);
    }, []);

    return (
        <div>
            <Checkbox
                label="Show Gizmo and Transform"
                checked={isGizmo}
                onChange={onGizmoChange}
            />
            <div style={wrapperStyle}>
                <div style={{ flex: 1, width: '100%' }}>
                    <SceneView
                        modelUrl="https://cardboardresources.blob.core.windows.net/cardboard-mock-files/OutdoorTanks.gltf"
                        gizmoElementItem={
                            state.gizmoElementItem ?? defaultGizmoElementItems
                        }
                        setGizmoTransformItem={setGizmoTransformItem}
                        gizmoTransformItem={state.gizmoTransformItem}
                    />
                </div>
            </div>
            {isGizmo && (
                <FakePanel
                    gizmoTransformItem={state.gizmoTransformItem}
                    setGizmoTransformItem={setGizmoTransformItem}
                ></FakePanel>
            )}
        </div>
    );
};

interface IFakePanelProps {
    gizmoTransformItem: TransformInfo;
    setGizmoTransformItem?: (gizmoTransformItem: TransformInfo) => void;
}

const FakePanel = (props: IFakePanelProps) => {
    const { gizmoTransformItem, setGizmoTransformItem } = props;
    const gizmoTransformItemDraftRef = useRef<TransformInfo>(null);

    useEffect(() => {
        if (gizmoTransformItem) {
            gizmoTransformItemDraftRef.current = deepCopy(gizmoTransformItem);
        }
    }, [gizmoTransformItem]);

    const onTransformChange = useCallback(
        (event) => {
            if (gizmoTransformItem) {
                const { name, value } = event.target;
                gizmoTransformItemDraftRef.current = deepCopy(
                    gizmoTransformItem
                );
                const valueAsNumber = value;
                switch (name) {
                    case 'xPos':
                        gizmoTransformItemDraftRef.current.position.x = valueAsNumber;
                        break;
                    case 'yPos':
                        gizmoTransformItemDraftRef.current.position.y = valueAsNumber;
                        break;
                    case 'zPos':
                        gizmoTransformItemDraftRef.current.position.z = valueAsNumber;
                        break;
                    case 'xRot':
                        gizmoTransformItemDraftRef.current.rotation.x = valueAsNumber;
                        break;
                    case 'yRot':
                        gizmoTransformItemDraftRef.current.rotation.y = valueAsNumber;
                        break;
                    case 'zRot':
                        gizmoTransformItemDraftRef.current.rotation.z = valueAsNumber;
                        break;
                }
                setGizmoTransformItem(gizmoTransformItemDraftRef.current);
            }
        },
        [gizmoTransformItem]
    );

    const onTransformBlur = useCallback(() => {
        setGizmoTransformItem({
            position: {
                x: Number(gizmoTransformItem.position.x),
                y: Number(gizmoTransformItem.position.y),
                z: Number(gizmoTransformItem.position.z)
            },
            rotation: {
                x: Number(gizmoTransformItem.rotation.x),
                y: Number(gizmoTransformItem.rotation.y),
                z: Number(gizmoTransformItem.rotation.z)
            }
        });
    }, [gizmoTransformItem]);

    return (
        <div style={{ padding: '20px' }}>
            <Stack tokens={{ childrenGap: 12 }} horizontal>
                <TextField
                    label="X Position: "
                    name="xPos"
                    type="number"
                    onChange={onTransformChange}
                    onBlur={onTransformBlur}
                    value={
                        gizmoTransformItem
                            ? '' + gizmoTransformItem.position.x
                            : ''
                    }
                ></TextField>
                <TextField
                    label="Y Position: "
                    name="yPos"
                    type="number"
                    onChange={onTransformChange}
                    onBlur={onTransformBlur}
                    value={
                        gizmoTransformItem
                            ? '' + gizmoTransformItem.position.y
                            : ''
                    }
                ></TextField>
                <TextField
                    label="Z Position: "
                    name="zPos"
                    type="number"
                    onChange={onTransformChange}
                    onBlur={onTransformBlur}
                    value={
                        gizmoTransformItem
                            ? '' + gizmoTransformItem.position.z
                            : ''
                    }
                ></TextField>
            </Stack>
            <Stack tokens={{ childrenGap: 12 }} horizontal>
                <TextField
                    label="X Rotation: "
                    name="xRot"
                    type="number"
                    onChange={onTransformChange}
                    onBlur={onTransformBlur}
                    validateOnFocusOut
                    value={
                        gizmoTransformItem
                            ? '' + gizmoTransformItem.rotation.x
                            : ''
                    }
                ></TextField>
                <TextField
                    label="Y Rotation: "
                    name="yRot"
                    type="number"
                    onChange={onTransformChange}
                    onBlur={onTransformBlur}
                    value={
                        gizmoTransformItem
                            ? '' + gizmoTransformItem.rotation.y
                            : ''
                    }
                ></TextField>
                <TextField
                    label="Z Rotation: "
                    name="zRot"
                    type="number"
                    onChange={onTransformChange}
                    onBlur={onTransformBlur}
                    value={
                        gizmoTransformItem
                            ? '' + gizmoTransformItem.rotation.z
                            : ''
                    }
                ></TextField>
            </Stack>
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
