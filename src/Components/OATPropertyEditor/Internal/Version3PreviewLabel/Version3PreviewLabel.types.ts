import { IButtonStyles, IStyle, IStyleFunctionOrObject } from '@fluentui/react';
import { IExtendedTheme } from '../../../../Theming/Theme.types';

export interface IVersion3PreviewLabelProps {
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<
        IVersion3PreviewLabelStyleProps,
        IVersion3PreviewLabelStyles
    >;
}

export interface IVersion3PreviewLabelStyleProps {
    theme: IExtendedTheme;
}
export interface IVersion3PreviewLabelStyles {
    root: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: IVersion3PreviewLabelSubComponentStyles;
}

export interface IVersion3PreviewLabelSubComponentStyles {
    badgeButton?: IButtonStyles;
}
