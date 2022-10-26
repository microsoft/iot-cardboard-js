import { FontSizes, FontWeights } from '@fluentui/react';
import { textOverflow } from '../../../../../Resources/Styles/BaseStyles';
import {
    IDataHistoryWidgetStyleProps,
    IDataHistoryWidgetStyles
} from './DataHistoryWidget.types';

export const classPrefix = 'cb-data-history-widget';
const classNames = {
    root: `${classPrefix}-root`,
    header: `${classPrefix}-header`,
    title: `${classPrefix}-title`,
    chartContainer: `${classPrefix}-chart-container`,
    menuButton: `${classPrefix}-menu-button`,
    menu: `${classPrefix}-menu`,
    menuItem: `${classPrefix}-menu-item`
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
                height: 36,
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
                fontWeight: FontWeights.semibold,
                paddingRight: 4,
                width: 192
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
                padding: 12
            }
        ],
        menu: [
            classNames.menu,
            {
                overflow: 'hidden'
            }
        ],
        menuItem: [
            classNames.menuItem,
            {
                '.ms-ContextualMenu-itemText': {
                    fontSize: FontSizes.size12
                }
            }
        ],
        subComponentStyles: {
            quickTimePicker: {
                dropdown: {
                    '.ms-Dropdown-title': {
                        borderWidth: 0,
                        padding: '0px 4px',
                        height: 24,
                        background: 'transparent',
                        ':hover': {
                            backgroundColor:
                                theme.semanticColors.buttonBackgroundHovered
                        }
                    },
                    '.ms-Dropdown::after': {
                        border: 'none'
                    }
                },
                menuItemIcon: {
                    fontSize: FontSizes.size16,
                    lineHeight: '16px'
                },
                calloutWidth: 104
            }
        }
    };
};
