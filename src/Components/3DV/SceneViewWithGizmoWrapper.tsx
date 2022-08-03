import React, {
    useCallback,
    useEffect,
    useReducer,
    useRef,
    useState
} from 'react';
import SceneView from './SceneView';
import {
    TransformedElementItem,
    TransformInfo
} from '../../Models/Classes/SceneView.types';
import { deepCopy } from '../../Models/Services/Utils';
import {
    ADT3DSceneBuilderReducer,
    defaultADT3DSceneBuilderState
} from '../ADT3DSceneBuilder/ADT3DSceneBuilder.state';
import {
    SET_GIZMO_ELEMENT_ITEM,
    SET_GIZMO_TRANSFORM_ITEM
} from '../ADT3DSceneBuilder/ADT3DSceneBuilder.types';
import { Checkbox, Stack, TextField } from '@fluentui/react';
import { useTranslation } from 'react-i18next';

interface ISceneViewWithGizmoWrapperProps {
    modelUrl: string;
    defaultGizmoElementItem: TransformedElementItem;
}

export const SceneViewWithGizmoWrapper = (
    props: ISceneViewWithGizmoWrapperProps
) => {
    const { modelUrl, defaultGizmoElementItem } = props;

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
                type: SET_GIZMO_ELEMENT_ITEM,
                payload: gizmoElementItem
            });
        },
        []
    );

    const onGizmoChange = useCallback((event, checked?: boolean) => {
        if (!checked) {
            setGizmoElementItem({ parentMeshId: null, meshIds: null });
        } else {
            setGizmoElementItem(defaultGizmoElementItem);
        }
        setIsGizmo(!!checked);
    }, []);

    return (
        <div style={{ position: 'relative' }}>
            <div>
                <Checkbox
                    label="Show Gizmo and Transform"
                    checked={isGizmo}
                    onChange={onGizmoChange}
                />
            </div>
            <div>
                <SceneView
                    modelUrl={modelUrl}
                    gizmoElementItem={
                        state.gizmoElementItem ?? defaultGizmoElementItem
                    }
                    setGizmoTransformItem={setGizmoTransformItem}
                    gizmoTransformItem={state.gizmoTransformItem}
                />
            </div>
            <div style={{ position: 'absolute', bottom: 0 }}>
                {isGizmo && (
                    <FakePanel
                        gizmoTransformItem={state.gizmoTransformItem}
                        setGizmoTransformItem={setGizmoTransformItem}
                    ></FakePanel>
                )}
            </div>
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
    const { t } = useTranslation();

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
                switch (name) {
                    case 'xPos':
                        gizmoTransformItemDraftRef.current.position.x = value;
                        break;
                    case 'yPos':
                        gizmoTransformItemDraftRef.current.position.y = value;
                        break;
                    case 'zPos':
                        gizmoTransformItemDraftRef.current.position.z = value;
                        break;
                    case 'xRot':
                        gizmoTransformItemDraftRef.current.rotation.x = value;
                        break;
                    case 'yRot':
                        gizmoTransformItemDraftRef.current.rotation.y = value;
                        break;
                    case 'zRot':
                        gizmoTransformItemDraftRef.current.rotation.z = value;
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
                    label={'X ' + t('3dSceneBuilder.transform.position') + ':'}
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
                    label={'Y ' + t('3dSceneBuilder.transform.position') + ':'}
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
                    label={'Z ' + t('3dSceneBuilder.transform.position') + ':'}
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
                    label={'X ' + t('3dSceneBuilder.transform.rotation') + ':'}
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
                    label={'Y ' + t('3dSceneBuilder.transform.rotation') + ':'}
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
                    label={'Z ' + t('3dSceneBuilder.transform.rotation') + ':'}
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
