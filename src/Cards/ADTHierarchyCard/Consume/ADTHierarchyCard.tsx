import React, { useEffect, useReducer, useRef } from 'react';
import './ADTHierarchyCard.scss';
import BaseCard from '../../Base/Consume/BaseCard';
import useAdapter from '../../../Models/Hooks/useAdapter';
import { ADTHierarchyCardProps } from './ADTHierarchyCard.types';
import Hierarchy from '../../../Components/Hierarchy/Hierarchy';
import { IADTModel, IADTTwin, IHierarchyNode } from '../../../Models/Constants';
import { HierarchyNode } from '../../../Models/Classes/HierarchyNode';
import {
    ADTHierarchyCardConsumeReducer,
    defaultADTHierarchyCardConsumeState
} from './ADTHierarchyCard.state';
import {
    SET_ADT_HIERARCHY_NODES,
    SET_ADT_HIERARCHY_NODE_PROPERTIES,
    SET_ADT_HIERARCHY_SELECTED_TWIN_ID
} from '../../../Models/Constants/ActionTypes';

const ADTHierarchyCard: React.FC<ADTHierarchyCardProps> = ({
    adapter,
    title,
    theme,
    locale,
    localeStrings,
    onParentNodeClick,
    onChildNodeClick
}) => {
    const selectedModelNodeRef = useRef(null);
    const selectedTwinRef = useRef({ modelId: null, twinId: null });

    const [state, dispatch] = useReducer(
        ADTHierarchyCardConsumeReducer,
        defaultADTHierarchyCardConsumeState
    );
    const { hierarchyNodes } = state;

    const modelState = useAdapter({
        adapterMethod: () => adapter.getAdtModels(),
        refetchDependencies: [adapter]
    });

    const twinState = useAdapter({
        adapterMethod: () =>
            adapter.getAdtTwins(selectedModelNodeRef.current?.id),
        refetchDependencies: []
    });

    const handleModelClick = (modelNode: IHierarchyNode) => {
        if (onParentNodeClick) {
            onParentNodeClick(modelNode);
        } else {
            selectedModelNodeRef.current = modelNode;
            if (modelNode.isCollapsed) {
                twinState.callAdapter();
            } else {
                dispatch({
                    type: SET_ADT_HIERARCHY_NODE_PROPERTIES,
                    payload: {
                        modelId: modelNode.id,
                        properties: { isCollapsed: true }
                    }
                });
            }
        }
    };

    const handleTwinClick = (
        modelNode: IHierarchyNode,
        twinNode: IHierarchyNode
    ) => {
        dispatch({
            type: SET_ADT_HIERARCHY_SELECTED_TWIN_ID,
            payload: {
                modelId: modelNode.id,
                twinId: twinNode.id,
                previouslySelectedTwin: selectedTwinRef.current
            }
        });
        selectedTwinRef.current = {
            modelId: modelNode.id,
            twinId: twinNode.id
        };

        if (onChildNodeClick) {
            onChildNodeClick(modelNode, twinNode);
        } else {
            console.log(modelNode.id + ': ' + twinNode.id);
        }
    };

    useEffect(() => {
        if (modelState.adapterResult.result?.data.value) {
            dispatch({
                type: SET_ADT_HIERARCHY_NODES,
                payload: HierarchyNode.fromADTModels(
                    modelState.adapterResult.result?.data?.value as IADTModel[]
                )
            });
        }
    }, [modelState.adapterResult.result?.data.value]);

    useEffect(() => {
        if (
            selectedModelNodeRef.current &&
            twinState.adapterResult.result?.data.value
        ) {
            const twinNodes = HierarchyNode.fromADTTwins(
                twinState.adapterResult.result?.data?.value as IADTTwin[],
                selectedModelNodeRef.current
            );
            dispatch({
                type: SET_ADT_HIERARCHY_NODE_PROPERTIES,
                payload: {
                    modelId: selectedModelNodeRef.current.id,
                    properties: { isCollapsed: false, children: twinNodes }
                }
            });
        }
    }, [twinState.adapterResult.result?.data.value]);

    return (
        <BaseCard
            title={title}
            isLoading={
                modelState.isLoading && modelState.adapterResult.hasNoData()
            }
            adapterResult={modelState.adapterResult}
            theme={theme}
            locale={locale}
            localeStrings={localeStrings}
        >
            <Hierarchy
                data={hierarchyNodes}
                onParentNodeClick={(model: IHierarchyNode) =>
                    handleModelClick(model)
                }
                onChildNodeClick={(
                    model: IHierarchyNode,
                    twin: IHierarchyNode
                ) => handleTwinClick(model, twin)}
            ></Hierarchy>
        </BaseCard>
    );
};

export default ADTHierarchyCard;
