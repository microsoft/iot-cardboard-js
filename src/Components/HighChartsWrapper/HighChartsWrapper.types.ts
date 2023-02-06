import { IStyle, IStyleFunctionOrObject, ITheme } from '@fluentui/react';
import { AlignValue, CSSObject, OptionsLayoutValue } from 'highcharts';
import { TimeSeriesData } from '../../Models/Constants/Types';
import { IDataHistoryAggregationType } from '../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';

export const MAX_NUMBER_OF_SERIES_IN_HIGH_CHARTS = 10;

export interface IHighChartSeriesData {
    /**
     * Name of the series which is used in legend and tooltip
     */
    name: string;
    /**
     * Data points for series to be plotted in chart
     */
    data: Array<TimeSeriesData>;
    /**
     * Color of the series line in chart plot, if not provided
     * Highchart defaults used
     */
    color?: string;
    /**
     * Suffix string to append to the end of the name and
     * value of the series to be shown in tooltip (e.g. "F" as unit)
     */
    tooltipSuffix?: string;
}

export interface IHighChartsWrapperProps {
    title?: string;
    seriesData: Array<IHighChartSeriesData>;
    isLoading?: boolean;
    chartOptions?: {
        titleAlign?: AlignValue;
        legendLayout?: OptionsLayoutValue;
        legendPadding?: number;
        hasMultipleAxes?: boolean;
        dataGrouping?: IDataHistoryAggregationType;
        xMinInMillis?: number;
        xMaxInMillis?: number;
        hasLimitedSeries?: boolean;
        maxLegendHeight?: number;
        noDataText?: string;
    };

    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<
        IHighChartsWrapperStyleProps,
        IHighChartsWrapperStyles
    >;
}

export interface IHighChartsWrapperStyleProps {
    theme: ITheme;
}
export interface IHighChartsWrapperStyles {
    root: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: IHighChartsWrapperSubComponentStyles;
}

export interface IHighChartsWrapperSubComponentStyles {
    chart?: { root: CSSObject };
    title?: { root: CSSObject };
    xAxis?: { title: CSSObject; label: CSSObject };
    yAxis?: { title: CSSObject; label: CSSObject };
    tooltip?: {
        root: CSSObject;
    };
    legend?: { root: CSSObject; hover: CSSObject; navigation: CSSObject };
    loadingText?: { root: CSSObject };
    noDataText?: { root: CSSObject };
}
