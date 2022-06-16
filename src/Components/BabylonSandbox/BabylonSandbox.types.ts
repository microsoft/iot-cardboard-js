import { IStyle, IStyleFunctionOrObject, ITheme } from '@fluentui/react';

export interface IBabylonSandboxProps {
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<
        IBabylonSandboxStyleProps,
        IBabylonSandboxStyles
    >;
}

export interface IBabylonSandboxStyleProps {
    theme: ITheme;
}
export interface IBabylonSandboxStyles {
    root: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: IBabylonSandboxSubComponentStyles;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IBabylonSandboxSubComponentStyles {}
