import React, {
    forwardRef,
    useCallback,
    useEffect,
    useImperativeHandle,
    useReducer,
    useRef
} from 'react';
import './ADTModelListCard.scss';
import { ADTModelListCardProps } from './ADTModelListCard.types';
import BaseCard from '../../Base/Consume/BaseCard';
import useAdapter from '../../../Models/Hooks/useAdapter';
import Hierarchy from '../../../Components/Hierarchy/Hierarchy';
import { ADTModelsApiData } from '../../../Models/Constants/Types';
import { HierarchyNode } from '../../../Models/Classes/HierarchyNode';
import { useTranslation } from 'react-i18next';
import { HierarchyNodeType } from '../../../Models/Constants/Enums';
import {
    ADTModelListCardConsumeReducer,
    defaultADTModelListCardState
} from './ADTModelListCard.state';
import {
    SET_ADT_HIERARCHY_NODES,
    SET_ADT_HIERARCHY_NODE_PROPERTIES
} from '../../../Models/Constants/ActionTypes';
import {
    IADTModel,
    IHierarchyNode
} from '../../../Models/Constants/Interfaces';
import { ActionButton } from '@fluentui/react';

function ADTModelListCard(props: ADTModelListCardProps, ref) {
    const {
        adapter,
        title,
        theme,
        locale,
        localeStrings,
        onModelClick,
        onNewModelClick,
        selectedModelId
    } = props;

    const { t } = useTranslation();
    const modelState = useAdapter({
        adapterMethod: () =>
            adapter.getADTModels({ shouldIncludeDefinitions: true }),
        refetchDependencies: [adapter]
    });

    const [state, dispatch] = useReducer(
        ADTModelListCardConsumeReducer,
        defaultADTModelListCardState
    );
    const { nodes, searchTerm } = state;
    const focusedModelIdRef = useRef(null);

    useImperativeHandle(ref, () => ({
        addNewModel: (model: IADTModel) => {
            const newModelNode = HierarchyNode.createNodesFromADTModels(
                [model],
                HierarchyNodeType.Child
            );
            dispatch({
                type: SET_ADT_HIERARCHY_NODES,
                payload: {
                    ...newModelNode,
                    ...nodes
                }
            });
        },
        deleteModel: (id: string) => {
            const currentNodes = { ...nodes };
            delete currentNodes[id];
            dispatch({
                type: SET_ADT_HIERARCHY_NODES,
                payload: currentNodes
            });
        }
    }));

    useEffect(() => {
        focusedModelIdRef.current = selectedModelId;
        if (selectedModelId) {
            modelState.cancelAdapter(true);
            dispatch({
                type: SET_ADT_HIERARCHY_NODE_PROPERTIES,
                payload: {
                    modelId: selectedModelId,
                    properties: { isSelected: true }
                }
            });
        } else if (state.selectedModelId) {
            modelState.cancelAdapter(true);
            dispatch({
                type: SET_ADT_HIERARCHY_NODE_PROPERTIES,
                payload: {
                    modelId: state.selectedModelId,
                    properties: { isSelected: false }
                }
            });
        }
    }, [selectedModelId]);

    useEffect(() => {
        if (!modelState.adapterResult.hasNoData()) {
            const newModelNodes = HierarchyNode.createNodesFromADTModels(
                modelState.adapterResult.result?.data?.value,
                HierarchyNodeType.Child
            );

            const modelsNextLink = (modelState.adapterResult.result
                ?.data as ADTModelsApiData)?.nextLink;

            const currentNodes = { ...nodes };

            const showMoreId = 'models-show-more';
            delete currentNodes[showMoreId]; // remove the current show more node if exist
            const showMoreNode = modelsNextLink
                ? {
                      [showMoreId]: {
                          id: showMoreId,
                          name: t('showMore'),
                          nodeType: HierarchyNodeType.ShowMore,
                          onNodeClick: () => {
                              modelState.cancelAdapter(true);
                              focusedModelIdRef.current = showMoreId;
                              dispatch({
                                  type: SET_ADT_HIERARCHY_NODE_PROPERTIES,
                                  payload: {
                                      modelId: showMoreId,
                                      properties: { isLoading: true }
                                  }
                              });
                              modelState.callAdapter({
                                  continuationToken: new URLSearchParams(
                                      modelsNextLink
                                  ).get('continuationToken')
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
    }, [modelState.adapterResult.result]);

    const handleModelClick = useCallback(
        (_parentNode: IHierarchyNode, node: IHierarchyNode) => {
            if (onModelClick) {
                onModelClick(node);
            }
            modelState.cancelAdapter(true);
            dispatch({
                type: SET_ADT_HIERARCHY_NODE_PROPERTIES,
                payload: {
                    modelId: node.id,
                    properties: { isSelected: true }
                }
            });
            focusedModelIdRef.current = node.id;
        },
        []
    );

    return (
        <div className="cb-adt-model-list-wrapper">
            <BaseCard
                title={title}
                isLoading={
                    modelState.isLoading && modelState.adapterResult.hasNoData()
                }
                adapterResult={modelState.adapterResult}
                hideInfoBox={true}
                theme={theme}
                locale={locale}
                localeStrings={localeStrings}
            >
                <div className="cb-adt-model-list-actions">
                    <ActionButton
                        iconProps={{ iconName: 'Add' }}
                        onClick={() => {
                            if (onNewModelClick) {
                                onNewModelClick();
                            }
                        }}
                    >
                        {t('new')}
                    </ActionButton>
                </div>
                <div className="cb-adt-model-list">
                    <Hierarchy
                        data={nodes}
                        onChildNodeClick={handleModelClick}
                        searchTermToMark={searchTerm}
                        isLoading={modelState.isLoading}
                        noDataText={t('noModels')}
                    ></Hierarchy>
                </div>
            </BaseCard>
        </div>
    );
}

export default forwardRef(ADTModelListCard);
