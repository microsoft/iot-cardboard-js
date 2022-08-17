import React from 'react';
import { Callout, IconButton } from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import { useBoolean } from '@fluentui/react-hooks';
import PropertyInspector from './PropertyInspector';
import { IPropertyInspectorAdapter } from '../../Models/Constants';

export interface IPropertyInspectorCalloutProps {
    twinId: string;
    adapter?: IPropertyInspectorAdapter;
}

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
                id={'#resultButton'}
            />
            {isVisible && (
                <Callout
                    target={'#resultButton'}
                    onDismiss={setIsVisible}
                    className="cb-property-inspector-callout"
                    directionalHint={5}
                    gapSpace={0}
                >
                    <PropertyInspector adapter={adapter} twinId={twinId} />
                </Callout>
            )}
        </div>
    );
};

export default PropertyInspectorCalloutButton;
