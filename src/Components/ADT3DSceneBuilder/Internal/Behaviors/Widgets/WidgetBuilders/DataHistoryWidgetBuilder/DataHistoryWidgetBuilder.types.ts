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
