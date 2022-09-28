import {
    ITheme,
    IStyle,
    IStyleFunctionOrObject,
    IModalStyles
} from '@fluentui/react';
import { ISubMenuStyleProps, ISubMenuStyles } from './Shared.types';

export type IFileSubMenuProps = {
    onFileSubMenuClose: () => void;
    isActive?: boolean;
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<IFileSubMenuStyleProps, IFileSubMenuStyles>;
    targetId?: string;
};

export interface IFileSubMenuStyleProps extends ISubMenuStyleProps {
    theme: ITheme;
    isMenuOpen: boolean;
}

export interface IFileSubMenuStyles {
    modal: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: IFileSubMenuSubComponentStyles;
}

export interface IFileSubMenuSubComponentStyles extends ISubMenuStyles {
    modal: Partial<IModalStyles>;
}
