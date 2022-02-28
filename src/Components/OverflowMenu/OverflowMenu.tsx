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
    /** index of the item in the list */
    index: number;
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
    index,
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
        [menuProps.items]
    );
    return (
        <>
            <IconButton
                {...buttonProps}
                componentRef={menuRef}
                menuIconProps={{
                    iconName: 'MoreVertical',
                    style: {
                        fontWeight: 'bold',
                        fontSize: StyleConstants.icons.size16,
                        color: theme.palette.black
                    }
                }}
                data-testid={`context-menu-${menuKey}-${index}-moreMenu`}
                data-is-focusable={false}
                title={t('more')}
                ariaLabel={ariaLabel || t('more')}
                menuProps={{ ...menuProps, items: menuItems }}
            ></IconButton>
        </>
    );
};
