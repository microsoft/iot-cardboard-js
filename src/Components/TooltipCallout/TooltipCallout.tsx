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
    IconButton
} from '@fluentui/react';

const getClassNames = classNamesFunction<
    ITooltipCalloutStyleProps,
    ITooltipCalloutStyles
>();

const TooltipCallout: React.FC<ITooltipCalloutProps> = (props) => {
    const {
        buttonAriaLabel,
        calloutContent,
        calloutProps,
        dataTestId,
        iconName,
        styles
    } = props;
    // state
    const [flyoutVisible, { toggle: toggleFlyout }] = useBoolean(false);

    // hooks
    const id = useId();

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
