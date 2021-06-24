import React, { useCallback, useEffect, useReducer, useRef } from 'react';
import './ADTHierarchyCard.scss';
import BaseCard from '../../Base/Consume/BaseCard';
import useAdapter from '../../../Models/Hooks/useAdapter';
import { ADTHierarchyCardProps } from './ADTHierarchyCard.types';
import Hierarchy from '../../../Components/Hierarchy/Hierarchy';
import {
    AdapterMethodParamsForGetADTTwinsByModelId,
    AdapterMethodParamsForSearchADTTwins,
    ADTModelsApiData,
    ADTTwinsApiData,
    HierarchyNodeType,
    IHierarchyNode,
    TwinLookupStatus
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
    SET_ADT_HIERARCHY_SELECTED_TWIN_ID,
    SET_TWIN_LOOKUP_STATUS
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
    onChildNodeClick,
    nodeFilter,
    lookupTwinId
}) => {
    const { t } = useTranslation();
    const mountedRef = useRef(null);
    const focusedModelIdRef = useRef(null);
    const focusedTwinRef = useRef({ modelId: null, twinId: null });
    const isLoadingTriggeredByShowMore = useRef(false);
    const lookupTwinAndModelRef = useRef(null);

    const [state, dispatch] = useReducer(
        ADTHierarchyCardConsumeReducer,
        defaultADTHierarchyCardConsumeState
    );
    const hierarchyNodes = nodeFilter
        ? nodeFilter(state.hierarchyNodes)
        : state.hierarchyNodes;
    const { searchTerm, twinLookupStatus } = state;

    const modelState = useAdapter({
        adapterMethod: () =>
            adapter.getADTModels({ shouldIncludeDefinitions: !!nodeFilter }),
        refetchDependencies: [adapter, nodeFilter]
    });

    const twinState = useAdapter({
        adapterMethod: (params: AdapterMethodParamsForGetADTTwinsByModelId) =>
            adapter.getADTTwinsByModelId(params),
        refetchDependencies: [],
        isAdapterCalledOnMount: false
    });

    const searchState = useAdapter({
        adapterMethod: (params: AdapterMethodParamsForSearchADTTwins) =>
            adapter.searchADTTwins(params),
        refetchDependencies: [],
        isAdapterCalledOnMount: false
    });

    const handleModelClick = (modelNode: IHierarchyNode) => {
        if (onParentNodeClick) {
            onParentNodeClick(modelNode);
        } else {
            cancelCurrentlyLoadingNodes();
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
        focusedModelIdRef.current = modelNode.id;
    };

    const handleTwinClick = (
        modelNode: IHierarchyNode,
        twinNode: IHierarchyNode
    ) => {
        dispatch({
            type: SET_ADT_HIERARCHY_SELECTED_TWIN_ID,
            payload: {
                modelId: modelNode?.id,
                twinId: twinNode.id
            }
        });
        cancelCurrentlyLoadingNodes();
        focusedTwinRef.current = {
            modelId: modelNode?.id,
            twinId: twinNode.id
        };

        if (onChildNodeClick) {
            onChildNodeClick(modelNode, twinNode);
        }
    };

    const cancelCurrentlyLoadingNodes = () => {
        if (focusedTwinRef.current?.modelId && focusedTwinRef.current?.twinId) {
            dispatch({
                type: SET_ADT_HIERARCHY_NODE_PROPERTIES,
                payload: {
                    modelId: focusedTwinRef.current.modelId,
                    twinId: focusedTwinRef.current.twinId,
                    properties: { isLoading: false }
                }
            });
        }
        if (focusedModelIdRef.current) {
            dispatch({
                type: SET_ADT_HIERARCHY_NODE_PROPERTIES,
                payload: {
                    modelId: focusedModelIdRef.current,
                    properties: { isLoading: false }
                }
            });
        }
        focusedModelIdRef.current = null;
        focusedTwinRef.current = null;
        cancelPendingAdapterRequests();
    };

    const cancelPendingAdapterRequests = () => {
        modelState.cancelAdapter(true);
        twinState.cancelAdapter(true);
        searchState.cancelAdapter();
    };

    /** This mounted reference is specifically needed for reverse lookup calls (lookupADTTwin) since it is not using useAdapter hook which cancels
     * outstanding requests on unmount. Therefore mountedRef is used not to update state on unmounted component after lookupADTTwin request */
    useEffect(() => {
        mountedRef.current = true;
        return () => {
            mountedRef.current = false;
        };
    }, []);

    useEffect(() => {
        if (!modelState.adapterResult.hasNoData()) {
            const newModelNodes = HierarchyNode.createNodesFromADTModels(
                modelState.adapterResult.result?.data?.value
            );

            const modelsNextLink = (modelState.adapterResult.result
                ?.data as ADTModelsApiData)?.nextLink;

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
                              cancelCurrentlyLoadingNodes();
                              focusedModelIdRef.current = showMoreId;
                              dispatch({
                                  type: SET_ADT_HIERARCHY_NODE_PROPERTIES,
                                  payload: {
                                      modelId: showMoreId,
                                      properties: { isLoading: true }
                                  }
                              });
                              isLoadingTriggeredByShowMore.current = true;
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
    }, [modelState.adapterResult.getData()]);

    useEffect(() => {
        if (focusedModelIdRef.current && twinState.adapterResult.result) {
            const focusedModelId = focusedModelIdRef.current;
            const newTwinData = twinState.adapterResult.result.data;
            if (newTwinData?.value) {
                if (newTwinData.value.length) {
                    const newTwinNodes = HierarchyNode.createNodesFromADTTwins(
                        newTwinData.value,
                        hierarchyNodes[focusedModelId]
                    );
                    const twinsContinuationToken = (newTwinData as ADTTwinsApiData)
                        ?.continuationToken;
                    const currentChildren = !hierarchyNodes[focusedModelId]
                        .isCollapsed
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
                                      cancelCurrentlyLoadingNodes();
                                      focusedModelIdRef.current = focusedModelId;
                                      focusedTwinRef.current = {
                                          modelId: focusedModelId,
                                          twinId: `${focusedModelId}-show-more`
                                      };
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
                } else {
                    dispatch({
                        type: SET_ADT_HIERARCHY_NODE_PROPERTIES,
                        payload: {
                            modelId: focusedModelId,
                            properties: {
                                isCollapsed: false,
                                isLoading: false,
                                ...(hierarchyNodes[focusedModelId]
                                    .isCollapsed && {
                                    children: {}
                                })
                            }
                        }
                    });
                }
            }
        }
    }, [twinState.adapterResult.getData()]);

    useEffect(() => {
        if (!searchState.adapterResult.hasNoData()) {
            const newTwinNodes = HierarchyNode.createNodesFromADTTwins(
                searchState.adapterResult.result?.data?.value,
                null
            );

            const searchContinuationToken =
                searchState.adapterResult.result?.data?.continuationToken;
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
                              cancelCurrentlyLoadingNodes();
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
    }, [searchState.adapterResult.getData()]);

    const lookupTwinAndExpandModel = useCallback(async () => {
        dispatch({
            type: SET_TWIN_LOOKUP_STATUS,
            payload: TwinLookupStatus.Started
        });
        const twinAndModel = await adapter.lookupADTTwin(lookupTwinId);
        if (twinAndModel?.data?.model && mountedRef.current) {
            lookupTwinAndModelRef.current = twinAndModel;
            let targetModelNode = hierarchyNodes[twinAndModel.data.model.id];
            if (!targetModelNode) {
                // add target model node manually if not already exists in the current hierarch tree
                const currentNodes = { ...hierarchyNodes };
                targetModelNode = {
                    id: twinAndModel.data.model.id,
                    name: twinAndModel.data.model.displayName.en,
                    nodeData: twinAndModel.data.model,
                    nodeType: HierarchyNodeType.Parent,
                    isCollapsed: true
                } as IHierarchyNode;
                dispatch({
                    type: SET_ADT_HIERARCHY_NODES,
                    payload: {
                        [twinAndModel.data.model.id]: targetModelNode,
                        ...currentNodes
                    }
                });
            }
            // simulate expansion of the parent model node if collapsed
            if (targetModelNode.isCollapsed) {
                await handleModelClick(targetModelNode);
            }
            dispatch({
                type: SET_TWIN_LOOKUP_STATUS,
                payload: TwinLookupStatus.ReadyToLocate
            });
        }
    }, [hierarchyNodes, lookupTwinId]);

    const locateTwinAfterLookup = useCallback(async () => {
        const twinAndModel = lookupTwinAndModelRef.current;
        let targetTwinNode =
            hierarchyNodes[twinAndModel.data.model.id].children?.[
                twinAndModel.data.twin.$dtId
            ];
        if (!targetTwinNode) {
            // add twin node manually if not already exists under the expanded target model
            targetTwinNode = {
                id: twinAndModel.data.twin.$dtId,
                name: twinAndModel.data.twin.$dtId,
                nodeData: twinAndModel.data.twin,
                nodeType: HierarchyNodeType.Child,
                parentNode: hierarchyNodes[twinAndModel.data.model.id]
            } as IHierarchyNode;
            const currentChildren = {
                ...hierarchyNodes[twinAndModel.data.model.id].children
            };
            dispatch({
                type: SET_ADT_HIERARCHY_NODE_PROPERTIES,
                payload: {
                    modelId: twinAndModel.data.model.id,
                    properties: {
                        children: {
                            [targetTwinNode.id]: targetTwinNode,
                            ...currentChildren
                        }
                    }
                }
            });
        }
        // trigger twin onClick to manually select it
        await handleTwinClick(
            hierarchyNodes[twinAndModel.data.model.id],
            targetTwinNode
        );
        dispatch({
            type: SET_TWIN_LOOKUP_STATUS,
            payload: TwinLookupStatus.Finished
        });
    }, [hierarchyNodes, lookupTwinAndModelRef.current]);

    /** Initiate lookup process as long as twinLookupStatus is idle and either:
     * (1) when hierarchy nodes (models) are first rendered (when the lookup status is 'Idle') or
     * (2) twinLookupStatus resets from either 'Finished' or 'Idle' to 'Ready' with lookupTwinId changes
     *
     * After model expansion (if not already expanded), with the lookup status change from either 'Idle' or 'Ready' to 'InProgress'
     * and the updated hierarchy nodes rendered with twins (if not already exist), locate the looked up twin
     * under that parent model node */
    useEffect(() => {
        if (
            lookupTwinId &&
            modelState.adapterResult.getData() &&
            !modelState.isLoading &&
            (twinLookupStatus === TwinLookupStatus.Idle ||
                twinLookupStatus === TwinLookupStatus.Ready) &&
            !searchTerm
        ) {
            lookupTwinAndExpandModel();
        } else if (
            lookupTwinId &&
            twinState.adapterResult.getData() &&
            !twinState.isLoading &&
            twinLookupStatus === TwinLookupStatus.ReadyToLocate
        ) {
            locateTwinAfterLookup();
        }
    }, [hierarchyNodes, twinLookupStatus]);

    // to trigger lookup process when lookupTwinId prop changes by setting the twinLookupStatus from either 'Finished' or 'Idle' to 'Ready'
    useEffect(() => {
        if (lookupTwinId) {
            dispatch({
                type: SET_TWIN_LOOKUP_STATUS,
                payload: TwinLookupStatus.Ready
            });
        }
    }, [lookupTwinId]);

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
        focusedTwinRef.current = null;

        if (searchTerm) {
            enterSearchMode(searchTerm);
            cancelPendingAdapterRequests();
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
            hideInfoBox={true}
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
                noDataText={t('noTwins')}
                shouldScrollToSelectedNode={
                    lookupTwinId &&
                    twinLookupStatus === TwinLookupStatus.Finished
                }
            ></Hierarchy>
        </BaseCard>
    );
};

export default ADTHierarchyCard;
