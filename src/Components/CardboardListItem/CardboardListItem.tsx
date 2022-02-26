import {
    Checkbox,
    DefaultButton,
    FontIcon,
    IButton,
    IconButton,
    IContextualMenuItem,
    IContextualMenuProps,
    IRefObject,
    useTheme
} from '@fluentui/react';
import React, { ReactNode, useCallback, useMemo, useRef } from 'react';
import { CardboardIconNames, StyleConstants, Utils } from '../..';
import {
    getStyles,
    getButtonStyles,
    checkboxStyles
} from './CardboardListItem.styles';

export interface ICardboardListItemPropsInternal<T>
    extends ICardboardListItemProps<T> {
    /** unique identifier for this list of items. Will be joined with index */
    listKey: string;
    /** index of the item in the list */
    index: number;
    item: T;
    /** text to highlight on the primary text. mainly used for indicating search matches */
    textToHighlight?: string;
}
type IIconNames = string | CardboardIconNames;
export interface ICardboardListItemProps<T> {
    /** screen reader text to use for the list item */
    ariaLabel: string;
    /** icon to render on the right side of the list item */
    iconEndName?: IIconNames;
    /** icon to render at the left side of the list item */
    iconStartName?: IIconNames;
    /** if provided will result in rendering the checkbox in either checked or unchecked state. If not provided, will not render a checkbox */
    isChecked?: boolean;
    /** triggered when list item is clicked */
    onClick: (item: T) => void | undefined;
    /** open the context menu instead of calling the onClick handler */
    openMenuOnClick?: boolean;
    /** List items to show in the overflow set */
    overflowMenuItems?: IContextualMenuItem[];
    /** primary text to show */
    textPrimary: string;
    /** secondary text to show below the main text */
    textSecondary?: string;
}

export const CardboardListItem = <T extends unknown>({
    iconEndName,
    iconStartName,
    index,
    item,
    isChecked,
    listKey,
    openMenuOnClick,
    overflowMenuItems,
    textPrimary,
    textSecondary,
    textToHighlight,
    onClick
}: ICardboardListItemPropsInternal<T> & { children?: ReactNode }) => {
    const showCheckbox = isChecked === true || isChecked === false;
    const showSecondaryText = !!textSecondary;
    const showStartIcon = !!iconStartName;
    const showEndIcon = !!iconEndName;
    const showOverflow = !!overflowMenuItems?.length;
    const overflowRef = useRef(null);
    const onMenuClick = useCallback(() => {
        overflowRef?.current?.openMenu?.();
    }, [overflowRef]);
    const theme = useTheme();
    const customStyles = getStyles(theme);
    const buttonStyles = getButtonStyles();
    return (
        <>
            <DefaultButton
                key={`cardboard-list-item-${listKey}-${index}`}
                data-testid={`cardboard-list-item-${listKey}-${index}`}
                styles={buttonStyles}
                onClick={() => {
                    if (openMenuOnClick) {
                        onMenuClick();
                    } else if (onClick) {
                        onClick(item);
                    }
                }}
                onKeyPress={(event) => {
                    if (event.code === 'Space') {
                        onMenuClick();
                    }
                }}
            >
                {showCheckbox && (
                    <Checkbox
                        checked={isChecked}
                        inputProps={preventFocus}
                        styles={checkboxStyles}
                        onChange={() => undefined}
                    />
                )}
                {showStartIcon && (
                    <FontIcon
                        iconName={iconStartName}
                        className={customStyles.icon}
                    />
                )}
                <div className={customStyles.textContainer}>
                    <div
                        className={customStyles.primaryText}
                        title={textPrimary}
                    >
                        {textToHighlight
                            ? Utils.getMarkedHtmlBySearch(
                                  textPrimary,
                                  textToHighlight
                              )
                            : textPrimary}
                    </div>
                    {showSecondaryText && (
                        <div
                            className={customStyles.secondaryText}
                            title={textSecondary}
                        >
                            {textSecondary}
                        </div>
                    )}
                </div>
                {showEndIcon && (
                    <FontIcon
                        iconName={iconEndName}
                        className={`${customStyles.icon} ${customStyles.endIcon}`}
                    />
                )}
                {showOverflow && (
                    <OverflowMenu
                        index={index}
                        menuKey={listKey}
                        menuRef={overflowRef}
                        menuProps={{
                            items: overflowMenuItems
                        }}
                    />
                )}
            </DefaultButton>
        </>
    );
};

interface IOverflowMenuProps {
    index: number;
    menuKey: string;
    menuProps: IContextualMenuProps;
    menuRef: IRefObject<IButton>;
}
const OverflowMenu: React.FC<IOverflowMenuProps> = ({
    index,
    menuKey,
    menuProps,
    menuRef
}) => {
    const theme = useTheme();
    // override the menu icon color
    const menuItems: IContextualMenuItem[] = useMemo(
        () =>
            menuProps.items.map((x) => ({
                ...x,
                iconProps: {
                    ...x?.iconProps,
                    styles: {
                        ...x.iconProps?.styles,
                        root: {
                            color: theme.palette.black
                        }
                    }
                }
            })),
        [menuProps.items]
    );
    return (
        <>
            <IconButton
                componentRef={menuRef}
                menuIconProps={{
                    iconName: 'MoreVertical',
                    style: {
                        fontWeight: 'bold',
                        fontSize: StyleConstants.icons.size16,
                        color: theme.palette.black
                    }
                }}
                data-testid={`cardboard-list-item-${menuKey}-${index}-moreMenu`}
                data-is-focusable={false}
                title={'More'} // t('more')
                ariaLabel={'More menu'} // t('more')
                menuProps={{ ...menuProps, items: menuItems }}
                open={true}
            ></IconButton>
        </>
    );
};

const preventFocus = {
    'data-is-focusable': false
} as React.ButtonHTMLAttributes<HTMLElement | HTMLButtonElement>;
