import { IStyle, IStyleFunctionOrObject } from '@fluentui/react';
import { IExtendedTheme } from '../../../../Theming/Theme.types';

export interface IShellProps {
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<IShellStyleProps, IShellStyles>;
}

export interface IShellStyleProps {
    theme: IExtendedTheme;
}
export interface IShellStyles {
    root: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: IShellSubComponentStyles;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IShellSubComponentStyles {}
