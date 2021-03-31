import React, { useState } from 'react';
import { ADTHierarchyWithLKVProcessGraphicsCardProps } from './ADTHierarchyWithLKVProcessGraphicsCard.types';
import ADTHierarchyCard from '../../../ADTHierarchyCard/Consume/ADTHierarchyCard';
import LKVProcessGraphicCard from '../../../LKVProcessGraphicCard/Consume/LKVProcessGraphicCard';
import { IHierarchyNode } from '../../../../Models/Constants/Interfaces';
import BaseCompositeCard from '../../BaseCompositeCard/Consume/BaseCompositeCard';
import {
    ADTModel_ImgPropertyPositions_PropertyName,
    ADTModel_ImgSrc_PropertyName
} from '../../../../Models/Constants';

const ADTHierarchyWithLKVProcessGraphicsCard: React.FC<ADTHierarchyWithLKVProcessGraphicsCardProps> = ({
    adapter,
    theme,
    title,
    locale,
    localeStrings,
    adapterAdditionalParameters,
    getHierarchyNodeProperties
}) => {
    const [selectedChildNode, setSelectedChildNode] = useState(null);

    const handleChildNodeClick = (
        _parentNode: IHierarchyNode,
        childNode: IHierarchyNode
    ) => {
        setSelectedChildNode(childNode);
    };
    return (
        <BaseCompositeCard
            title={title}
            theme={theme}
            locale={locale}
            localeStrings={localeStrings}
            adapterAdditionalParameters={adapterAdditionalParameters}
        >
            <ADTHierarchyCard
                adapter={adapter}
                title={'ADT Hierarchy'}
                theme={theme}
                locale={locale}
                localeStrings={localeStrings}
                onChildNodeClick={handleChildNodeClick}
            />
            {selectedChildNode && (
                <LKVProcessGraphicCard
                    adapter={adapter}
                    id={selectedChildNode.id}
                    imageSrc={
                        selectedChildNode.nodeData[ADTModel_ImgSrc_PropertyName]
                    }
                    pollingIntervalMillis={5000}
                    properties={getHierarchyNodeProperties(selectedChildNode)}
                    imagePropertyPositions={
                        selectedChildNode.nodeData[
                            ADTModel_ImgPropertyPositions_PropertyName
                        ]
                            ? JSON.parse(
                                  selectedChildNode.nodeData[
                                      ADTModel_ImgPropertyPositions_PropertyName
                                  ]
                              )
                            : {}
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
