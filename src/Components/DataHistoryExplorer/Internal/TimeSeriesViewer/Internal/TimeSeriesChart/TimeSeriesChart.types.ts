import { IStyle, IStyleFunctionOrObject, ITheme } from '@fluentui/react';
import { ADXTimeSeries } from '../../../../../../Models/Constants';
import { IDataHistoryExplorerChartOptions } from '../../../../DataHistoryExplorer.types';
export interface ITimeSeriesChartProps {
    explorerChartOptions: IDataHistoryExplorerChartOptions;
    data: Array<ADXTimeSeries>;
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<
        ITimeSeriesChartStyleProps,
        ITimeSeriesChartStyles
    >;
}

export interface ITimeSeriesChartStyleProps {
    theme: ITheme;
}
export interface ITimeSeriesChartStyles {
    root: IStyle;
    chartContainer: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: ITimeSeriesChartSubComponentStyles;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ITimeSeriesChartSubComponentStyles {}
