import { FontSizes, FontWeights } from '@fluentui/react';
import {
    IDeeplinkFlyoutStyleProps,
    IDeeplinkFlyoutStyles
} from './DeeplinkFlyout.types';

const deeplinkFlyoutClassPrefix = 'cb-deeplinkflyout';

const classNames = {
    root: `${deeplinkFlyoutClassPrefix}-root`,
    calloutTitle: `${deeplinkFlyoutClassPrefix}-callout-title`
};

export const getStyles = (
    _props: IDeeplinkFlyoutStyleProps
): IDeeplinkFlyoutStyles => {
    return {
        root: [classNames.root, {}],
        calloutTitle: [
            classNames.calloutTitle,
            {
                margin: 0,
                fontSize: FontSizes.size14,
                fontWeight: FontWeights.semibold
            }
        ],
        confirmationMessage: [
            {
                alignItems: 'center',
                animation: 'fadeIn 0.3s cubic-bezier(0.1, 0.9, 0.2, 1) forwards'
            }
        ],
        subComponentStyles: {
            callout: {
                root: {
                    padding: 16
                }
            },
            checkbox: {
                label: {
                    fontSize: FontSizes.size12
                }
            }
        }
    };
};
