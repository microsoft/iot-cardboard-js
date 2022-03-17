import {
    FontSizes,
    IButtonStyles,
    IStyle,
    memoizeFunction,
    mergeStyleSets,
    Theme
} from '@fluentui/react';
import { StyleConstants } from '../../Models/Constants';

const classPrefix = 'cardboard-list-item';
const classNames = {
    checkbox: `${classPrefix}-checkbox`,
    endIcon: `${classPrefix}-end-icon`,
    icon: `${classPrefix}-icon`,
    menuIcon: `${classPrefix}-menu-icon`,
    textContainer: `${classPrefix}-text-container`,
    primaryText: `${classPrefix}-primary-text`,
    secondaryText: `${classPrefix}-secondary-text`
};
export const getStyles = memoizeFunction((theme: Theme) => {
    const ellipseStyles = {
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis'
    };
    return mergeStyleSets({
        checkbox: [classNames.checkbox, { marginRight: 8 } as IStyle],
        endIcon: [classNames.endIcon, { marginLeft: 8 } as IStyle],
        icon: [
            classNames.icon,
            {
                marginRight: 8,
                fontSize: StyleConstants.icons.size16
            } as IStyle
        ],
        menuIcon: [classNames.menuIcon, { opacity: 0 } as IStyle],
        textContainer: [
            classNames.textContainer,
            {
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1,
                overflow: 'hidden',
                textAlign: 'start'
            } as IStyle
        ],
        primaryText: [
            classNames.primaryText,
            {
                color: theme.palette.black,
                fontSize: FontSizes.size14,
                ...ellipseStyles
            } as IStyle
        ],
        secondaryText: [
            classNames.secondaryText,
            {
                color: theme.palette.neutralSecondary,
                fontSize: FontSizes.size12,
                ...ellipseStyles
            } as IStyle
        ]
    });
});
export const getButtonStyles = memoizeFunction(
    (theme: Theme): IButtonStyles => {
        return {
            root: {
                alignItems: 'start', // top align everything
                border: 0,
                height: 'auto',
                ':hover .cb-more-menu, :focus .cb-more-menu, .cb-more-menu-visible': {
                    opacity: 1
                },
                padding: '8px 12px',
                width: '100%'
            },
            rootFocused: {
                backgroundColor: theme.palette.neutralLighter
            },
            rootHovered: {
                backgroundColor: theme.palette.neutralLighter
            },
            flexContainer: {
                justifyContent: 'start'
            }
        };
    }
);
