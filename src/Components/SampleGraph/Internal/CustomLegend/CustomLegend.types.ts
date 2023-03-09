import { IStyle, IStyleFunctionOrObject } from '@fluentui/react';
import { IExtendedTheme } from '../../../../Theming/Theme.types';

export interface ICustomLegendProps {
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<
        ICustomLegendStyleProps,
        ICustomLegendStyles
    >;
}

export interface ICustomLegendStyleProps {
    theme: IExtendedTheme;
}
export interface ICustomLegendStyles {
    root: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: ICustomLegendSubComponentStyles;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ICustomLegendSubComponentStyles {}
