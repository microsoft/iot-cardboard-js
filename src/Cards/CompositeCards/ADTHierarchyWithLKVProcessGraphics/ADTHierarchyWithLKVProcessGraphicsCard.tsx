import React, { useState } from 'react';
import { ADTHierarchyWithLKVProcessGraphicsCardProps } from './ADTHierarchyWithLKVProcessGraphicsCard.types';
import ADTHierarchyCard from '../../ADTHierarchyCard/ADTHierarchyCard';
import LKVProcessGraphicCard from '../../LKVProcessGraphicCard/LKVProcessGraphicCard';
import { IHierarchyNode } from '../../../Models/Constants/Interfaces';
import BaseCompositeCard from '../BaseCompositeCard/BaseCompositeCard';
import {
    ADTModel_ImgPropertyPositions_PropertyName,
    ADTModel_ImgSrc_PropertyName
} from '../../../Models/Constants';
import { useTranslation } from 'react-i18next';

const ADTHierarchyWithLKVProcessGraphicsCard: React.FC<ADTHierarchyWithLKVProcessGraphicsCardProps> = ({
    adapter,
    theme,
    title,
    locale,
    localeStrings,
    adapterAdditionalParameters,
    getHierarchyNodeProperties,
    pollingIntervalMillis
}) => {
    const [selectedChildNode, setSelectedChildNode] = useState(null);
    const { t } = useTranslation();

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
                title={`ADT ${t('hierarchy')}`}
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
                    pollingIntervalMillis={pollingIntervalMillis}
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
                    title={`${selectedChildNode.name} - ${t('realTimeStatus')}`}
                    theme={theme}
                    locale={locale}
                />
            )}
        </BaseCompositeCard>
    );
};

export default React.memo(ADTHierarchyWithLKVProcessGraphicsCard);
