import React, { useCallback, useEffect, useReducer, useRef } from 'react';
import './ADTHierarchyCard.scss';
import BaseCard from '../../Base/Consume/BaseCard';
import useAdapter from '../../../Models/Hooks/useAdapter';
import { ADTHierarchyCardProps } from './ADTHierarchyCard.types';
import Hierarchy from '../../../Components/Hierarchy/Hierarchy';
import {
    AdapterMethodParamsForGetADTModels,
    AdapterMethodParamsForGetADTTwinsByModelId,
    AdapterMethodParamsForSearchADTTwins,
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
    SET_ADT_HIERARCHY_SEARCH,
    SET_ADT_HIERARCHY_SELECTED_TWIN_ID
} from '../../../Models/Constants/ActionTypes';
import { useTranslation } from 'react-i18next';
import Searchbox from '../../../Components/Searchbox/Searchbox';

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
    const isLoadingTriggeredByShowMore = useRef(false);

    const [state, dispatch] = useReducer(
        ADTHierarchyCardConsumeReducer,
        defaultADTHierarchyCardConsumeState
    );
    const { hierarchyNodes, searchTerm } = state;

    const modelState = useAdapter({
        adapterMethod: (params: AdapterMethodParamsForGetADTModels) =>
            adapter.getADTModels(params),
        refetchDependencies: [adapter]
    });

    const twinState = useAdapter({
        adapterMethod: (params: AdapterMethodParamsForGetADTTwinsByModelId) =>
            adapter.getADTTwinsByModelId(params),
        refetchDependencies: [],
        skipFirstCallAdapter: true
    });

    const searchState = useAdapter({
        adapterMethod: (params: AdapterMethodParamsForSearchADTTwins) =>
            adapter.searchADTTwins(params),
        refetchDependencies: [],
        skipFirstCallAdapter: true
    });

    const handleModelClick = (modelNode: IHierarchyNode) => {
        focusedModelIdRef.current = modelNode.id;
        if (onParentNodeClick) {
            onParentNodeClick(modelNode);
        } else {
            if (modelNode.isCollapsed) {
                dispatch({
                    type: SET_ADT_HIERARCHY_NODE_PROPERTIES,
                    payload: {
                        modelId: modelNode.id,
                        properties: { isLoading: true }
                    }
                });
                isLoadingTriggeredByShowMore.current = false;
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
                              dispatch({
                                  type: SET_ADT_HIERARCHY_NODE_PROPERTIES,
                                  payload: {
                                      modelId: showMoreId,
                                      properties: { isLoading: true }
                                  }
                              });
                              isLoadingTriggeredByShowMore.current = true;
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
                              dispatch({
                                  type: SET_ADT_HIERARCHY_NODE_PROPERTIES,
                                  payload: {
                                      modelId: focusedModelId,
                                      twinId: `${focusedModelId}-show-more`,
                                      properties: { isLoading: true }
                                  }
                              });
                              isLoadingTriggeredByShowMore.current = true;
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
                        isLoading: false,
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

    useEffect(() => {
        if (searchState.adapterResult.result?.data.value) {
            const newTwinNodes = HierarchyNode.createNodesFromADTTwins(
                searchState.adapterResult.result?.data?.value as IADTTwin[],
                null
            );

            const searchContinuationToken = (searchState.adapterResult.result
                ?.data as ADTTwinsData)?.continuationToken;
            const currentNodes = { ...hierarchyNodes };

            const showMoreId = 'twins-show-more';
            delete currentNodes[showMoreId]; // remove the current show more node if exist
            const showMoreNode = searchContinuationToken
                ? {
                      [showMoreId]: {
                          id: showMoreId,
                          name: t('showMore'),
                          nodeType: HierarchyNodeType.ShowMore,
                          onNodeClick: () => {
                              dispatch({
                                  type: SET_ADT_HIERARCHY_NODE_PROPERTIES,
                                  payload: {
                                      modelId: showMoreId,
                                      properties: { isLoading: true }
                                  }
                              });
                              isLoadingTriggeredByShowMore.current = true;
                              searchState.callAdapter({
                                  searchTerm: searchTerm,
                                  continuationToken: searchContinuationToken
                              });
                          }
                      } as IHierarchyNode
                  }
                : null;

            dispatch({
                type: SET_ADT_HIERARCHY_NODES,
                payload: {
                    ...currentNodes,
                    ...newTwinNodes,
                    ...showMoreNode
                }
            });
        }
    }, [searchState.adapterResult.result?.data.value]);

    const handleOnParentNodeClick = useCallback((model: IHierarchyNode) => {
        handleModelClick(model);
    }, []);

    const handleOnChildNodeClick = useCallback(
        (model: IHierarchyNode, twin: IHierarchyNode) => {
            handleTwinClick(model, twin);
        },
        []
    );

    const handleOnSearch = useCallback((searchTerm: string) => {
        focusedModelIdRef.current = null;
        selectedTwinRef.current = null;

        if (searchTerm) {
            enterSearchMode(searchTerm);
            modelState.cancelAdapter();
            twinState.cancelAdapter();
            isLoadingTriggeredByShowMore.current = false;
            searchState.callAdapter({
                searchTerm: searchTerm,
                continuationToken:
                    searchState.adapterResult?.result?.data?.continuationToken
            });
        } else {
            exitSearchMode();
        }
    }, []);

    const enterSearchMode = useCallback((searchTerm: string) => {
        dispatch({
            type: SET_ADT_HIERARCHY_SEARCH,
            payload: searchTerm
        });
    }, []);

    const exitSearchMode = useCallback(() => {
        dispatch({
            type: SET_ADT_HIERARCHY_SEARCH,
            payload: ''
        });
        searchState.cancelAdapter();
        isLoadingTriggeredByShowMore.current = false;
        modelState.callAdapter();
    }, []);

    return (
        <BaseCard
            title={title}
            isLoading={
                modelState.isLoading && modelState.adapterResult.hasNoData()
            }
            adapterResult={modelState.adapterResult}
            skipInfoBox={true}
            theme={theme}
            locale={locale}
            localeStrings={localeStrings}
        >
            <Searchbox
                className="cb-adt-hierarchy-search"
                placeholder={t('search')}
                onSearch={handleOnSearch}
                onClear={exitSearchMode}
            />
            <Hierarchy
                data={hierarchyNodes}
                onParentNodeClick={handleOnParentNodeClick}
                onChildNodeClick={handleOnChildNodeClick}
                searchTermToMark={searchTerm}
                isLoading={
                    (modelState.isLoading ||
                        (searchTerm && searchState.isLoading)) &&
                    !isLoadingTriggeredByShowMore.current
                }
            ></Hierarchy>
        </BaseCard>
    );
};

export default ADTHierarchyCard;
