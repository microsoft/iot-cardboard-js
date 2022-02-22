import {
    Checkbox,
    DefaultButton,
    FontIcon,
    FontSizes,
    getTheme,
    IButton,
    IButtonStyles,
    ICheckboxStyles,
    IconButton,
    IContextualMenuItem,
    IContextualMenuProps,
    IRefObject,
    memoizeFunction,
    mergeStyleSets,
    Stack
} from '@fluentui/react';
import React, { useCallback, useRef } from 'react';
import { Utils } from '../..';

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
    const styles = getStyles();
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
                        className={styles.icon}
                    />
                )}
                <div className={styles.textContainer}>
                    <div className={styles.primaryText} title={textPrimary}>
                        {textToHighlight
                            ? Utils.getMarkedHtmlBySearch(
                                  textPrimary,
                                  textToHighlight
                              )
                            : textPrimary}
                    </div>
                    {showSecondaryText && (
                        <div
                            className={styles.secondaryText}
                            title={textSecondary}
                        >
                            {textSecondary}
                        </div>
                    )}
                </div>
                {showEndIcon && (
                    <FontIcon
                        iconName={iconEndName}
                        className={`${styles.icon} ${styles.endIcon}`}
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
    return (
        <>
            <IconButton
                componentRef={menuRef}
                menuIconProps={{
                    iconName: 'MoreVertical',
                    style: {
                        fontWeight: 'bold',
                        fontSize: 18,
                        color: 'var(--cb-color-text-primary)'
                    }
                }}
                data-testid={`cardboard-list-item-${key}-${index}-moreMenu`}
                data-is-focusable="false"
                title={'More'} // t('more')
                ariaLabel={'More menu'} // t('more')
                menuProps={menuProps}
                open={true}
            ></IconButton>
        </>
    );
};

const preventFocus = {
    'data-is-focusable': 'false'
} as React.ButtonHTMLAttributes<HTMLElement | HTMLButtonElement>;
const { palette } = getTheme();
const getStyles = memoizeFunction(() => {
    const ellipseStyles = {
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis'
    };
    return mergeStyleSets({
        textContainer: {
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
            overflow: 'hidden',
            textAlign: 'start'
        },
        primaryText: {
            color: palette.neutralDark,
            ...ellipseStyles
        },
        secondaryText: {
            color: palette.neutralPrimary,
            fontSize: FontSizes.size10,
            ...ellipseStyles
        },
        icon: { marginRight: '8px', fontSize: '20px' },
        endIcon: { marginLeft: '4px' }
    });
});
const checkboxStyles: ICheckboxStyles = {
    checkbox: {
        marginRight: '8px'
    }
};
const buttonStyles: IButtonStyles = {
    root: {
        alignItems: 'start', // top align everything
        padding: '8px 12px 8px 20px',
        width: '100%',
        height: 'auto'
    },
    flexContainer: {
        justifyContent: 'start'
    }
};
