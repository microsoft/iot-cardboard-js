import {
    IStyle,
    IColorCellProps,
    IStyleFunctionOrObject,
    ITheme,
    ICalloutContentStyleProps
} from '@fluentui/react';

export interface IColorSelectButtonProps
    extends React.HTMLAttributes<HTMLDivElement>,
        React.RefAttributes<HTMLDivElement> {
    buttonColor: string;
    colorSwatch: IColorCellProps[];
    /** label text shown above the button */
    label?: string;
    onChangeSwatchColor: (color: string) => void;

    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<undefined, IColorSelectButtonStyles>;

    /**
     * Theme provided by High-Order Component.
     */
    theme?: ITheme;
}

export interface IColorSelectButtonStyleProps {
    theme: ITheme;
}
export interface IColorSelectButtonStyles {
    root: IStyle;
    button: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles: IColorSelectButtonSubComponentStyles;
}

interface IColorSelectButtonSubComponentStyles {
    /** Styles for the callout that hosts the ContextualMenu options. */
    callout: IStyleFunctionOrObject<ICalloutContentStyleProps, any>;
}
