import {
    IButtonStyles,
    IStyle,
    IStyleFunctionOrObject,
    Theme
} from '@fluentui/react';

export interface IConditionsListProps {
    styles?: IStyleFunctionOrObject<
        IConditionsListStylesProps,
        IConditionsListStyles
    >;
}

export interface IConditionsListStyles {
    container: IStyle;
    subComponentStyles?: IConditionsListSubComponentStyles;
}

export interface IConditionsListStylesProps {
    theme: Theme;
}

export interface IConditionsListSubComponentStyles {
    addButton?: Partial<IButtonStyles>;
}
