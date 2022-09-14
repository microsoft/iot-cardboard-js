import {
    ICommandBarStyles,
    IStyle,
    IStyleFunctionOrObject,
    ITheme
} from '@fluentui/react';
import { IAction } from '../../Models/Constants/Interfaces';
import { IOATEditorState } from '../../Pages/OATEditorPage/OATEditorPage.types';

export type IOATHeaderProps = {
    dispatch?: React.Dispatch<React.SetStateAction<IAction>>;
    state?: IOATEditorState;
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<IOATHeaderStyleProps, IOATHeaderStyles>;
};

export interface IOATHeaderStyleProps {
    theme: ITheme;
}

export interface IOATHeaderStyles {
    root: IStyle;
    searchComponent: IStyle;
    logo: IStyle;
    search: IStyle;
    options: IStyle;
    menuComponent: IStyle;
    optionIcon: IStyle;
    uploadDirectoryInput: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: IOATHeaderSubComponentStyles;
}

export interface IOATHeaderSubComponentStyles {
    commandBar: ICommandBarStyles;
}
