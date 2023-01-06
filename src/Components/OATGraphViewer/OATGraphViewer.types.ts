import {
    IStyleFunctionOrObject,
    IStyle,
    ICalloutContentStyles
} from '@fluentui/react';
import { SimulationNodeDatum } from 'd3-force';
import { OatReferenceType } from '../../Models/Constants';
import { IExtendedTheme } from '../../Theming/Theme.types';
import { ElementNode } from './Internal/Classes/ElementNode';

export interface IOATNodeData {
    '@id': string;
    '@type': OatReferenceType | 'Untargeted';
    name: string;
}
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
    theme: IExtendedTheme;
}
export interface IOATGraphViewerStyles {
    root: IStyle;
    graph: IStyle;
    graphMiniMapContainer: IStyle;
    graphMiniMap: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: IOATGraphViewerSubComponentStyles;
}

export interface IOATGraphViewerSubComponentStyles {
    legendCallout?: Partial<ICalloutContentStyles>;
    modelsListCallout?: Partial<ICalloutContentStyles>;
}
