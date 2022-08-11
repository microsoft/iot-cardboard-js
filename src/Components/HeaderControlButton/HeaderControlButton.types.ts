import {
    IStyle,
    IStyleFunctionOrObject,
    ITheme,
    IButtonProps,
    IImageProps,
    IButtonStyles,
    IIconProps
} from '@fluentui/react';

export interface IHeaderControlButtonProps {
    className?: string;
    dataTestId?: string;
    id?: string;
    /** is the button in an active state like having a flyout open or camera control active */
    isActive: boolean;
    buttonProps?: Omit<
        IButtonProps,
        | 'className'
        | 'iconProps'
        | 'id'
        | 'onClick'
        | 'onMouseEnter'
        | 'onMouseLeave'
        | 'styles'
        | 'title'
    >;
    /** optional image to load inside the button */
    imageProps?: IImageProps;
    iconProps?: IIconProps;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    onClick: () => void;
    title?: string;

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
    root?: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: IHeaderControlButtonSubComponentStyles;
}

export interface IHeaderControlButtonSubComponentStyles {
    button?: IButtonStyles;
}
