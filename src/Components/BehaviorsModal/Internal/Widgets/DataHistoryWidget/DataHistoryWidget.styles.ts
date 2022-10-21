import { FontSizes, FontWeights } from '@fluentui/react';
import { textOverflow } from '../../../../../Resources/Styles/BaseStyles';
import { IDataHistoryWidgetStyles } from './DataHistoryWidget.types';

export const classPrefix = 'cb-data-history-widget';
const classNames = {
    root: `${classPrefix}-root`,
    header: `${classPrefix}-header`,
    title: `${classPrefix}-title`,
    chartContainer: `${classPrefix}-chart-container`,
    menuButton: `${classPrefix}-menu-button`,
    menuItem: `${classPrefix}-menu-item`
};
export const getStyles = (): IDataHistoryWidgetStyles => {
    return {
        root: [
            classNames.root,
            {
                width: '100%',
                height: '100%',
                padding: 0,
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
            }
        ],
        header: [
            classNames.header,
            {
                width: '100%',
                padding: 8,
                display: 'flex',
                justifyContent: 'space-between'
            }
        ],
        title: [
            classNames.title,
            textOverflow,
            {
                fontSize: FontSizes.size12,
                minHeight: '16px',
                fontWeight: FontWeights.semibold
            }
        ],
        chartContainer: [
            classNames.chartContainer,
            {
                flexGrow: 1
            }
        ],
        menuButton: [
            classNames.menuButton,
            {
                width: 20,
                height: 20,
                padding: 0
            }
        ],
        menuItem: [
            classNames.menuItem,
            {
                '.ms-ContextualMenu-itemText': {
                    fontSize: FontSizes.size12
                }
            }
        ]
    };
};
