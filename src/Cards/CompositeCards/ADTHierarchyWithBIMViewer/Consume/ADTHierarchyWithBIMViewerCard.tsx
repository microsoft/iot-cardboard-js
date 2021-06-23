import React, { useMemo, useState } from 'react';
import { ADTHierarchyWithBIMViewerCardProps } from './ADTHierarchyWithBIMViewerCard.types';
import ADTHierarchyCard from '../../../ADTHierarchyCard/Consume/ADTHierarchyCard';
import { IHierarchyNode } from '../../../../Models/Constants/Interfaces';
import BaseCompositeCard from '../../BaseCompositeCard/Consume/BaseCompositeCard';
import { useTranslation } from 'react-i18next';
import BIMViewerCard from '../../../BIMViewerCard/Consume/BIMViewerCard';
import { createNodeFilterFromRootForBIM } from '../../../../Models/Services/Utils';
import { useAdapter } from '../../../../Models/Hooks';

const ADTHierarchyWithBIMViewerCard: React.FC<ADTHierarchyWithBIMViewerCardProps> = ({
    adapter,
    theme,
    title,
    locale,
    localeStrings,
    adapterAdditionalParameters,
    bimTwinId
}) => {
    const [selectedChildNode, setSelectedChildNode] = useState(null);
    const { t } = useTranslation();

    const cardState = useAdapter({
        adapterMethod: () => adapter.getADTTwin(bimTwinId),
        refetchDependencies: [bimTwinId]
    });

    const handleChildNodeClick = (
        _parentNode: IHierarchyNode,
        childNode: IHierarchyNode
    ) => {
        setSelectedChildNode(childNode);
    };

    const memoizedNodeFilter = useMemo(() => {
        return createNodeFilterFromRootForBIM(
            cardState.adapterResult.getData()?.['$metadata']?.['$model']
        );
    }, [cardState.adapterResult.getData()]);

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
                nodeFilter={memoizedNodeFilter}
            />
            <BIMViewerCard
                adapter={adapter}
                title={`BIM viewer`}
                id={bimTwinId}
                theme={theme}
                centeredObject={selectedChildNode?.id}
            />
        </BaseCompositeCard>
    );
};

export default React.memo(ADTHierarchyWithBIMViewerCard);
