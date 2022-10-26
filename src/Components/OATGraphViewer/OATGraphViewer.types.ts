import {
    IStyleFunctionOrObject,
    ITheme,
    IStyle,
    IStackStyles,
    ICalloutContentStyles
} from '@fluentui/react';
import { SimulationNodeDatum } from 'd3-force';
import { ElementNode } from './Internal/Classes/ElementNode';

export type IOatGraphNode = SimulationNodeDatum & {
    id: string;
};

export type IOatElementNode = ElementNode & {
    source: string;
    target: string;
};

export interface IOATGraphViewerProps {
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<
        IOATGraphViewerStyleProps,
        IOATGraphViewerStyles
    >;
}

export interface IOATGraphViewerStyleProps {
    theme: ITheme;
}
export interface IOATGraphViewerStyles {
    root: IStyle;
    graphMiniMapContainer: IStyle;
    graphMiniMap: IStyle;
    graphBuiltInControls: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: IOATGraphViewerSubComponentStyles;
}

export interface IOATGraphViewerSubComponentStyles {
    controlsStack?: IStackStyles;
    legendCallout?: Partial<ICalloutContentStyles>;
}
