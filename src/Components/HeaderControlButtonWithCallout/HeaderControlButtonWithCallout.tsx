import React from 'react';
import {
    IHeaderControlButtonWithCalloutProps,
    IHeaderControlButtonWithCalloutStyleProps,
    IHeaderControlButtonWithCalloutStyles
} from './HeaderControlButtonWithCallout.types';
import { getStyles } from './HeaderControlButtonWithCallout.styles';
import {
    classNamesFunction,
    useTheme,
    styled,
    FocusTrapCallout,
    FontIcon,
    IconButton,
    Stack
} from '@fluentui/react';
import { useBoolean, useId } from '@fluentui/react-hooks';
import HeaderControlButton from '../HeaderControlButton/HeaderControlButton';
import HeaderControlGroup from '../HeaderControlGroup/HeaderControlGroup';

const getClassNames = classNamesFunction<
    IHeaderControlButtonWithCalloutStyleProps,
    IHeaderControlButtonWithCalloutStyles
>();

const HeaderControlButtonWithCallout: React.FC<IHeaderControlButtonWithCalloutProps> = (
    props
) => {
    const { buttonProps, calloutProps, children, styles } = props;

    // hooks
    const calloutAnchor = useId();

    // state
    const [isCalloutVisible, { toggle: toggleCallout }] = useBoolean(false);

    // styles
    const classNames = getClassNames(styles, {
        theme: useTheme()
    });

    return (
        <div className={classNames.root}>
            <HeaderControlGroup>
                <HeaderControlButton
                    dataTestId={buttonProps.testId}
                    iconProps={{ iconName: buttonProps.iconName }}
                    id={calloutAnchor}
                    onClick={toggleCallout}
                    title={buttonProps.title}
                    isActive={isCalloutVisible}
                />
            </HeaderControlGroup>
            {isCalloutVisible && (
                <FocusTrapCallout
                    focusTrapProps={{
                        isClickableOutsideFocusTrap: true
                    }}
                    target={`#${calloutAnchor}`}
                    onDismiss={toggleCallout}
                    styles={classNames.subComponentStyles.callout}
                >
                    <Stack tokens={{ childrenGap: 8 }}>
                        <Stack
                            horizontal
                            styles={classNames.subComponentStyles.headerStack}
                            tokens={{ childrenGap: 8 }}
                        >
                            <FontIcon iconName={calloutProps.iconName} />
                            <span className={classNames.title}>
                                {calloutProps.title}
                            </span>
                            <IconButton
                                iconProps={{
                                    iconName: 'Cancel',
                                    style: classNames.subComponentStyles.calloutCloseIcon()
                                }}
                                onClick={toggleCallout}
                            />
                        </Stack>
                        {children}
                    </Stack>
                </FocusTrapCallout>
            )}
        </div>
    );
};

/**
 * This is a header control button with a built-in callout that shows any content that you put in the Children prop. It includes a callout title and close button.
 * The callout closes on soft dismiss, clicking the header control button or by clicking the close button.
 */
export default styled<
    IHeaderControlButtonWithCalloutProps,
    IHeaderControlButtonWithCalloutStyleProps,
    IHeaderControlButtonWithCalloutStyles
>(HeaderControlButtonWithCallout, getStyles);
