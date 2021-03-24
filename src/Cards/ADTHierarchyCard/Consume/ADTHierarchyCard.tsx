import React, { useEffect, useMemo, useState } from 'react';
import './ADTHierarchyCard.scss';
import BaseCard from '../../Base/Consume/BaseCard';
import useAdapter from '../../../Models/Hooks/useAdapter';
import { ADTHierarchyCardProps } from './ADTHierarchyCard.types';
import Hierarchy from '../../../Components/Hierarchy/Hierarchy';
import { IADTModel, IADTTwin, IHierarchyNode } from '../../../Models/Constants';
import { HierarchyNode } from '../../../Models/Classes/HierarchyNode';

const ADTHierarchyCard: React.FC<ADTHierarchyCardProps> = ({
    adapter,
    title,
    theme,
    locale,
    localeStrings,
    onParentNodeClick,
    onChildNodeClick
}) => {
    const [selectedModelId, setSelectedModelId] = useState(null);
    const [collapseTrigger, setCollapseTrigger] = useState(true);

    const [modelAndTwinNodes, setModelAndTwinNodes] = useState({
        modelNodes: {},
        twinNodes: {}
    });

    const modelState = useAdapter({
        adapterMethod: () => adapter.getAdtModels(),
        refetchDependencies: [adapter]
    });

    const twinState = useAdapter({
        adapterMethod: () => adapter.getAdtTwins(selectedModelId),
        refetchDependencies: [selectedModelId]
    });

    const handleModelClick = (model: IHierarchyNode) => {
        if (onParentNodeClick) {
            onParentNodeClick(model);
        } else {
            // the default handler pulls the twins of clicked model
            if (model.id === selectedModelId && selectedModelId) {
                setCollapseTrigger(!collapseTrigger);
            }
            setSelectedModelId(model.id);
        }
    };

    const handleTwinClick = (modelId: string, twin: IHierarchyNode) => {
        if (onChildNodeClick) {
            onChildNodeClick(modelId, twin);
        } else {
            console.log(modelId + ': ' + twin.id);
        }
    };

    useEffect(() => {
        setModelAndTwinNodes({
            twinNodes: modelAndTwinNodes.twinNodes,
            modelNodes: HierarchyNode.fromADTModels(
                modelState.adapterResult.result?.data?.value as IADTModel[]
            )
        });
    }, [modelState.adapterResult.result?.data.value]);

    useEffect(() => {
        if (twinState.adapterResult.result?.data.value) {
            const twinNodes = HierarchyNode.fromADTTwins(
                twinState.adapterResult.result?.data?.value as IADTTwin[],
                selectedModelId
            );

            const modelNodes = modelAndTwinNodes.modelNodes as IHierarchyNode;

            if (selectedModelId && twinState.adapterResult.result?.data.value) {
                const selectedModelNode = Object.values(modelNodes).find(
                    (modelNode) => modelNode.id === selectedModelId
                );
                selectedModelNode.isCollapsed = !selectedModelNode.isCollapsed;
            }
            setModelAndTwinNodes(
                Object.assign(
                    {},
                    { modelNodes: modelNodes, twinNodes: twinNodes }
                )
            );
        }
    }, [collapseTrigger, twinState.adapterResult.result?.data.value]);

    const hierarchyData = () => {
        const { modelNodes, twinNodes } = modelAndTwinNodes;
        const hierarchyNodes: Record<string, IHierarchyNode> = {};
        Object.keys(modelNodes).forEach((modelName) => {
            hierarchyNodes[modelName] = modelNodes[modelName];
            Object.values(twinNodes).forEach((twinNode: IHierarchyNode) => {
                if (modelNodes[modelName].id === twinNode.parentId) {
                    hierarchyNodes[modelName].children[
                        twinNode.name
                    ] = twinNode;
                }
            });
        });
        return hierarchyNodes;
    };

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
                data={hierarchyData()}
                onParentNodeClick={(model: IHierarchyNode) =>
                    handleModelClick(model)
                }
                onChildNodeClick={(modelId: string, twin: IHierarchyNode) =>
                    handleTwinClick(modelId, twin)
                }
            ></Hierarchy>
        </BaseCard>
    );
};

export default ADTHierarchyCard;
