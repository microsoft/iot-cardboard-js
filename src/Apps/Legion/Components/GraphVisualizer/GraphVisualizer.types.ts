import { IStyle, IStyleFunctionOrObject } from '@fluentui/react';
import { IExtendedTheme } from '../../../../Theming/Theme.types';

export interface IGraphVisualizerProps {
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<
        IGraphVisualizerStyleProps,
        IGraphVisualizerStyles
    >;
}

export interface IGraphVisualizerStyleProps {
    theme: IExtendedTheme;
}
export interface IGraphVisualizerStyles {
    root: IStyle;
    graphContainer: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: IGraphVisualizerSubComponentStyles;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IGraphVisualizerSubComponentStyles {}
