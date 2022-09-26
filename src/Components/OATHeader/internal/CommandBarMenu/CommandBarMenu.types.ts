import {
    IButtonProps,
    IButtonStyles,
    ICalloutContentStyles,
    ISeparatorStyles,
    IStyle,
    IStyleFunctionOrObject,
    ITheme
} from '@fluentui/react';

export enum ICommandBarMenuItemType {
    Button = 'Button',
    Divider = 'Divider'
}
export type ICommandBarSubMenuItem = IMenuDivider | IMenuButton;
interface IMenuButton extends IButtonProps {
    key: string;
    menuItemType: ICommandBarMenuItemType.Button;
}
interface IMenuDivider {
    menuItemType: ICommandBarMenuItemType.Divider;
}

export interface ICommandBarMenuProps {
    /** whether the menu is visible */
    isMenuOpen: boolean;
    items: ICommandBarSubMenuItem[];
    /** callback fired when trying to close the menu. Set the `isMenuOpen` state to false */
    onMenuClose: () => void;
    /** the dom id of the target element to bind the menu to */
    targetId: string;

    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<
        ICommandBarMenuStyleProps,
        ICommandBarMenuStyles
    >;
}

export interface ICommandBarMenuStyleProps {
    theme: ITheme;
    menuMinWidth: number;
}
export interface ICommandBarMenuStyles {
    root: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: ICommandBarMenuSubComponentStyles;
}

export interface ICommandBarMenuSubComponentStyles {
    callout: Partial<ICalloutContentStyles>;
    menuItemButton: IButtonStyles;
    menuItemSeparator: Partial<ISeparatorStyles>;
}
