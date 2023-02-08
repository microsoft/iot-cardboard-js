import { IButtonStyles, IStyle, IStyleFunctionOrObject } from '@fluentui/react';
import { IExtendedTheme } from '../../../../Theming/Theme.types';

export interface IPreviewLabelProps {
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<
        IPreviewLabelStyleProps,
        IPreviewLabelStyles
    >;
}

export interface IPreviewLabelStyleProps {
    theme: IExtendedTheme;
}
export interface IPreviewLabelStyles {
    root: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: IPreviewLabelSubComponentStyles;
}

export interface IPreviewLabelSubComponentStyles {
    badgeButton?: IButtonStyles;
}
