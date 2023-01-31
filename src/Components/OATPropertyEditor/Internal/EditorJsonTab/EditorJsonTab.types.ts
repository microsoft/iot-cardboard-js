import { IStyle, IStyleFunctionOrObject } from '@fluentui/react';
import {
    DtdlInterface,
    DtdlInterfaceContent,
    Theme
} from '../../../../Models/Constants';
import { IExtendedTheme } from '../../../../Theming/Theme.types';

export interface IEditorJsonTabProps {
    selectedItem: DtdlInterface | DtdlInterfaceContent;
    selectedThemeName: Theme;
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<
        IEditorJsonTabStyleProps,
        IEditorJsonTabStyles
    >;
}

export interface IEditorJsonTabStyleProps {
    theme: IExtendedTheme;
}
export interface IEditorJsonTabStyles {
    root: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: IEditorJsonTabSubComponentStyles;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IEditorJsonTabSubComponentStyles {}
