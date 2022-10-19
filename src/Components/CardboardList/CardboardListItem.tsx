import {
    css,
    DefaultButton,
    FontIcon,
    IconButton,
    useTheme
} from '@fluentui/react';
import React, { ReactNode, useCallback, useRef, useState } from 'react';
import { Utils } from '../..';
import CheckboxRenderer from '../CheckboxRenderer/CheckboxRenderer';
import { OverflowMenu } from '../OverflowMenu/OverflowMenu';
import { ICardboardListItemPropsInternal } from './CardboardList.types';
import { getStyles, getButtonStyles } from './CardboardListItem.styles';

export const CardboardListItem = <T extends unknown>(
    props: ICardboardListItemPropsInternal<T> & { children?: ReactNode }
) => {
    const {
        buttonProps,
        iconEnd,
        iconStart,
        index,
        item,
        itemType,
        isChecked,
        isValid,
        listKey,
        openMenuOnClick,
        overflowMenuItems,
        textPrimary,
        textSecondary,
        textToHighlight,
        onClick
    } = props;
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const showCheckbox = isChecked === true || isChecked === false;
    const showSecondaryText = !!textSecondary;

    // start icon
    const isStartIconCustomRender = typeof iconStart === 'function';
    const showStartIcon = !!iconStart && !isStartIconCustomRender;
    const showWarningIndicator = isValid === false;

    // end icon
    const isEndIconCustomRender = typeof iconEnd === 'function';
    const showEndIconButton =
        !isEndIconCustomRender && iconEnd?.name && iconEnd?.onClick;
    const showEndIcon =
        !isEndIconCustomRender && iconEnd?.name && !showEndIconButton;

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
    }, [onMenuStateChange]);

    const onSecondaryAction = useCallback(() => {
        !isEndIconCustomRender && iconEnd?.onClick?.(item);
    }, [iconEnd, isEndIconCustomRender, item]);

    const onButtonClick = useCallback(() => {
        if (openMenuOnClick) {
            onMenuClick();
        } else {
            onClick(item);
        }
    }, [openMenuOnClick, onMenuClick, onClick, item]);
    const onButtonKeyPress = useCallback(
        (event: React.KeyboardEvent<HTMLButtonElement>) => {
            if (event.code === 'Space') {
                if (showOverflow) {
                    // if we are showing the menu, trigger that callback
                    onMenuClick();
                } else if (showEndIconButton) {
                    // if we are showing the end action, trigger that callback
                    onSecondaryAction();
                }
            }
        },
        [onMenuClick, onSecondaryAction, showEndIconButton, showOverflow]
    );

    const theme = useTheme();
    const classNames = getStyles(theme, isMenuOpen);
    const buttonStyles = getButtonStyles(
        itemType,
        theme,
        buttonProps?.customStyles
    );
    return (
        <>
            <span className={classNames.root}>
                <DefaultButton
                    {...buttonProps}
                    key={`cardboard-list-item-${listKey}-${index}`}
                    data-testid={`cardboard-list-item-${listKey}-${index}`}
                    styles={buttonStyles}
                    onClick={onButtonClick}
                    onKeyPress={onButtonKeyPress}
                >
                    {showWarningIndicator && (
                        <span className={classNames.alertDot} />
                    )}
                    {showCheckbox && (
                        <>
                            <CheckboxRenderer
                                isChecked={isChecked}
                                className={classNames.checkbox}
                            />
                        </>
                    )}
                    {isStartIconCustomRender && iconStart(item)}
                    {showStartIcon &&
                        (typeof iconStart.name === 'string' ? (
                            <FontIcon
                                iconName={iconStart.name}
                                className={classNames.icon}
                            />
                        ) : (
                            iconStart.name
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
                    {isEndIconCustomRender && iconEnd(item)}
                    {showEndIcon && (
                        <FontIcon
                            iconName={iconEnd.name}
                            className={`${classNames.icon} ${classNames.endIcon}`}
                        />
                    )}
                    {(showOverflow || showEndIconButton) && (
                        <div className={classNames.menuPlaceholder}></div>
                    )}
                </DefaultButton>
                {showEndIconButton && (
                    <IconButton
                        className={classNames.iconButton}
                        data-is-focusable={false}
                        data-testid={`cardboard-list-item-secondary-action-${index}`}
                        iconProps={{ iconName: iconEnd.name }}
                        onClick={onSecondaryAction}
                        styles={{
                            root: {
                                color: theme.semanticColors.bodyText
                            },
                            rootHovered: {
                                color: theme.semanticColors.bodyText
                            },
                            rootPressed: {
                                color: theme.semanticColors.bodyText
                            }
                        }}
                    />
                )}
                {showOverflow && (
                    <OverflowMenu
                        index={index}
                        className={css(
                            classNames.iconButton,
                            classNames.menuIcon
                        )}
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
