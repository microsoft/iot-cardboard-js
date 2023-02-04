import {
    IPivotStyles,
    ISpinnerStyles,
    IStyle,
    IStyleFunctionOrObject,
    ITheme
} from '@fluentui/react';
import { ADXTimeSeries, IComponentError } from '../../../../Models/Constants';
import { IDataHistoryTimeSeriesTwin } from '../../../../Models/Constants/Interfaces';
import { IDataHistoryExplorerChartOptions } from '../../DataHistoryExplorer.types';
import { TimeSeriesTableRow } from './Internal/TimeSeriesTable/TimeSeriesTable.types';

export interface TimerSeriesViewerData {
    chart: Array<ADXTimeSeries>;
    table: Array<TimeSeriesTableRow>;
}
export interface ITimeSeriesViewerProps {
    timeSeriesTwins: Array<IDataHistoryTimeSeriesTwin>;
    data: TimerSeriesViewerData;
    isLoading: boolean;
    viewerMode: TimeSeriesViewerMode;
    onViewerModeChange: (viewerMode: TimeSeriesViewerMode) => void;
    chartOptions: IDataHistoryExplorerChartOptions;
    error?: IComponentError;
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<
        ITimeSeriesViewerStyleProps,
        ITimeSeriesViewerStyles
    >;
}

export interface ITimeSeriesViewerStyleProps {
    theme: ITheme;
}
export interface ITimeSeriesViewerStyles {
    root: IStyle;
    /**
     * SubComponent styles.
     */
    subComponentStyles?: ITimeSeriesViewerSubComponentStyles;
}

export interface ITimeSeriesViewerSubComponentStyles {
    pivot?: Partial<IPivotStyles>;
    loadingSpinner?: Partial<ISpinnerStyles>;
}

export enum TimeSeriesViewerMode {
    Chart = 'Chart',
    Table = 'Table'
}

export interface ITimeSeriesViewerContext {
    timeSeriesTwins: Array<IDataHistoryTimeSeriesTwin>;
}

export const ERROR_IMAGE_HEIGHT = 120;
