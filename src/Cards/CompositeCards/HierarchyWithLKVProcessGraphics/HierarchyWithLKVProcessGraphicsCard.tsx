import React, { useState } from 'react';
import { HierarchyWithLKVProcessGraphicsCardProps } from './HierarchyWithLKVProcessGraphicsCard.types';
import HierarchyCard from '../../Hierarchy/Consume/HierarchyCard';
import LKVProcessGraphicCard from '../../LKVProcessGraphicCard/Consume/LKVProcessGraphicCard';
import { IHierarchyNode } from '../../../Models/Constants/Interfaces';
import BaseCard from '../Base/BaseCard';
import './HierarchyWithLKVProcessGraphicsCard.scss';

const HierarchyWithLKVProcessGraphicsCard: React.FC<HierarchyWithLKVProcessGraphicsCardProps> = ({
    adapter,
    theme,
    title,
    locale,
    localeStrings,
    additionalProperties,
    getHierarchyNodeProperties,
    images
}) => {
    const [selectedChildNode, setSelectedChildNode] = useState(null);

    const handleChildNodeClick = (parentId: string, node: IHierarchyNode) => {
        setSelectedChildNode(node);
    };
    return (
        <BaseCard
            title={title}
            theme={theme}
            locale={locale}
            localeStrings={localeStrings}
        >
            <HierarchyCard
                adapter={adapter}
                title={'Hierarchy'}
                theme={theme}
                locale={locale}
                localeStrings={localeStrings}
                additionalProperties={additionalProperties}
                onChildNodeClick={handleChildNodeClick}
            />
            {selectedChildNode && (
                <LKVProcessGraphicCard
                    adapter={adapter}
                    id={selectedChildNode.id}
                    imageSrc={images[selectedChildNode.parentId].src}
                    pollingIntervalMillis={5000}
                    properties={getHierarchyNodeProperties(selectedChildNode)}
                    additionalProperties={
                        images[selectedChildNode.parentId].propertyPositions
                    }
                    title={`Real-time ${selectedChildNode.name} Status`}
                    theme={theme}
                    locale={locale}
                />
            )}
        </BaseCard>
    );
};

export default React.memo(HierarchyWithLKVProcessGraphicsCard);
