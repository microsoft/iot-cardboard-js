import { Panel, PanelType } from '@fluentui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Locale, PropertyInspector, Theme } from '../../..';
import { IADTAdapter } from '../../../Models/Constants/Interfaces';

type Props = {
    isOpen: boolean;
    onDismiss: () => any;
    adapter: IADTAdapter;
    twinId: string;
    relationshipId?: never;
    theme?: Theme;
    locale?: Locale;
};

const PropertyInspectorSurface: React.FC<Props> = ({
    isOpen,
    onDismiss,
    adapter,
    twinId,
    relationshipId,
    theme,
    locale
}) => {
    const { t } = useTranslation();

    return (
        <Panel
            isOpen={isOpen}
            isLightDismiss
            onDismiss={onDismiss}
            closeButtonAriaLabel={t('close')}
            headerText={twinId}
            type={PanelType.medium}
            className={'cb-property-inspector-panel-container'}
            styles={{
                header: {
                    paddingLeft: 24
                },
                scrollableContent: {
                    overflowY: 'hidden'
                },
                content: {
                    height: '100%',
                    display: 'flex',
                    paddingLeft: '20px',
                    paddingRight: '0px'
                }
            }}
        >
            <PropertyInspector
                twinId={twinId}
                adapter={adapter}
                relationshipId={relationshipId}
                theme={theme}
                locale={locale}
            />
        </Panel>
    );
};

export default React.memo(PropertyInspectorSurface);
