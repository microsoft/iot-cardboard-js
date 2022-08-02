import React from 'react';
import {
    ITooltipCalloutProps,
    ITooltipCalloutStyleProps,
    ITooltipCalloutStyles
} from './TooltipCallout.types';
import { getStyles } from './TooltipCallout.styles';
import { useId } from '@fluentui/react-hooks';
import {
    classNamesFunction,
    useTheme,
    styled,
    DirectionalHint,
    IconButton,
    Link,
    TooltipHost,
    TooltipDelay
} from '@fluentui/react';
import { useTranslation } from 'react-i18next';

const getClassNames = classNamesFunction<
    ITooltipCalloutStyleProps,
    ITooltipCalloutStyles
>();

const TooltipCallout: React.FC<ITooltipCalloutProps> = (props) => {
    const { content, calloutProps, dataTestId, styles } = props;
    const { buttonAriaLabel, calloutContent, iconName, link } = content;

    // hooks
    const id = useId();
    const { t } = useTranslation();

    // styles
    const classNames = getClassNames(styles, {
        theme: useTheme()
    });

    return (
        <TooltipHost
            directionalHint={DirectionalHint.rightCenter}
            {...calloutProps}
            delay={TooltipDelay.zero}
            styles={classNames.subComponentStyles.callout}
            content={
                <div style={{ fontSize: '14px' }}>
                    {calloutContent}
                    {link && ' '}
                    {link && (
                        <Link target="_blank" href={link.url}>
                            {link.text || t('learnMore')}
                        </Link>
                    )}
                </div>
            }
            style={{ maxWidth: '290px' }}
        >
            <IconButton
                ariaLabel={buttonAriaLabel}
                data-testid={dataTestId}
                id={id}
                iconProps={{ iconName: iconName || 'Info' }}
                styles={classNames.subComponentStyles.button()}
            />
        </TooltipHost>
    );
};

export default styled<
    ITooltipCalloutProps,
    ITooltipCalloutStyleProps,
    ITooltipCalloutStyles
>(TooltipCallout, getStyles);
