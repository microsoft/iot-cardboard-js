import { IStyle, IStyleFunctionOrObject, ITheme } from '@fluentui/react';
import { CSSObject } from 'highcharts';
import { IDataHistoryWidget } from '../../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';

export interface IDataHistoryWidgetProps {
    widget: IDataHistoryWidget;
    styles?: IStyleFunctionOrObject<
        IDataHistoryWidgetStyleProps,
        IDataHistoryWidgetStyles
    >;
}

export interface IDataHistoryWidgetStyleProps {
    theme: ITheme;
}
export interface IDataHistoryWidgetStyles {
    root: IStyle;
    /**
     * SubComponent styles.
     */
    subComponentStyles?: IDataHistoryWidgetSubComponentStyles;
}
export interface IDataHistoryWidgetSubComponentStyles {
    title: { root: CSSObject };
}
