import { IStyle, IStyleFunctionOrObject, Theme } from '@fluentui/react';

export interface IConditionsListProps {
    styles?: IStyleFunctionOrObject<
        IConditionsListStylesProps,
        IConditionsListStyles
    >;
}

export interface IConditionsListStyles {
    container: IStyle;
    subComponentStyles?: IConditionsListSubcomponentStyles;
}

export interface IConditionsListStylesProps {
    theme: Theme;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IConditionsListSubcomponentStyles {}
