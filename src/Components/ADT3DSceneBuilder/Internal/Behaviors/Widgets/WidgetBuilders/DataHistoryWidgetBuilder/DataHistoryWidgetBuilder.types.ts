import {
    IChoiceGroupOption,
    IDropdownOption,
    IStyle,
    IStyleFunctionOrObject,
    ITheme
} from '@fluentui/react';
import { TFunction } from 'i18next';
import {
    IDataHistoryAggregationType,
    IDataHistoryChartOptions,
    IDataHistoryChartYAxisType,
    IDataHistoryWidget
} from '../../../../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { IWidgetBuilderFormDataProps } from '../../../../../ADT3DSceneBuilder.types';

export const MAX_NUMBER_OF_TIME_SERIES = 3;
export const SERIES_LIST_ITEM_ID_PREFIX = 'cb-data-history-widget-series';
export const CONNECTION_STRING_SUFFIX = '.kusto.windows.net';

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

export enum QuickTimeSpanKey {
    'Last 15 mins' = 'Last 15 mins',
    'Last 30 mins' = 'Last 30 mins',
    'Last Hour' = 'Last Hour',
    'Last 3 Hours' = 'Last 3 Hours',
    'Last 6 Hours' = 'Last 6 Hours',
    'Last 12 Hours' = 'Last 12 Hours',
    'Last 24 Hours' = 'Last 24 Hours',
    'Last 7 Days' = 'Last 7 Days',
    'Last 30 Days' = 'Last 30 Days',
    'Last 60 Days' = 'Last 60 Days',
    'Last 90 Days' = 'Last 90 Days',
    'Last 180 Days' = 'Last 180 Days',
    'Last Year' = 'Last Year'
}

/** Quick time span key to value in millisecond mapping */
export const QuickTimeSpans = {
    [QuickTimeSpanKey['Last 15 mins']]: 15 * 60 * 1000,
    [QuickTimeSpanKey['Last 30 mins']]: 30 * 60 * 1000,
    [QuickTimeSpanKey['Last Hour']]: 1 * 60 * 60 * 1000,
    [QuickTimeSpanKey['Last 3 Hours']]: 3 * 60 * 60 * 1000,
    [QuickTimeSpanKey['Last 6 Hours']]: 6 * 60 * 60 * 1000,
    [QuickTimeSpanKey['Last 12 Hours']]: 12 * 60 * 60 * 1000,
    [QuickTimeSpanKey['Last 24 Hours']]: 24 * 60 * 60 * 1000,
    [QuickTimeSpanKey['Last 7 Days']]: 7 * 24 * 60 * 60 * 1000,
    [QuickTimeSpanKey['Last 30 Days']]: 30 * 24 * 60 * 60 * 1000,
    [QuickTimeSpanKey['Last 60 Days']]: 60 * 24 * 60 * 60 * 1000,
    [QuickTimeSpanKey['Last 90 Days']]: 90 * 24 * 60 * 60 * 1000,
    [QuickTimeSpanKey['Last 180 Days']]: 180 * 24 * 60 * 60 * 1000,
    [QuickTimeSpanKey['Last Year']]: 356 * 24 * 60 * 60 * 1000
};

export const getYAxisTypeOptions = (
    t: TFunction
): Array<IChoiceGroupOption> => {
    return [
        {
            key: 'shared' as IDataHistoryChartYAxisType,
            text: t(
                'widgets.dataHistory.form.chartOptions.yAxisType.sharedLabel'
            )
        },
        {
            key: 'independent' as IDataHistoryChartYAxisType,
            text: t(
                'widgets.dataHistory.form.chartOptions.yAxisType.independentLabel'
            )
        }
    ];
};

export const getQuickTimeSpanOptions = (
    t: TFunction
): Array<IDropdownOption> => {
    return Object.keys(QuickTimeSpans).map((timeSpan) => ({
        key: timeSpan,
        text: t(
            `widgets.dataHistory.form.chartOptions.quickTimeSpan.options.${timeSpan}`
        ),
        data: QuickTimeSpans[timeSpan]
    }));
};

/** No translation needed for these options */
export const AggregationTypeOptions: Array<IDropdownOption> = [
    {
        key: 'avg' as IDataHistoryAggregationType,
        text: 'avg'
    },
    {
        key: 'min' as IDataHistoryAggregationType,
        text: 'min'
    },
    {
        key: 'max' as IDataHistoryAggregationType,
        text: 'max'
    }
];
