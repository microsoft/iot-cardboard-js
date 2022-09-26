import { ITheme, IButtonStyles, ICalloutContentStyles } from '@fluentui/react';

export interface ISubMenuStyleProps {
    theme: ITheme;
    isMenuOpen: boolean;
}

export interface ISubMenuStyles {
    subMenuCallout: Partial<ICalloutContentStyles>;
    menuItemButton: IButtonStyles;
}
