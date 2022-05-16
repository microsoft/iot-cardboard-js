import {
    IButtonStyles,
    IStyle,
    IStyleFunctionOrObject,
    ITheme
} from '@fluentui/react';
import {
    ITwinToObjectMapping,
    IVisual,
    IBehavior
} from '../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { IViewerElementsPanelItem } from '../ElementsPanel/ViewerElementsPanel.types';

export interface IViewerElementsPanelRendererProps {
    initialPanelOpen: boolean;
    isLoading: boolean;
    items: IViewerElementsPanelItem[];
    onItemClick: (
        item: ITwinToObjectMapping | IVisual,
        panelItem: IViewerElementsPanelItem,
        behavior?: IBehavior
    ) => void;
    onItemHover: (
        item: ITwinToObjectMapping | IVisual,
        panelItem: IViewerElementsPanelItem,
        behavior?: IBehavior
    ) => void;
    onItemBlur: (
        item: ITwinToObjectMapping | IVisual,
        panelItem: IViewerElementsPanelItem,
        behavior?: IBehavior
    ) => void;
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<
        IViewerElementsPanelRendererStyleProps,
        IViewerElementsPanelRendererStyles
    >;
}

export interface IViewerElementsPanelRendererStyleProps {
    theme: ITheme;
}
export interface IViewerElementsPanelRendererStyles {
    root: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: IViewerElementsPanelRendererSubComponentStyles;
}

export interface IViewerElementsPanelRendererSubComponentStyles {
    button: IButtonStyles;
}
