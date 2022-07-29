import { FontSizes, FontWeights } from '@fluentui/react';
import {
    IOptionsCalloutStyleProps,
    IOptionsCalloutStyles
} from './OptionsCallout.types';

const classPrefix = 'cb-deeplink-options-flyout';

const classNames = {
    root: `${classPrefix}-root`,
    calloutCheckbox: `${classPrefix}-callout-checkbox`,
    calloutConfirmationMessage: `${classPrefix}-callout-confirmation`,
    calloutConfirmationMessageFadeOut: `${classPrefix}-callout-confirmation-fade-out`,
    calloutTitle: `${classPrefix}-callout-title`
};
export const getStyles = (
    _props: IOptionsCalloutStyleProps
): IOptionsCalloutStyles => {
    return {
        root: [classNames.root],
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
            checkbox: {
                text: {
                    fontSize: FontSizes.size12
                }
            },
            confirmationStack: {
                root: {
                    flex: 1,
                    justifyContent: 'center'
                }
            }
        }
    };
};
