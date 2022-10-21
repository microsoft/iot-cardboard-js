import { FontSizes } from '@fluentui/react';
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
    props: IConditionSummaryStyleProps
): IConditionSummaryStyles => {
    const { theme } = props;
    return {
        invalidText: [
            classNames.invalidText,
            {
                color: theme.semanticColors.errorText,
                fontSize: FontSizes.size12
            }
        ],
        title: [
            classNames.title,
            {
                margin: 0
            }
        ],
        subComponentStyles: {}
    };
};
