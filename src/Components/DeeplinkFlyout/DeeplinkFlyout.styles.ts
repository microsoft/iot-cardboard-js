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
    _props: IDeeplinkFlyoutStyleProps
): IDeeplinkFlyoutStyles => {
    return {
        /** provide a hook for custom styling by consumers */
        root: [classNames.root, {}],
        /** provide a hook for custom styling by consumers */
        button: [classNames.button, {}],
        /** provide a hook for custom styling by consumers */
        callout: [classNames.callout, {}],
        subComponentStyles: {
            callout: {
                root: {
                    padding: 16,
                    backdropFilter: 'blur(24px) brightness(150%)'
                }
            }
        }
    };
};
