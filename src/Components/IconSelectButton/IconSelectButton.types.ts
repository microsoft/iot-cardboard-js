import {
    IStyle,
    IColorCellProps,
    IStyleFunctionOrObject,
    ITheme,
    ICalloutContentStyleProps
} from '@fluentui/react';

export interface IIconSelectButtonProps
    extends React.HTMLAttributes<HTMLDivElement>,
        React.RefAttributes<HTMLDivElement> {
    buttonColor: string;
    iconOptions: IColorCellProps[];
    /** label text shown above the button */
    label?: string;
    onChangeIcon: (color: string) => void;

    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<undefined, IIconSelectButtonStyles>;

    /**
     * Theme provided by High-Order Component.
     */
    theme?: ITheme;
}

export interface IIconSelectButtonStyleProps {
    theme: ITheme;
}
export interface IIconSelectButtonStyles {
    root: IStyle;
    button: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles: IIconSelectButtonSubComponentStyles;
}

interface IIconSelectButtonSubComponentStyles {
    /** Styles for the callout that hosts the ContextualMenu options. */
    callout: IStyleFunctionOrObject<ICalloutContentStyleProps, any>;
}
