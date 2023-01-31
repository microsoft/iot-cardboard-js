import {
    IButton,
    IButtonProps,
    IconButton,
    IContextualMenuItem,
    IContextualMenuProps,
    IRefObject,
    useTheme
} from '@fluentui/react';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleConstants } from '../../Models/Constants';

export interface IOverflowMenuProps {
    /** Button screen reader label */
    ariaLabel?: string;
    /** override any default props for the icon button */
    buttonProps?: IButtonProps;
    /** class name for the root */
    className?: string;
    /** index of the item in the list */
    index: number | string;
    /** whether to let the button be focusable */
    isFocusable?: boolean;
    /** unique identifier for the menu in a list of elements */
    menuKey: string;
    /** overrides for the default menu props, including the list items to include */
    menuProps: IContextualMenuProps;
    /** reference to the menu button */
    menuRef?: IRefObject<IButton>;
    /** Hover text and text label for screen readers when hovered/focused */
    title?: string;
}
export const OverflowMenu: React.FC<IOverflowMenuProps> = ({
    ariaLabel,
    buttonProps,
    className,
    index,
    isFocusable,
    menuKey,
    menuProps,
    menuRef
}) => {
    const { t } = useTranslation();
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
        [menuProps.items, theme.palette.black]
    );
    return (
        <>
            <IconButton
                {...buttonProps}
                ariaHidden={true}
                ariaLabel={ariaLabel || t('more')}
                className={className}
                componentRef={menuRef}
                data-is-focusable={!!isFocusable}
                data-testid={`context-menu-${menuKey}-${index}-moreMenu`}
                menuIconProps={{
                    iconName: 'MoreVertical',
                    style: {
                        fontWeight: 'bold',
                        fontSize: StyleConstants.icons.size16,
                        color: theme.palette.black
                    }
                }}
                menuProps={{
                    ...menuProps,
                    items: menuItems
                }}
                title={t('more')}
            ></IconButton>
        </>
    );
};
