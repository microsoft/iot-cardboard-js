import React from 'react';
import { Callout, IconButton } from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import { useBoolean, useId } from '@fluentui/react-hooks';
import PropertyInspector from './PropertyInspector';
import { IPropertyInspectorAdapter } from '../../Models/Constants';
import { withErrorBoundary } from '../../Models/Context/ErrorBoundary';

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
    const buttonId = useId('cb-callout-button');
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
                className={'cb-property-inspector-button'}
                id={buttonId}
            />
            {isVisible && (
                <Callout
                    calloutMinWidth={200}
                    calloutMaxWidth={380}
                    onDismiss={setIsVisible}
                    directionalHint={11}
                    gapSpace={8}
                    target={`#${buttonId}`}
                    isBeakVisible={false}
                    setInitialFocus
                >
                    <div className="cb-callout-content">
                        <PropertyInspector adapter={adapter} twinId={twinId} />
                    </div>
                </Callout>
            )}
        </div>
    );
};
export default withErrorBoundary(PropertyInspectorCalloutButton);
