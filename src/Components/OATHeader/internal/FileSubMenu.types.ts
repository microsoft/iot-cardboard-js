import {
    ITheme,
    IStyle,
    IStyleFunctionOrObject,
    ICalloutContentStyles,
    IButtonStyles
} from '@fluentui/react';
import { IAction } from '../../../Models/Constants/Interfaces';
import { IOATEditorState } from '../../../Pages/OATEditorPage/OATEditorPage.types';

export type IFileSubMenuProps = {
    dispatch?: React.Dispatch<React.SetStateAction<IAction>>;
    onFileSubMenuClose: () => void;
    isActive?: boolean;
    state?: IOATEditorState;
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<IFileSubMenuStyleProps, IFileSubMenuStyles>;
    targetId?: string;
};

export interface IFileSubMenuStyleProps {
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

export interface IFileSubMenuSubComponentStyles {
    subMenuCallout: Partial<ICalloutContentStyles>;
    menuItemButton: IButtonStyles;
}
