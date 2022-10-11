import { IChoiceGroupOption, IDropdownOption } from '@fluentui/react';
import i18next from 'i18next';
import { QuickTimeSpans } from '../../../../../../../Models/Constants/Constants';
import {
    IDataHistoryAggregationType,
    IDataHistoryChartOptions
} from '../../../../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';

export const MAX_NUMBER_OF_TIME_SERIES = 3;
export const SERIES_LIST_ITEM_ID_PREFIX = 'cb-data-history-widget-series';

/** Existing chart options for data history widget in the 3D config schema */
export type ChartOptionKeys = keyof IDataHistoryChartOptions;

export const YAxisTypeOptions: Array<IChoiceGroupOption> = [
    {
        key: 'Shared' as IDataHistoryAggregationType,
        text: i18next.t(
            'widgets.dataHistory.form.chartOptions.yAxisType.sharedLabel'
        )
    },
    {
        key: 'Independent' as IDataHistoryAggregationType,
        text: i18next.t(
            'widgets.dataHistory.form.chartOptions.yAxisType.independentLabel'
        )
    }
];

export const QuickTimeSpanOptions: Array<IDropdownOption> = Object.keys(
    QuickTimeSpans
).map((timeSpan) => ({
    key: timeSpan,
    text: i18next.t(
        `widgets.dataHistory.form.chartOptions.quickTimeSpan.options.${timeSpan}`
    ),
    data: QuickTimeSpans[timeSpan]
}));

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
