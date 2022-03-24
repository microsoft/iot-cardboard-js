import {
    FontSizes,
    IButtonStyles,
    IRawStyle,
    IStyle,
    memoizeFunction,
    mergeStyleSets,
    Theme
} from '@fluentui/react';
import {
    CardboardClassNamePrefix,
    StyleConstants
} from '../../Models/Constants';

const classPrefix = `${CardboardClassNamePrefix}-list-item`;
const classNames = {
    checkbox: `${classPrefix}-checkbox`,
    endIcon: `${classPrefix}-end-icon`,
    icon: `${classPrefix}-icon`,
    menuIcon: `${classPrefix}-menu-icon`,
    textContainer: `${classPrefix}-text-container`,
    primaryText: `${classPrefix}-primary-text`,
    secondaryText: `${classPrefix}-secondary-text`,
    separator: `${classPrefix}-separator`
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
        ],
        separator: [
            classNames.separator,
            {
                backgroundColor: 'transparent',
                padding: 0,
                height: 1
            } as IStyle
        ]
    });
});
export const getButtonStyles = memoizeFunction(
    (theme: Theme, customStyles?: Partial<IButtonStyles>): IButtonStyles => {
        return {
            root: {
                alignItems: 'start', // top align everything
                border: 0,
                height: 'auto',
                ':hover .cb-more-menu, :focus .cb-more-menu, .cb-more-menu-visible': {
                    opacity: 1
                },
                padding: '8px 12px',
                width: '100%',
                ...(customStyles?.root as IRawStyle)
            },
            rootFocused: {
                backgroundColor: theme.palette.neutralLighter,
                ...(customStyles?.rootFocused as IRawStyle)
            },
            rootHovered: {
                backgroundColor: theme.palette.neutralLighter,
                ...(customStyles?.rootHovered as IRawStyle)
            },
            flexContainer: {
                justifyContent: 'start',
                ...(customStyles?.flexContainer as IRawStyle)
            }
        };
    }
);
