import { FontSizes, FontWeights } from '@fluentui/react';
import {
    IDataHistoryWidgetStyleProps,
    IDataHistoryWidgetStyles
} from './DataHistoryWidget.types';

export const classPrefix = 'cb-data-history-widget';
const classNames = {
    root: `${classPrefix}-root`
};
export const getStyles = ({
    theme
}: IDataHistoryWidgetStyleProps): IDataHistoryWidgetStyles => {
    return {
        root: [
            classNames.root,
            {
                width: '100%',
                height: '100%',
                padding: 0,
                position: 'relative',
                overflow: 'hidden'
            }
        ],
        subComponentStyles: {
            title: {
                root: {
                    fontWeight: FontWeights.regular as string,
                    fontSize: FontSizes.size12,
                    color: theme.palette.black
                }
            }
        }
    };
};
