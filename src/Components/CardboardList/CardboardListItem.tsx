import { DefaultButton, FontIcon, useTheme } from '@fluentui/react';
import React, { ReactNode, useCallback, useRef, useState } from 'react';
import { Utils } from '../..';
import CheckboxRenderer from '../CheckboxRenderer/CheckboxRenderer';
import { OverflowMenu } from '../OverflowMenu/OverflowMenu';
import { ICardboardListItemPropsInternal } from './CardboardList.types';
import { getStyles, getButtonStyles } from './CardboardListItem.styles';

export const CardboardListItem = <T extends unknown>({
    buttonProps,
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
    const classNames = getStyles(theme, isMenuOpen);
    const buttonStyles = getButtonStyles(theme, buttonProps?.customStyles);
    return (
        <>
            <span className={classNames.root}>
                <DefaultButton
                    {...buttonProps}
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
                        <>
                            <CheckboxRenderer
                                isChecked={isChecked}
                                className={classNames.checkbox}
                            />
                        </>
                    )}
                    {showStartIcon &&
                        (typeof iconStartName === 'string' ? (
                            <FontIcon
                                iconName={iconStartName}
                                className={classNames.icon}
                            />
                        ) : (
                            iconStartName
                        ))}
                    <div className={classNames.textContainer}>
                        <div
                            className={classNames.primaryText}
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
                                className={classNames.secondaryText}
                                title={textSecondary}
                            >
                                {textSecondary}
                            </div>
                        )}
                    </div>
                    {showEndIcon && (
                        <FontIcon
                            iconName={iconEndName}
                            className={`${classNames.icon} ${classNames.endIcon}`}
                        />
                    )}
                    {showOverflow && (
                        <div className={classNames.menuPlaceholder}></div>
                    )}
                </DefaultButton>
                {showOverflow && (
                    <OverflowMenu
                        index={index}
                        className={classNames.menuIcon}
                        menuKey={listKey}
                        menuRef={overflowRef}
                        menuProps={{
                            items: overflowMenuItems,
                            onMenuDismissed: () => onMenuStateChange(false),
                            onMenuOpened: () => onMenuStateChange(true)
                        }}
                    />
                )}
            </span>
        </>
    );
};
