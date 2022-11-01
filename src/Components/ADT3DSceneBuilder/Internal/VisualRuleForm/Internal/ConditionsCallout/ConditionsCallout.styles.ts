import { FontSizes, FontWeights } from '@fluentui/react';
import {
    IConditionsCalloutStyleProps,
    IConditionsCalloutStyles
} from './ConditionsCallout.types';

export const classPrefix = 'cb-conditionscallout';
const classNames = {
    root: `${classPrefix}-root`,
    footer: `${classPrefix}-footer`,
    title: `${classPrefix}-title`
};
export const getStyles = (
    _props: IConditionsCalloutStyleProps
): IConditionsCalloutStyles => {
    return {
        root: [classNames.root],
        footer: [
            classNames.footer,
            {
                paddingTop: 32
            }
        ],
        title: [
            classNames.title,
            {
                fontSize: FontSizes.size16,
                margin: 0,
                fontWeight: FontWeights.semibold
            }
        ],
        subComponentStyles: {
            callout: {
                root: {
                    width: 300,
                    padding: 20
                }
            }
        }
    };
};
