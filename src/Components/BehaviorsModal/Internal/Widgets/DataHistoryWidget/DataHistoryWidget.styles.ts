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
    errorContainer: `${classPrefix}-error-container`,
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
        errorContainer: [
            classNames.errorContainer,
            {
                flexGrow: 1,
                padding: '0 8px 20px',
                whiteSpace: 'normal',
                fontSize: FontSizes.size12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                fontWeight: FontWeights.bold
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
                height: 24
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
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0px 4px',
                        height: 24,
                        background: 'transparent',
                        ':hover': {
                            backgroundColor:
                                theme.semanticColors.buttonBackgroundHovered
                        },
                        ':not(:focus)': {
                            borderColor: 'transparent'
                        }
                    },
                    '.ms-Dropdown::after': {
                        borderWidth: 1,
                        borderColor: theme.semanticColors.focusBorder
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
