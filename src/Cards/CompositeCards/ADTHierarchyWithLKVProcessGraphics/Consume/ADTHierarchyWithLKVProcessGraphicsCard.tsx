import React, { useState } from 'react';
import { ADTHierarchyWithLKVProcessGraphicsCardProps } from './ADTHierarchyWithLKVProcessGraphicsCard.types';
import ADTHierarchyCard from '../../../ADTHierarchyCard/Consume/ADTHierarchyCard';
import LKVProcessGraphicCard from '../../../LKVProcessGraphicCard/Consume/LKVProcessGraphicCard';
import { IHierarchyNode } from '../../../../Models/Constants/Interfaces';
import BaseCompositeCard from '../../BaseCompositeCard/Consume/BaseCompositeCard';

const ADTHierarchyWithLKVProcessGraphicsCard: React.FC<ADTHierarchyWithLKVProcessGraphicsCardProps> = ({
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

    const handleChildNodeClick = (_parentId: string, node: IHierarchyNode) => {
        setSelectedChildNode(node);
    };
    return (
        <BaseCompositeCard
            title={title}
            theme={theme}
            locale={locale}
            localeStrings={localeStrings}
        >
            <ADTHierarchyCard
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

export default React.memo(ADTHierarchyWithLKVProcessGraphicsCard);
