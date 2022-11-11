import {
    IProcessedStyleSet,
    IStyle,
    IStyleFunctionOrObject
} from '@fluentui/react';
import { IExtendedTheme } from '../../Theming/Theme.types';

export interface VisualColorings {
    color: string;
    label?: string;
}

export interface IColorPillsTooltipProps {
    /**
     * Colors to be shown in pills format
     */
    visualColorings: VisualColorings[];
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<
        IColorPillsTooltipStyleProps,
        IColorPillsTooltipStyles
    >;
}

export interface IColorPillsTooltipStyleProps {
    theme: IExtendedTheme;
}
export interface IColorPillsTooltipStyles {
    root: IStyle;
    /**
     * SubComponent styles.
     */
    subComponentStyles?: IColorPillsTooltipSubComponentStyles;
}

interface ColorPillStyles {
    root: IStyle;
}

export interface IColorPillsTooltipSubComponentStyles {
    colorPill?: IStyleFunctionOrObject<
        { color: string },
        IProcessedStyleSet<ColorPillStyles>
    >;
    label?: IStyleFunctionOrObject<
        { isUnlabeled: boolean },
        IProcessedStyleSet<ColorPillStyles>
    >;
}
