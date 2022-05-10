import {
    IStyle,
    IStyleFunctionOrObject,
    ITheme,
    ICalloutContentStyles,
    IIconProps,
    IButtonProps,
    IImageProps,
    IButtonStyles
} from '@fluentui/react';

export interface IHeaderControlButtonProps {
    className?: string;
    /** is the button in an active state like having a flyout open or camera control active */
    isActive: boolean;
    buttonProps: IButtonProps & {
        onClick: () => void;
    };
    /** optional image to load inside the button */
    imageProps?: IImageProps;

    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<undefined, IHeaderControlButtonStyles>;
}

export interface IHeaderControlButtonStyleProps {
    isActive: boolean;
    theme: ITheme;
}
export interface IHeaderControlButtonStyles {
    root: IStyle;
    button: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: IHeaderControlButtonSubComponentStyles;
}

export interface IHeaderControlButtonSubComponentStyles {
    button?: IButtonStyles;
}
