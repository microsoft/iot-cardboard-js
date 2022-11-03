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
import { CardboardGroupedListItemType } from './CardboardGroupedList.types';

const classPrefix = `${CardboardClassNamePrefix}-list-item`;
export const classNames = {
    alertDot: `${classPrefix}-alert-dot`,
    checkbox: `${classPrefix}-checkbox`,
    endIcon: `${classPrefix}-end-icon`,
    icon: `${classPrefix}-icon`,
    iconButton: `${classPrefix}-icon-button`,
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
            alertDot: [
                classNames.alertDot,
                {
                    backgroundColor: theme.semanticColors.errorText,
                    borderRadius: 6,
                    height: 6,
                    marginLeft: -12,
                    marginRight: 6,
                    width: 6
                } as IStyle
            ],
            checkbox: [classNames.checkbox, { marginRight: 8 } as IStyle],
            endIcon: [classNames.endIcon, { marginLeft: 8 } as IStyle],
            icon: [
                classNames.icon,
                {
                    marginRight: 8,
                    fontSize: StyleConstants.icons.size16
                } as IStyle
            ],
            iconButton: [
                classNames.menuIcon,
                {
                    color: theme.semanticColors.bodyText,
                    position: 'absolute',
                    right: 12
                } as IStyle
            ],
            menuIcon: [classNames.menuIcon, { opacity: 0 } as IStyle],
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
                    },
                    position: 'relative'
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
    (
        itemType: CardboardGroupedListItemType | undefined,
        isSelected: boolean | undefined,
        theme: Theme,
        customStyles: Partial<IButtonStyles> | undefined
    ): IButtonStyles => {
        return {
            root: [
                {
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
                isSelected && {
                    backgroundColor:
                        theme.semanticColors.buttonBackgroundPressed
                },
                itemType === 'item' && {
                    paddingLeft: 40
                },
                itemType === 'header' && {
                    borderTop: `1px solid ${theme.palette.neutralLight}`
                }
            ],
            flexContainer: {
                justifyContent: 'start',
                ...(customStyles?.flexContainer as IRawStyle)
            }
        };
    }
);
