import { IStyle, IStyleFunctionOrObject } from '@fluentui/react';

export interface IShellProps {
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<IShellStyleProps, IShellStyles>;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IShellStyleProps {}

export interface IShellStyles {
    root: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: IShellSubComponentStyles;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IShellSubComponentStyles {}
