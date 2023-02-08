import { IStyle, IStyleFunctionOrObject, ITheme } from '@fluentui/react';
import { ADXTimeSeries } from '../../../../../../Models/Constants';
import { IllustrationMessageStyles } from '../../../../../IllustrationMessage/IllustrationMessage.types';
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

export interface ITimeSeriesChartSubComponentStyles {
    illustrationMessage?: Partial<IllustrationMessageStyles>;
}
