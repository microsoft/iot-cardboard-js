import {
    ITheme,
    IButtonStyles,
    ICalloutContentStyles,
    IStyle
} from '@fluentui/react';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ISharedModalStyleProps {}

export interface ISharedModalStyles {
    modalRow: IStyle;
    modalRowFlexEnd: IStyle;
    modalRowCenterItem: IStyle;
}

export interface ISubMenuStyleProps {
    theme: ITheme;
    isMenuOpen: boolean;
}

export interface ISubMenuStyles {
    subMenuCallout: Partial<ICalloutContentStyles>;
    menuItemButton: IButtonStyles;
}
