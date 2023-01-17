import { IStyle, IStyleFunctionOrObject, ITheme } from '@fluentui/react';
import { IDataHistoryTimeSeriesTwin } from '../../../../../../Models/Constants/Interfaces';

export interface ITimeSeriesChartProps {
    timeSeriesTwinList: Array<IDataHistoryTimeSeriesTwin>;
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
