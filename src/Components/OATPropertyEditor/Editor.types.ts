import { IAction } from '../../Models/Constants/Interfaces';
import { IOATPropertyEditorState } from './OATPropertyEditor.types';
import { Theme } from '../../Models/Constants/Enums';
import { DtdlInterface, DtdlInterfaceContent } from '../..';
import { IStyleFunctionOrObject, IStyle } from '@fluentui/react';
import { IExtendedTheme } from '../../Theming/Theme.types';
import { IllustrationMessageStyles } from '../IllustrationMessage/IllustrationMessage.types';

export type IEditorProps = {
    editorDispatch?: React.Dispatch<React.SetStateAction<IAction>>;
    editorState?: IOATPropertyEditorState;
    selectedItem: DtdlInterface | DtdlInterfaceContent;
    selectedThemeName?: Theme;
    /** the id of the parent model (if relationship is selected, else undefined) */
    parentModelId: string | undefined;
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<IEditorStyleProps, IEditorStyles>;
};

export interface IEditorStyleProps {
    theme: IExtendedTheme;
}
export interface IEditorStyles {
    root: IStyle;
    modal: IStyle;
    pivot: IStyle;
    pivotItem: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: IEditorSubComponentStyles;
}

export interface IEditorSubComponentStyles {
    illustrationMessage?: IllustrationMessageStyles;
}
