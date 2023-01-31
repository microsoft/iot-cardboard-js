import {
    IStackStyles,
    IStyle,
    IStyleFunctionOrObject,
    ITheme
} from '@fluentui/react';

export interface IHeaderControlGroupProps {
    id?: string;
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

export interface IHeaderControlGroupSubComponentStyles {
    stack: IStackStyles;
}
