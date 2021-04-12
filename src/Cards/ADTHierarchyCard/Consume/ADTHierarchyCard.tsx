import React, { useEffect, useReducer, useRef } from 'react';
import './ADTHierarchyCard.scss';
import BaseCard from '../../Base/Consume/BaseCard';
import useAdapter from '../../../Models/Hooks/useAdapter';
import { ADTHierarchyCardProps } from './ADTHierarchyCard.types';
import Hierarchy from '../../../Components/Hierarchy/Hierarchy';
import {
    ADTModelsData,
    ADTTwinsData,
    HierarchyNodeType,
    IADTModel,
    IADTTwin,
    IHierarchyNode
} from '../../../Models/Constants';
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
import { useTranslation } from 'react-i18next';

const ADTHierarchyCard: React.FC<ADTHierarchyCardProps> = ({
    adapter,
    title,
    theme,
    locale,
    localeStrings,
    onParentNodeClick,
    onChildNodeClick
}) => {
    const { t } = useTranslation();
    const focusedModelIdRef = useRef(null);
    const selectedTwinRef = useRef({ modelId: null, twinId: null });

    const [state, dispatch] = useReducer(
        ADTHierarchyCardConsumeReducer,
        defaultADTHierarchyCardConsumeState
    );
    const { hierarchyNodes } = state;

    const modelState = useAdapter({
        adapterMethod: (params) => adapter.getAdtModels(params?.nextLink),
        refetchDependencies: [adapter]
    });

    const twinState = useAdapter({
        adapterMethod: (params) =>
            adapter.getAdtTwins(params?.modelId, params?.continuationToken),
        refetchDependencies: []
    });

    const handleModelClick = (modelNode: IHierarchyNode) => {
        focusedModelIdRef.current = modelNode.id;
        if (onParentNodeClick) {
            onParentNodeClick(modelNode);
        } else {
            if (modelNode.isCollapsed) {
                twinState.callAdapter({ modelId: modelNode.id });
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
        }
    };

    useEffect(() => {
        if (modelState.adapterResult.result?.data.value) {
            const newModelNodes = HierarchyNode.createNodesFromADTModels(
                modelState.adapterResult.result?.data?.value as IADTModel[]
            );

            const modelsNextLink = (modelState.adapterResult.result
                ?.data as ADTModelsData)?.nextLink;

            const currentNodes = { ...hierarchyNodes };

            const showMoreId = 'models-show-more';
            delete currentNodes[showMoreId]; // remove the current show more node if exist
            const showMoreNode = modelsNextLink
                ? {
                      [showMoreId]: {
                          id: showMoreId,
                          name: t('showMore'),
                          nodeType: HierarchyNodeType.ShowMore,
                          onNodeClick: () => {
                              modelState.callAdapter({
                                  nextLink: modelsNextLink
                              });
                          }
                      } as IHierarchyNode
                  }
                : null;

            dispatch({
                type: SET_ADT_HIERARCHY_NODES,
                payload: {
                    ...currentNodes,
                    ...newModelNodes,
                    ...showMoreNode
                }
            });
        }
    }, [modelState.adapterResult.result?.data.value]);

    useEffect(() => {
        if (
            focusedModelIdRef.current &&
            twinState.adapterResult.result?.data.value
        ) {
            const focusedModelId = focusedModelIdRef.current;
            const newTwinNodes = HierarchyNode.createNodesFromADTTwins(
                twinState.adapterResult.result?.data?.value as IADTTwin[],
                hierarchyNodes[focusedModelId]
            );

            const twinsContinuationToken = (twinState.adapterResult.result
                ?.data as ADTTwinsData)?.continuationToken;
            const currentChildren = !hierarchyNodes[focusedModelId].isCollapsed
                ? {
                      ...hierarchyNodes[focusedModelId].children
                  }
                : {};

            const showMoreId = `${focusedModelId}-show-more`;
            delete currentChildren[showMoreId]; // remove the current show more node if exist
            const showMoreNode = twinsContinuationToken
                ? {
                      [showMoreId]: {
                          id: `${focusedModelId}-show-more`,
                          name: t('showMore'),
                          nodeType: HierarchyNodeType.ShowMore,
                          onNodeClick: () => {
                              focusedModelIdRef.current = focusedModelId;
                              twinState.callAdapter({
                                  modelId: focusedModelId,
                                  continuationToken: twinsContinuationToken
                              });
                          }
                      } as IHierarchyNode
                  }
                : null;

            dispatch({
                type: SET_ADT_HIERARCHY_NODE_PROPERTIES,
                payload: {
                    modelId: focusedModelId,
                    properties: {
                        isCollapsed: false,
                        children: {
                            ...currentChildren,
                            ...newTwinNodes,
                            ...showMoreNode
                        },
                        childrenContinuationToken: twinsContinuationToken
                    }
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
