import { IStyle, IStyleFunctionOrObject, ITheme } from '@fluentui/react';
import { IPowerBIWidget } from '../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { IWidgetBuilderFormDataProps } from '../../../ADT3DSceneBuilder/ADT3DSceneBuilder.types';

export interface IPowerBIWidgetBuilderProps
    extends IWidgetBuilderFormDataProps {
    formData: IPowerBIWidget;
    updateWidgetData: (widgetData: IPowerBIWidget) => void;
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<
        IPowerBIWidgetBuilderStyleProps,
        IPowerBIWidgetBuilderStyles
    >;
}

export interface IPowerBIWidgetBuilderStyleProps {
    theme: ITheme;
}
export interface IPowerBIWidgetBuilderStyles {
    root: IStyle;
    header?: IStyle;
    description?: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: IPowerBIWidgetBuilderSubComponentStyles;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IPowerBIWidgetBuilderSubComponentStyles {}
