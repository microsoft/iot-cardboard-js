import { IStyle, IStyleFunctionOrObject, ITheme } from '@fluentui/react';
import {
    IDataHistoryChartOptions,
    IDataHistoryWidget
} from '../../../../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { IWidgetBuilderFormDataProps } from '../../../../../ADT3DSceneBuilder.types';

export const MAX_NUMBER_OF_TIME_SERIES = 3;
export const SERIES_LIST_ITEM_ID_PREFIX = 'cb-data-history-widget-series';

export interface IDataHistoryWidgetBuilderProps
    extends IWidgetBuilderFormDataProps {
    formData: IDataHistoryWidget;
    updateWidgetData: (widgetData: IDataHistoryWidget) => void;
    styles?: IStyleFunctionOrObject<
        IDataHistoryWidgetBuilderStyleProps,
        IDataHistoryWidgetBuilderStyles
    >;
}

export interface IDataHistoryWidgetBuilderStyleProps {
    theme: ITheme;
}
export interface IDataHistoryWidgetBuilderStyles {
    stackWithTooltipAndRequired: IStyle;
}

/** Existing chart options for data history widget in the 3D config schema */
export type ChartOptionKeys = keyof IDataHistoryChartOptions;
