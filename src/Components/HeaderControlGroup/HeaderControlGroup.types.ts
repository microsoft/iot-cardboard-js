import { IStyle, IStyleFunctionOrObject, ITheme } from '@fluentui/react';

export interface IHeaderControlGroupProps {
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<
        IHeaderControlGroupStyleProps,
        IHeaderControlGroupStyles
    >;
}

export interface IHeaderControlGroupStyleProps {
    theme: ITheme;
}
export interface IHeaderControlGroupStyles {
    root: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: IHeaderControlGroupSubComponentStyles;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IHeaderControlGroupSubComponentStyles {}
