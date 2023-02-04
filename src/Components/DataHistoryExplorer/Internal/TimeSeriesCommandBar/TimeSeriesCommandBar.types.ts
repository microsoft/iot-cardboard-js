import {
    ICommandBarStyles,
    IStyle,
    IStyleFunctionOrObject,
    ITheme
} from '@fluentui/react';
import { IDataHistoryChartOptions } from '../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { TimeSeriesViewerMode } from '../TimeSeriesViewer/TimeSeriesViewer.types';

export interface ChartCommandBarProps {
    viewerMode: TimeSeriesViewerMode.Chart;
    deeplink: string;
}

export interface TableCommandBarProps {
    viewerMode: TimeSeriesViewerMode.Table;
    onDownloadClick: () => void;
}

export interface ITimeSeriesCommandBarProps {
    defaultChartOptions?: IDataHistoryChartOptions;
    onChartOptionsChange: (options: IDataHistoryChartOptions) => void;
    viewerModeProps: ChartCommandBarProps | TableCommandBarProps;
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<
        ITimeSeriesCommandBarStyleProps,
        ITimeSeriesCommandBarStyles
    >;
}

export interface ITimeSeriesCommandBarStyleProps {
    theme: ITheme;
}
export interface ITimeSeriesCommandBarStyles {
    root: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: ITimeSeriesCommandBarSubComponentStyles;
}

export interface ITimeSeriesCommandBarSubComponentStyles {
    commandBar?: Partial<ICommandBarStyles>;
}
