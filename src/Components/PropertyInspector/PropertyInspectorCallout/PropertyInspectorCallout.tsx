import React from 'react';
import {
    IPropertyInspectorCalloutProps,
    IPropertyInspectorCalloutStyleProps,
    IPropertyInspectorCalloutStyles
} from './PropertyInspectorCallout.types';
import { getStyles } from './PropertyInspectorCallout.styles';
import {
    classNamesFunction,
    useTheme,
    styled,
    Callout,
    IconButton,
    DirectionalHint
} from '@fluentui/react';
import { useBoolean, useId } from '@fluentui/react-hooks';
import PropertyInspector from '../PropertyInspector';
import { useTranslation } from 'react-i18next';

const getClassNames = classNamesFunction<
    IPropertyInspectorCalloutStyleProps,
    IPropertyInspectorCalloutStyles
>();

const PropertyInspectorCallout: React.FC<IPropertyInspectorCalloutProps> = (
    props
) => {
    const {
        adapter,
        disabled = false,
        twinId,
        hasDataHistoryControl,
        styles
    } = props;

    // state
    const [isVisible, { toggle: setIsVisible }] = useBoolean(false);

    // hooks
    const { t } = useTranslation();
    const buttonId = useId('cb-callout-button');

    // styles
    const classNames = getClassNames(styles, {
        theme: useTheme()
    });

    return (
        <div className={classNames.root}>
            <IconButton
                iconProps={{ iconName: 'EntryView' }}
                title={t('advancedSearch.inspectProperties')}
                ariaLabel={t('advancedSearch.inspectProperties')}
                onClick={(event) => {
                    event.stopPropagation();
                    setIsVisible();
                }}
                id={buttonId}
                styles={classNames.subComponentStyles.button?.()}
                disabled={disabled}
            />
            {isVisible && (
                <Callout
                    calloutMinWidth={200}
                    calloutMaxWidth={380}
                    onDismiss={setIsVisible}
                    directionalHint={DirectionalHint.bottomCenter}
                    gapSpace={8}
                    target={`#${buttonId}`}
                    isBeakVisible={false}
                    setInitialFocus
                    styles={classNames.subComponentStyles.callout?.()}
                >
                    <PropertyInspector
                        adapter={adapter}
                        twinId={twinId}
                        readonly={true}
                        hasDataHistoryControl={hasDataHistoryControl}
                    />
                </Callout>
            )}
        </div>
    );
};

export default styled<
    IPropertyInspectorCalloutProps,
    IPropertyInspectorCalloutStyleProps,
    IPropertyInspectorCalloutStyles
>(PropertyInspectorCallout, getStyles);
