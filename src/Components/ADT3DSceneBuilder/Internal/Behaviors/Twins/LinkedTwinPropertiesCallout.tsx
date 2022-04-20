import React from 'react';
import { useTranslation } from 'react-i18next';
import { IADT3DSceneBuilderLinkedTwinPropertiesCalloutProps } from '../../../ADT3DSceneBuilder.types';
import CardboardListCallout from '../../../../CardboardListCallout/CardboardListCallout';

const LinkedTwinPropertiesCallout: React.FC<IADT3DSceneBuilderLinkedTwinPropertiesCalloutProps> = ({
    commonLinkedTwinProperties,
    isLoading,
    calloutTarget,
    hideCallout
}) => {
    const { t } = useTranslation();

    return (
        <CardboardListCallout
            isBasicList={true}
            calloutTarget={calloutTarget}
            title={t('3dSceneBuilder.twinAlias.commonProperties')}
            listKey={'common-properties-callout-list'}
            listItems={commonLinkedTwinProperties}
            isListLoading={isLoading}
            onDismiss={hideCallout}
            filterPlaceholder={t('3dSceneBuilder.twinAlias.searchProperties')}
            filterPredicate={(property: string, searchTerm) =>
                property.toLowerCase().includes(searchTerm.toLowerCase())
            }
            noResultText={t('3dSceneBuilder.noLinkedTwinProperties')}
            searchBoxDataTestId="linked-twin-callout-search"
        />
    );
};

export default LinkedTwinPropertiesCallout;
