import React, { useEffect, useMemo, useState } from 'react';
import './HierarchyCard.scss';
import BaseCard from '../../Base/Consume/BaseCard';
import useAdapter from '../../../Models/Hooks/useAdapter';
import { HierarchyCardProps } from './HierarchyCard.types';
import Hierarchy from '../../../Components/Hierarchy/Hierarchy';
import { IADTModel, IADTwin, IHierarchyNode } from '../../../Models/Constants';

const HierarchyCard: React.FC<HierarchyCardProps> = ({
    adapter,
    title,
    theme,
    locale,
    localeStrings,
    onParentNodeClick,
    onChildNodeClick
}) => {
    const [selectedModelId, setSelectedModelId] = useState(null);
    const [modelNodes, setModelNodes] = useState(
        {} as Record<string, IHierarchyNode>
    );
    const [twinNodes, setTwinNodes] = useState(
        {} as Record<string, IHierarchyNode>
    );

    const modelState = useAdapter({
        adapterMethod: () => adapter.getAdtModels(),
        refetchDependencies: [adapter]
    });

    const twinState = useAdapter({
        adapterMethod: () => adapter.getAdtTwins(selectedModelId),
        refetchDependencies: [selectedModelId]
    });

    const handleModelClick = async (model: IHierarchyNode) => {
        if (onParentNodeClick) {
            onParentNodeClick(model);
        } else {
            // the default handler pulls the twins of clicked model
            setSelectedModelId(model.id);
            await twinState.callAdapter();
            setModelNodes((prevModelNodes) => {
                const selectedModelNode = Object.values(prevModelNodes).find(
                    (modelNode) => modelNode.id === model.id
                );
                selectedModelNode.isCollapsed = !selectedModelNode.isCollapsed;
                return { ...prevModelNodes };
            });
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
        setModelNodes(
            adapter.createHierarchyNodesFromADTModels(
                modelState.adapterResult.result?.data?.value as IADTModel[]
            )
        );
    }, [modelState.adapterResult.result?.data.value]);

    useEffect(() => {
        setTwinNodes(
            adapter.createHierarchyNodesFromADTwins(
                twinState.adapterResult.result?.data?.value as IADTwin[],
                selectedModelId
            )
        );
    }, [twinState.adapterResult.result?.data.value]);

    const hierarchyData: Record<string, IHierarchyNode> = useMemo(() => {
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
    }, [modelNodes, twinNodes]);

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
            {hierarchyData && (
                <Hierarchy
                    data={hierarchyData}
                    onParentNodeClick={(model: IHierarchyNode) =>
                        handleModelClick(model)
                    }
                    onChildNodeClick={(modelId: string, twin: IHierarchyNode) =>
                        handleTwinClick(modelId, twin)
                    }
                ></Hierarchy>
            )}
        </BaseCard>
    );
};

export default HierarchyCard;
