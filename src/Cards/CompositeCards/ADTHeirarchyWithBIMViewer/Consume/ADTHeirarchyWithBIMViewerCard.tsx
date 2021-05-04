import React, { useState } from 'react';
import { ADTHierarchyWithBIMViewerCardProps } from './ADTHeirarchyWithBIMViewerCard.types';
import ADTHierarchyCard from '../../../ADTHierarchyCard/Consume/ADTHierarchyCard';
import { IHierarchyNode } from '../../../../Models/Constants/Interfaces';
import BaseCompositeCard from '../../BaseCompositeCard/Consume/BaseCompositeCard';
import { useTranslation } from 'react-i18next';
import BIMViewerCard from '../../../BIMViewerCard/Consume/BIMViewerCard';

const ADTHierarchyWithLKVProcessGraphicsCard: React.FC<ADTHierarchyWithBIMViewerCardProps> = ({
    adapter,
    theme,
    title,
    locale,
    localeStrings,
    adapterAdditionalParameters
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
            <BIMViewerCard
                adapter={adapter}
                title={`BIM viewer`}
                id={'TODO_BIMName'}
                theme={theme}
                centeredObject={selectedChildNode?.id}
            />
        </BaseCompositeCard>
    );
};

export default React.memo(ADTHierarchyWithLKVProcessGraphicsCard);
