import { IStyle, IStyleFunctionOrObject, Theme } from '@fluentui/react';

export interface IConditionsListProps {
    styles?: IStyleFunctionOrObject<
        IConditionsListStylesProps,
        IConditionsListStyles
    >;
}

export interface IConditionsListStyles {
    container: IStyle;
}

export interface IConditionsListStylesProps {
    theme: Theme;
}
