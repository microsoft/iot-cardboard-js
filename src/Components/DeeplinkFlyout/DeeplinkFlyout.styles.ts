import { FontSizes, FontWeights } from '@fluentui/react';
import {
    IDeeplinkFlyoutStyleProps,
    IDeeplinkFlyoutStyles
} from './DeeplinkFlyout.types';

const classPrefix = 'cb-deeplink-flyout';

const classNames = {
    root: `${classPrefix}-root`,
    button: `${classPrefix}-button`,
    callout: `${classPrefix}-callout`,
    calloutCheckbox: `${classPrefix}-callout-checkbox`,
    calloutConfirmationMessage: `${classPrefix}-callout-confirmation`,
    calloutConfirmationMessageFadeOut: `${classPrefix}-callout-confirmation-fade-out`,
    calloutTitle: `${classPrefix}-callout-title`
};

export const getStyles = (
    props: IDeeplinkFlyoutStyleProps
): IDeeplinkFlyoutStyles => {
    const { theme, isCalloutOpen } = props;
    return {
        /** provide a hook for custom styling by consumers */
        root: [classNames.root, {}],
        /** provide a hook for custom styling by consumers */
        button: [classNames.button, {}],
        /** provide a hook for custom styling by consumers */
        callout: [classNames.callout, {}],
        calloutCheckbox: [classNames.calloutCheckbox, {}],
        calloutTitle: [
            classNames.calloutTitle,
            {
                margin: 0,
                fontSize: FontSizes.size14,
                fontWeight: FontWeights.semibold
            }
        ],
        calloutConfirmationMessage: [
            classNames.calloutConfirmationMessage,
            {
                alignItems: 'center',
                animation: 'fadeIn 0.3s cubic-bezier(0.1, 0.9, 0.2, 1) forwards'
            }
        ],
        calloutConfirmationMessageFadeOut: [
            classNames.calloutConfirmationMessageFadeOut,
            {
                animation:
                    'fadeOut 0.3s cubic-bezier(0.1, 0.9, 0.2, 1) forwards'
            }
        ],
        subComponentStyles: {
            button: {
                root: {
                    color: `${theme.semanticColors.bodyText} !important`,
                    border: `1px solid ${theme.palette.neutralLight}`,
                    backgroundColor: isCalloutOpen
                        ? theme.semanticColors.buttonBackgroundPressed
                        : theme.semanticColors.buttonBackground,
                    height: 42,
                    width: 42
                },
                icon: {
                    fontSize: FontSizes.size16
                }
            },
            callout: {
                root: {
                    padding: 16,
                    backdropFilter: 'blur(24px) brightness(150%)'
                }
            },
            checkbox: {
                text: {
                    fontSize: FontSizes.size12
                }
            }
        }
    };
};
