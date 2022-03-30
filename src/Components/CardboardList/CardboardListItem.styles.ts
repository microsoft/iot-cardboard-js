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
    menuPlaceholder: `${classPrefix}-menu-placeholder`,
    textContainer: `${classPrefix}-text-container`,
    primaryText: `${classPrefix}-primary-text`,
    root: `${classPrefix}-root`,
    secondaryText: `${classPrefix}-secondary-text`,
    separator: `${classPrefix}-separator`
};
export const getStyles = memoizeFunction(
    (theme: Theme, isMenuOpen: boolean) => {
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
            menuIcon: [
                classNames.menuIcon,
                { opacity: 0, position: 'absolute', right: 12 } as IStyle
            ],
            menuPlaceholder: [
                classNames.menuPlaceholder,
                { minWidth: 32 } as IStyle
            ],
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
            root: [
                classNames.root,
                {
                    alignItems: 'center',
                    display: 'flex',
                    flexDirection: 'horizontal',
                    ':hover .cb-list-item-menu-icon, :focus-within .cb-list-item-menu-icon': {
                        opacity: 1
                    }
                } as IStyle,
                // force the menu icon to show up when the menu is open since it's no longer hovered/focused
                isMenuOpen && {
                    '& .cb-list-item-menu-icon': {
                        opacity: 1
                    }
                }
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
    }
);
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
            flexContainer: {
                justifyContent: 'start',
                ...(customStyles?.flexContainer as IRawStyle)
            }
        };
    }
);
