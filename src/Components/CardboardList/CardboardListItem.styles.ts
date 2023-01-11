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
export const CARDBOARD_LIST_ITEM_CLASS_NAMES = {
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
                CARDBOARD_LIST_ITEM_CLASS_NAMES.alertDot,
                {
                    backgroundColor: theme.semanticColors.errorText,
                    borderRadius: 6,
                    height: 6,
                    marginLeft: -12,
                    marginRight: 6,
                    width: 6
                } as IStyle
            ],
            checkbox: [
                CARDBOARD_LIST_ITEM_CLASS_NAMES.checkbox,
                { marginRight: 8 } as IStyle
            ],
            endIcon: [
                CARDBOARD_LIST_ITEM_CLASS_NAMES.endIcon,
                { marginLeft: 8 } as IStyle
            ],
            icon: [
                CARDBOARD_LIST_ITEM_CLASS_NAMES.icon,
                {
                    marginRight: 8,
                    fontSize: StyleConstants.icons.size16
                } as IStyle
            ],
            iconButton: [
                CARDBOARD_LIST_ITEM_CLASS_NAMES.menuIcon,
                {
                    color: theme.semanticColors.bodyText,
                    position: 'absolute',
                    right: 12
                } as IStyle
            ],
            menuIcon: [
                CARDBOARD_LIST_ITEM_CLASS_NAMES.menuIcon,
                { opacity: 0 } as IStyle
            ],
            menuPlaceholder: [
                CARDBOARD_LIST_ITEM_CLASS_NAMES.menuPlaceholder,
                { minWidth: 32 } as IStyle
            ],
            textContainer: [
                CARDBOARD_LIST_ITEM_CLASS_NAMES.textContainer,
                {
                    display: 'flex',
                    flexDirection: 'column',
                    flexGrow: 1,
                    overflow: 'hidden',
                    textAlign: 'start'
                } as IStyle
            ],
            primaryText: [
                CARDBOARD_LIST_ITEM_CLASS_NAMES.primaryText,
                {
                    color: theme.palette.black,
                    fontSize: FontSizes.size14,
                    ...ellipseStyles
                } as IStyle
            ],
            root: [
                CARDBOARD_LIST_ITEM_CLASS_NAMES.root,
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
                CARDBOARD_LIST_ITEM_CLASS_NAMES.secondaryText,
                {
                    color: theme.palette.neutralSecondary,
                    fontSize: FontSizes.size12,
                    ...ellipseStyles
                } as IStyle
            ],
            separator: [
                CARDBOARD_LIST_ITEM_CLASS_NAMES.separator,
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
        theme: Theme,
        customStyles: Partial<IButtonStyles> | undefined
    ): IButtonStyles => {
        return {
            ...(customStyles as IButtonStyles),
            root: [
                {
                    alignItems: 'start', // top align everything
                    border: '1px solid transparent',
                    height: 'auto',
                    ':hover .cb-more-menu, :focus .cb-more-menu, .cb-more-menu-visible': {
                        opacity: 1
                    },
                    padding: '8px 12px',
                    width: '100%'
                },
                { ...(customStyles?.root as IRawStyle) },
                itemType === 'item' && {
                    paddingLeft: 40
                },
                itemType === 'header' && {
                    borderTop: `1px solid ${theme.palette.neutralLight}`
                }
            ],
            rootChecked: {
                backgroundColor: theme.semanticColors.buttonBackgroundPressed,
                borderColor: theme.palette.black,
                ...(customStyles?.rootChecked as IRawStyle)
            },
            flexContainer: {
                justifyContent: 'start',
                ...(customStyles?.flexContainer as IRawStyle)
            }
        };
    }
);
