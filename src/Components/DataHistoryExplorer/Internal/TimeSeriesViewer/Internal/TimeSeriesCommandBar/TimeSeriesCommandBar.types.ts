import {
    ICommandBarStyles,
    IStyle,
    IStyleFunctionOrObject,
    ITheme
} from '@fluentui/react';
import { IDataHistoryChartOptions } from '../../../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { TimeSeriesViewerMode } from '../../TimeSeriesViewer.types';

export type IChartCommandBarProps = {
    viewerMode: TimeSeriesViewerMode.Chart;
    deeplink: string;
};

export type ITableCommandBarProps = {
    viewerMode: TimeSeriesViewerMode.Table;
    onDownloadClick: () => void;
};

export type ITimeSeriesCommandBarOptions = Omit<
    IDataHistoryChartOptions,
    'extensionProperties'
>;

export type ITimeSeriesCommandBarOptionKeys = keyof ITimeSeriesCommandBarOptions;

export interface ITimeSeriesCommandBarProps {
    defaultChartOptions?: ITimeSeriesCommandBarOptions;
    onChartOptionsChange: (options: ITimeSeriesCommandBarOptions) => void;
    viewerModeProps: IChartCommandBarProps | ITableCommandBarProps;
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
