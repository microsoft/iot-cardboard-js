import React, { useState } from 'react';
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
    const [flyoutVisible, setFlyoutVisible] = useState(false);

    // hooks
    const id = useId();
    const { t } = useTranslation();

    // styles
    const classNames = getClassNames(styles, {
        theme: useTheme()
    });

    return (
        <span
            className={classNames.root}
            onMouseEnter={() => setFlyoutVisible(true)}
            onMouseLeave={() => setFlyoutVisible(false)}
            onFocusCapture={() => setFlyoutVisible(true)}
        >
            <IconButton
                ariaLabel={buttonAriaLabel}
                data-testid={dataTestId}
                id={id}
                iconProps={{ iconName: iconName || 'Info' }}
                styles={classNames.subComponentStyles.button()}
            />
            <Callout
                directionalHint={DirectionalHint.rightCenter}
                {...calloutProps}
                target={`#${id}`}
                hidden={!flyoutVisible}
                onMouseEnter={() => {
                    console.log('entered');
                    setFlyoutVisible(true);
                }}
                onDismiss={() => setFlyoutVisible(false)}
                onMouseLeave={() => setFlyoutVisible(false)}
                onBlur={() => setFlyoutVisible(false)}
                styles={classNames.subComponentStyles.callout}
                shouldUpdateWhenHidden
            >
                {calloutContent}
                {link && ' '}
                {link && (
                    <Link target="_blank" href={link.url}>
                        {link.text || t('learnMore')}
                    </Link>
                )}
            </Callout>
        </span>
    );
};

export default styled<
    ITooltipCalloutProps,
    ITooltipCalloutStyleProps,
    ITooltipCalloutStyles
>(TooltipCallout, getStyles);
