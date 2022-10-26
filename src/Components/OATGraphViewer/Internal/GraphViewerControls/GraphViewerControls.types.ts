import {
    ICalloutContentStyles,
    IStackStyles,
    IStyle,
    IStyleFunctionOrObject,
    ITheme
} from '@fluentui/react';

export interface IGraphViewerControlsProps {
    legendButtonId?: string;
    miniMapButtonId?: string;
    modelListButtonId?: string;
    onApplyAutoLayoutClick: () => void;
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<
        IGraphViewerControlsStyleProps,
        IGraphViewerControlsStyles
    >;
}

export interface IGraphViewerControlsStyleProps {
    theme: ITheme;
}
export interface IGraphViewerControlsStyles {
    root: IStyle;
    graphBuiltInControls: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: IGraphViewerControlsSubComponentStyles;
}

export interface IGraphViewerControlsSubComponentStyles {
    controlsStack?: IStackStyles;
}
