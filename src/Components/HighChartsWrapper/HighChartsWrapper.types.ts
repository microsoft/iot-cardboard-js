import { IStyle, IStyleFunctionOrObject, ITheme } from '@fluentui/react';
import { OptionsLayoutValue } from 'highcharts';
import { TimeSeriesData } from '../../Models/Constants';

export const MAX_NUMBER_OF_SERIES_IN_HIGH_CHARTS = 10;

export interface IHighChartSeriesData {
    name: string;
    data: Array<TimeSeriesData>;
    color?: string;
    tooltipSuffix?: string;
}

export interface IHighChartsWrapperProps {
    title: string;
    titleTargetLink?: string;
    seriesData: Array<IHighChartSeriesData>;
    legendLayout?: OptionsLayoutValue;
    legendPadding?: number;
    hasMultipleAxes?: boolean;
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
    container: IStyle;
    shareButton: IStyle;
    titleWithLinkContainer: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: IHighChartsWrapperSubComponentStyles;
}

export interface IHighChartsWrapperSubComponentStyles {
    chart?: { root: IStyle };
    title?: { root: IStyle };
    xAxis?: { title: IStyle; label: IStyle };
    yAxis?: { title: IStyle; label: IStyle };
    legend?: { root: IStyle };
}
