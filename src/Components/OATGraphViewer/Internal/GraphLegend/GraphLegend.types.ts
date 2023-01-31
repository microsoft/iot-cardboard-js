import {
    IStackStyles,
    IStyle,
    IStyleFunctionOrObject,
    ITheme,
    IToggleStyles
} from '@fluentui/react';

export interface IGraphLegendProps {
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<IGraphLegendStyleProps, IGraphLegendStyles>;
}

export interface IGraphLegendStyleProps {
    theme: ITheme;
}
export interface IGraphLegendStyles {
    itemIcon: IStyle;
    /**
     * SubComponent styles.
     */
    subComponentStyles?: IGraphLegendSubComponentStyles;
}

export interface IGraphLegendSubComponentStyles {
    rootStack?: IStackStyles;
    /** the stack controling each item in the legend */
    itemStack?: IStackStyles;
    itemToggle?: Partial<IToggleStyles>;
}
