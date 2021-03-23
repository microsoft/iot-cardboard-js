import React, { useState } from 'react';
import { HierarchyWithLKVProcessGraphicsCardProps } from './HierarchyWithLKVProcessGraphicsCard.types';
import HierarchyCard from '../../../HierarchyCard/Consume/HierarchyCard';
import LKVProcessGraphicCard from '../../../LKVProcessGraphicCard/Consume/LKVProcessGraphicCard';
import { IHierarchyNode } from '../../../../Models/Constants/Interfaces';
import BaseCompositeCard from '../../BaseCompositeCard/Consume/BaseCompositeCard';

const HierarchyWithLKVProcessGraphicsCard: React.FC<HierarchyWithLKVProcessGraphicsCardProps> = ({
    adapter,
    theme,
    title,
    locale,
    localeStrings,
    adapterAdditionalParameters,
    getHierarchyNodeProperties,
    images
}) => {
    const [selectedChildNode, setSelectedChildNode] = useState(null);

    const handleChildNodeClick = (parentId: string, node: IHierarchyNode) => {
        setSelectedChildNode(node);
    };
    return (
        <BaseCompositeCard
            title={title}
            theme={theme}
            locale={locale}
            localeStrings={localeStrings}
        >
            <HierarchyCard
                adapter={adapter}
                title={'ADT Hierarchy'}
                theme={theme}
                locale={locale}
                localeStrings={localeStrings}
                adapterAdditionalParameters={adapterAdditionalParameters}
                onChildNodeClick={handleChildNodeClick}
            />
            {selectedChildNode && (
                <LKVProcessGraphicCard
                    adapter={adapter}
                    id={selectedChildNode.id}
                    imageSrc={images[selectedChildNode.parentId].src}
                    pollingIntervalMillis={5000}
                    properties={getHierarchyNodeProperties(selectedChildNode)}
                    adapterAdditionalParameters={
                        images[selectedChildNode.parentId].propertyPositions
                    }
                    title={`Real-time ${selectedChildNode.name} Status`}
                    theme={theme}
                    locale={locale}
                />
            )}
        </BaseCompositeCard>
    );
};

export default React.memo(HierarchyWithLKVProcessGraphicsCard);
