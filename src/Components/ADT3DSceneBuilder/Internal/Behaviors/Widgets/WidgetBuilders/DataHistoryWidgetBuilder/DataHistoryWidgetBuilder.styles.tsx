import { IStyle } from '@fluentui/react';
import { CardboardClassNamePrefix } from '../../../../../../../Models/Constants/Constants';
import {
    IDataHistoryWidgetBuilderStyleProps,
    IDataHistoryWidgetBuilderStyles
} from './DataHistoryWidgetBuilder.types';

const classPrefix = CardboardClassNamePrefix + '-data-history-widget';
const classNames = {
    stackWithTooltipAndRequired: `${classPrefix}-stack-with-required-label-and-tooltip`
};

export const getStyles = (
    _props: IDataHistoryWidgetBuilderStyleProps
): IDataHistoryWidgetBuilderStyles => {
    return {
        stackWithTooltipAndRequired: [
            classNames.stackWithTooltipAndRequired,
            {
                'label::after': { paddingRight: 0 }
            } as IStyle
        ]
    };
};
