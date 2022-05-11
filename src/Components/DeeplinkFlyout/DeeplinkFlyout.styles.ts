import { FontSizes } from '@fluentui/react';
import {
    IDeeplinkFlyoutStyleProps,
    IDeeplinkFlyoutStyles
} from './DeeplinkFlyout.types';

const classPrefix = 'cb-deeplink-flyout';

const classNames = {
    root: `${classPrefix}-root`,
    button: `${classPrefix}-button`,
    callout: `${classPrefix}-callout`
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
            }
        }
    };
};
