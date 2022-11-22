import {
    IProcessedStyleSet,
    IStyle,
    IStyleFunctionOrObject,
    ITheme
} from '@fluentui/react';
import { VisualColorings } from '../../Models/Constants/VisualRuleTypes';

export type ColorPillsContainerWidth = 'compact' | 'wide';

export interface IColorPillsProps {
    /**
     * Colors to be shown in pills format
     */
    visualColorings: VisualColorings[];
    /**
     * Width of the container, compact adds small margin, wide sets to specific width
     */
    width: ColorPillsContainerWidth;
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<IColorPillsStyleProps, IColorPillsStyles>;
}

export interface IColorPillsStyleProps {
    theme: ITheme;
    width: ColorPillsContainerWidth;
}
export interface IColorPillsStyles {
    root: IStyle;
    extraValues: IStyle;
    /**
     * SubComponent styles.
     */
    subComponentStyles?: IColorPillsSubComponentStyles;
}

interface ColorPillStyles {
    root: IStyle;
}

export interface IColorPillsSubComponentStyles {
    pillStyles?: IStyleFunctionOrObject<
        { color: string },
        IProcessedStyleSet<ColorPillStyles>
    >;
}
