import React, { useCallback, useState } from 'react';
import { Callout, IconButton } from '@fluentui/react';
import { IPropertyInspectorCalloutProps } from '../AdvancedSearch.types';
import { useTranslation } from 'react-i18next';
import { useBoolean } from '@fluentui/react-hooks';
import PropertyInspector from '../../PropertyInspector/PropertyInspector';

const PropertyInspectorCalloutButton: React.FC<IPropertyInspectorCalloutProps> = ({
    twinId,
    adapter
}) => {
    const { t } = useTranslation();
    const [isVisible, { toggle: setIsVisible }] = useBoolean(false);
    return (
        <div>
            <IconButton
                iconProps={{ iconName: 'EntryView' }}
                title={t('advancedSearch.inspectProperty')}
                ariaLabel={t('advancedSearch.inspectProperty')}
                onClick={(event) => {
                    event.stopPropagation();
                    setIsVisible();
                }}
                className={'cb-scenes-action-button'}
            />
            {isVisible && (
                <Callout target={'#resultButton'} onDismiss={setIsVisible}>
                    <PropertyInspector adapter={adapter} twinId={twinId} />
                </Callout>
            )}
        </div>
    );
};

export default PropertyInspectorCalloutButton;
