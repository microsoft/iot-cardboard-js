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
    legend?: { root: CSSObject; hover: CSSObject };
    loadingText?: { root: CSSObject };
    noDataText?: { root: CSSObject };
}

export const HighChartsMockData: Array<IHighChartSeriesData> = [
    {
        name: 'Mock series-1',
        data: [
            { timestamp: 1340323200000, value: 115 },
            { timestamp: 1340339499317, value: 23 },
            { timestamp: 1340368246728, value: 188 },
            { timestamp: 1340390085747, value: 213 },
            { timestamp: 1340403271088, value: 245 }
        ],
        tooltipSuffix: '°F'
    },
    {
        name: 'Mock series-2',
        data: [
            { timestamp: 1340329513434, value: 272 },
            { timestamp: 1340339253976, value: 169 },
            { timestamp: 1340341675699, value: 238 },
            { timestamp: 1340385501865, value: 395 },
            { timestamp: 1340390604011, value: 109 }
        ],
        tooltipSuffix: 'cpf'
    },
    {
        name: 'Mock series-3',
        data: [
            { timestamp: 1340323200000, value: 279 },
            { timestamp: 1340332010046, value: 154 },
            { timestamp: 1340356361575, value: 157 },
            { timestamp: 1340395911660, value: 227 },
            { timestamp: 1340401653986, value: 107 }
        ],
        tooltipSuffix: 'm'
    }
];
