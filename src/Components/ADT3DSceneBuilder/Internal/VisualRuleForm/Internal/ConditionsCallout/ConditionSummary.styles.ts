import { FontSizes, FontWeights } from '@fluentui/react';
import {
    IConditionSummaryStyleProps,
    IConditionSummaryStyles
} from './ConditionSummary.types';

export const classPrefix = 'cb-conditionsummary';
const classNames = {
    invalidText: `${classPrefix}-invalidText`,
    title: `${classPrefix}-title`
};
export const getStyles = (
    _props: IConditionSummaryStyleProps
): IConditionSummaryStyles => {
    return {
        invalidText: [
            classNames.invalidText,
            {
                fontSize: FontSizes.size12
            }
        ],
        title: [
            classNames.title,
            {
                margin: 0,
                fontWeight: FontWeights.semibold
            }
        ],
        subComponentStyles: {}
    };
};
