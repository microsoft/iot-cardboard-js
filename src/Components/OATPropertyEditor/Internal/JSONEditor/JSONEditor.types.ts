import { IStyle, IStyleFunctionOrObject } from '@fluentui/react';
import { Theme } from '../../../../Models/Constants/Enums';
import { IExtendedTheme } from '../../../../Theming/Theme.types';

export interface IJSONEditorProps {
    selectedTheme?: Theme;
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<IJSONEditorStyleProps, IJSONEditorStyles>;
}

export interface IJSONEditorStyleProps {
    theme: IExtendedTheme;
}
export interface IJSONEditorStyles {
    root: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: IJSONEditorSubComponentStyles;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IJSONEditorSubComponentStyles {}
