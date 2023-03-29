import { IStyle, IStyleFunctionOrObject } from '@fluentui/react';
import { IExtendedTheme } from '../../Theming/Theme.types';

export interface IGraphNode<T> {
    /** color of the node */
    color?: string;
    /** data bag to attach to the node */
    data: T;
    /** icon to show on the node */
    icon?: string;
    /** unique id for the node. Must be unique on the graph */
    id: string;
    /** label to show for the node */
    label: string;
}
export interface ISampleGraphProps<T> {
    nodes: IGraphNode<T>[];
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<ISampleGraphStyleProps, ISampleGraphStyles>;
}

export interface ISampleGraphStyleProps {
    theme: IExtendedTheme;
}
export interface ISampleGraphStyles {
    root: IStyle;
    graphContainer: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: ISampleGraphSubComponentStyles;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ISampleGraphSubComponentStyles {}
