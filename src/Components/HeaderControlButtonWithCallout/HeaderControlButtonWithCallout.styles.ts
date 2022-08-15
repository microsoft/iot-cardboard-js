import { FontSizes, FontWeights } from '@fluentui/react';
import {
    IHeaderControlButtonWithCalloutStyleProps,
    IHeaderControlButtonWithCalloutStyles
} from './HeaderControlButtonWithCallout.types';

export const classPrefix = 'cb-header-control-button-with-callout';
const classNames = {
    root: `${classPrefix}-root`,
    title: `${classPrefix}-title`
};
export const getStyles = (
    _props: IHeaderControlButtonWithCalloutStyleProps
): IHeaderControlButtonWithCalloutStyles => {
    return {
        root: [classNames.root],
        title: [
            classNames.title,
            {
                fontSize: FontSizes.size14,
                fontWeight: FontWeights.semibold,
                flex: '1',
                marginLeft: 12
            }
        ],
        subComponentStyles: {
            callout: {
                calloutMain: {
                    padding: 12
                }
            },
            calloutCloseIcon: {
                fontSize: FontSizes.size14
            },
            headerStack: {
                root: {
                    alignItems: 'center',
                    fontSize: FontSizes.size16
                }
            }
        }
    };
};
