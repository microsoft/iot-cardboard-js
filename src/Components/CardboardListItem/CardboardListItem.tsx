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
import React, { useCallback, useMemo, useRef } from 'react';
import { StyleConstants, Utils } from '../..';
import {
    getStyles,
    getButtonStyles,
    checkboxStyles
} from './CardboardListItem.styles';

type IIconNames = string | 'Shapes';
export interface ICardboardListItemPropsInternal
    extends ICardboardListItemProps {
    /** unique identifier for this list of items. Will be joined with index */
    key: string;
    /** index of the item in the list */
    index: number;
    /** triggered when list item is clicked */
    onClick: () => void;
    /** text to highlight on the primary text. mainly used for indicating search matches */
    textToHighlight?: string;
}
export interface ICardboardListItemProps {
    /** screen reader text to use for the list item */
    ariaLabel: string;
    /** icon to render on the right side of the list item */
    iconEndName?: IIconNames;
    /** icon to render at the left side of the list item */
    iconStartName?: IIconNames;
    /** if provided will result in rendering the checkbox in either checked or unchecked state. If not provided, will not render a checkbox */
    isChecked?: boolean;
    /** List items to show in the overflow set */
    overflowMenuItems?: IContextualMenuItem[];
    /** primary text to show */
    textPrimary: string;
    /** secondary text to show below the main text */
    textSecondary?: string;
}

export const CardboardListItem: React.FC<ICardboardListItemPropsInternal> = ({
    iconEndName,
    iconStartName,
    index,
    isChecked,
    key,
    overflowMenuItems,
    textPrimary,
    textSecondary,
    textToHighlight,
    onClick
}) => {
    const showCheckbox = isChecked === true || isChecked === false;
    const showSecondaryText = !!textSecondary;
    const showStartIcon = !!iconStartName;
    const showEndIcon = !!iconEndName;
    const showOverflow = !!overflowMenuItems?.length;
    const menuRef = useRef(null);
    const onMenuClick = useCallback(() => {
        menuRef?.current?.openMenu?.();
    }, [menuRef]);
    const theme = useTheme();
    const customStyles = getStyles(theme);
    const buttonStyles = getButtonStyles(theme);
    return (
        <>
            <DefaultButton
                key={`cardboard-list-item-${key}-${index}`}
                styles={buttonStyles}
                onClick={onClick}
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
                        key={key}
                        menuRef={menuRef}
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
    key: string;
    menuProps: IContextualMenuProps;
    menuRef: IRefObject<IButton>;
}
const OverflowMenu: React.FC<IOverflowMenuProps> = ({
    index,
    key,
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
                data-testid={`cardboard-list-item-${key}-${index}-moreMenu`}
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
