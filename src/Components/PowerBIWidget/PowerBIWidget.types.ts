import { IStyle, IStyleFunctionOrObject, ITheme } from '@fluentui/react';
import { IPowerBIWidget } from '../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';

export interface IPowerBIWidgetProps {
    widget: IPowerBIWidget;
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<
        IPowerBIWidgetStyleProps,
        IPowerBIWidgetStyles
    >;
}

export interface IPowerBIWidgetStyleProps {
    theme: ITheme;
}
export interface IPowerBIWidgetStyles {
    root: IStyle;
    header?: IStyle;
    description?: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: IPowerBIWidgetSubComponentStyles;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IPowerBIWidgetSubComponentStyles {}
