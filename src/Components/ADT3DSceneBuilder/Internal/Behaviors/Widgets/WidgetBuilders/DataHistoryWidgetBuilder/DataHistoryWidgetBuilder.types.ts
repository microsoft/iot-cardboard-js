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
    Last15Mins = 'Last 15 mins',
    Last30Mins = 'Last 30 mins',
    LastHour = 'Last hour',
    Last3Hours = 'Last 3 hours',
    Last6Hours = 'Last 6 hours',
    Last12Hours = 'Last 12 hours',
    Last24Hours = 'Last 24 hours',
    Last7Days = 'Last 7 days',
    Last30Days = 'Last 30 days',
    Last60Days = 'Last 60 days',
    Last90Days = 'Last 90 days',
    Last180Days = 'Last 180 days',
    LastYear = 'Last year'
}

/** Quick time span key to value in millisecond mapping */
export const QuickTimeSpans = {
    [QuickTimeSpanKey.Last15Mins]: 15 * 60 * 1000,
    [QuickTimeSpanKey.Last30Mins]: 30 * 60 * 1000,
    [QuickTimeSpanKey.LastHour]: 1 * 60 * 60 * 1000,
    [QuickTimeSpanKey.Last3Hours]: 3 * 60 * 60 * 1000,
    [QuickTimeSpanKey.Last6Hours]: 6 * 60 * 60 * 1000,
    [QuickTimeSpanKey.Last12Hours]: 12 * 60 * 60 * 1000,
    [QuickTimeSpanKey.Last24Hours]: 24 * 60 * 60 * 1000,
    [QuickTimeSpanKey.Last7Days]: 7 * 24 * 60 * 60 * 1000,
    [QuickTimeSpanKey.Last30Days]: 30 * 24 * 60 * 60 * 1000,
    [QuickTimeSpanKey.Last60Days]: 60 * 24 * 60 * 60 * 1000,
    [QuickTimeSpanKey.Last90Days]: 90 * 24 * 60 * 60 * 1000,
    [QuickTimeSpanKey.Last180Days]: 180 * 24 * 60 * 60 * 1000,
    [QuickTimeSpanKey.LastYear]: 365 * 24 * 60 * 60 * 1000
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
