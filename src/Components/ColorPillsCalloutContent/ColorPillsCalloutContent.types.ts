import {
    ILabelStyles,
    IProcessedStyleSet,
    IStyle,
    IStyleFunctionOrObject
} from '@fluentui/react';
import { VisualColorings } from '../../Models/Constants/VisualRuleTypes';
import { IExtendedTheme } from '../../Theming/Theme.types';

export interface IColorPillsCalloutContentProps {
    /**
     * Colors to be shown in pills format
     */
    visualColorings: VisualColorings[];
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<
        IColorPillsCalloutContentStyleProps,
        IColorPillsCalloutContentStyles
    >;
}

export interface IColorPillsCalloutContentStyleProps {
    theme: IExtendedTheme;
}
export interface IColorPillsCalloutContentStyles {
    root: IStyle;
    /**
     * SubComponent styles.
     */
    subComponentStyles?: IColorPillsCalloutContentSubComponentStyles;
}

interface ColorPillStyles {
    root: IStyle;
}

export interface IColorPillsCalloutContentSubComponentStyles {
    colorPill?: IStyleFunctionOrObject<
        { color: string },
        IProcessedStyleSet<ColorPillStyles>
    >;
    label?: IStyleFunctionOrObject<{ isUnlabeled: boolean }, ILabelStyles>;
}
