import React from 'react';
import {
    ITooltipCalloutProps,
    ITooltipCalloutStyleProps,
    ITooltipCalloutStyles
} from './TooltipCallout.types';
import { getStyles } from './TooltipCallout.styles';
import { useBoolean, useId } from '@fluentui/react-hooks';
import {
    classNamesFunction,
    useTheme,
    styled,
    Callout,
    DirectionalHint,
    IconButton,
    Link
} from '@fluentui/react';
import { useTranslation } from 'react-i18next';

const getClassNames = classNamesFunction<
    ITooltipCalloutStyleProps,
    ITooltipCalloutStyles
>();

const TooltipCallout: React.FC<ITooltipCalloutProps> = (props) => {
    const { content, calloutProps, dataTestId, styles } = props;
    const { buttonAriaLabel, calloutContent, iconName, link } = content;
    // state
    const [flyoutVisible, { toggle: toggleFlyout }] = useBoolean(false);

    // hooks
    const id = useId();
    const { t } = useTranslation();

    // styles
    const classNames = getClassNames(styles, {
        theme: useTheme()
    });

    return (
        <div className={classNames.root}>
            <IconButton
                ariaLabel={buttonAriaLabel}
                data-testid={dataTestId}
                id={id}
                iconProps={{ iconName: iconName || 'Info' }}
                onFocus={toggleFlyout}
                onBlur={toggleFlyout}
                onMouseEnter={toggleFlyout}
                onMouseLeave={toggleFlyout}
                styles={classNames.subComponentStyles.button()}
            />
            {flyoutVisible && (
                <Callout
                    directionalHint={DirectionalHint.rightCenter}
                    {...calloutProps}
                    target={`#${id}`}
                    onDismiss={toggleFlyout}
                    styles={classNames.subComponentStyles.callout}
                >
                    {calloutContent}
                    {link && ' '}
                    {link && (
                        <Link target="_blank" href={link.url}>
                            {link.text || t('learnMore')}
                        </Link>
                    )}
                </Callout>
            )}
        </div>
    );
};

export default styled<
    ITooltipCalloutProps,
    ITooltipCalloutStyleProps,
    ITooltipCalloutStyles
>(TooltipCallout, getStyles);
