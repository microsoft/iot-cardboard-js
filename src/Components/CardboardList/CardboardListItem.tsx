import {
    Checkbox,
    DefaultButton,
    FontIcon,
    IContextualMenuItem,
    useTheme
} from '@fluentui/react';
import React, { ReactNode, useCallback, useRef, useState } from 'react';
import { CardboardIconNames, Utils } from '../..';
import { OverflowMenu } from '../OverflowMenu/OverflowMenu';
import {
    getStyles,
    getButtonStyles,
    checkboxStyles
} from './CardboardListItem.styles';

export type ICardboardListItemPropsInternal<T> = {
    /** unique identifier for this list of items. Will be joined with index */
    listKey: string;
    /** index of the item in the list */
    index: number;
    item: T;
    /** text to highlight on the primary text. mainly used for indicating search matches */
    textToHighlight?: string;
} & CardboardListItemProps<T>;
type IIconNames = string | CardboardIconNames;
type ICardboardListItemBaseProps = {
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
};
// when NOT provided, click handler required
type WithOnClickMenuUndefined<T> = {
    openMenuOnClick: undefined;
    onClick: (item: T) => void;
};
// when false provided, click handler required
type WithOnClickMenuFalse<T> = {
    openMenuOnClick?: false;
    onClick: (item: T) => void;
};
// when value provided, onClick must not be defined
type WithoutOnClick = {
    openMenuOnClick: true;
    onClick?: undefined;
};
// make it so that the two properties are mutually exclusive
export type CardboardListItemProps<T> = ICardboardListItemBaseProps &
    (WithOnClickMenuUndefined<T> | WithOnClickMenuFalse<T> | WithoutOnClick);

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
    console.log('render list item ' + index);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const showCheckbox = isChecked === true || isChecked === false;
    const showSecondaryText = !!textSecondary;
    const showStartIcon = !!iconStartName;
    const showEndIcon = !!iconEndName;
    const showOverflow = !!overflowMenuItems?.length;
    const overflowRef = useRef(null);
    // callback for when the menu opens and closes
    const onMenuStateChange = useCallback((state) => {
        setIsMenuOpen(state);
    }, []);
    const onMenuClick = useCallback(() => {
        overflowRef?.current?.openMenu?.();
        // set state for css
        onMenuStateChange(true);
    }, [overflowRef, setIsMenuOpen]);
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
                    } else {
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
                        // force the menu icon to show up when the menu is open since it's no longer hovered/focused
                        className={`${getStyles(theme).menuIcon} cb-more-menu ${
                            isMenuOpen ? 'cb-more-menu-visible' : ''
                        }`}
                        menuKey={listKey}
                        menuRef={overflowRef}
                        menuProps={{
                            items: overflowMenuItems,
                            onMenuDismissed: () => onMenuStateChange(false),
                            onMenuOpened: () => onMenuStateChange(true)
                        }}
                    />
                )}
            </DefaultButton>
        </>
    );
};

const preventFocus = {
    'data-is-focusable': false
} as React.ButtonHTMLAttributes<HTMLElement | HTMLButtonElement>;
