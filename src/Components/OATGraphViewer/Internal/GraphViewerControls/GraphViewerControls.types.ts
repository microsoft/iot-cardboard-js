import { IStackStyles, IStyle, IStyleFunctionOrObject } from '@fluentui/react';
import { IExtendedTheme } from '../../../../Theming/Theme.types';
import { IHeaderControlButtonStyles } from '../../../HeaderControlButton/HeaderControlButton.types';
import { IHeaderControlGroupStyles } from '../../../HeaderControlGroup/HeaderControlGroup.types';

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
    theme: IExtendedTheme;
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
    controlButton?: IHeaderControlButtonStyles;
    modelsListButtonGroup?: IHeaderControlGroupStyles;
}
