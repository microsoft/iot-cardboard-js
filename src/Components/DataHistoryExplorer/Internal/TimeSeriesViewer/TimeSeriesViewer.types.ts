import {
    IPivotStyles,
    IStyle,
    IStyleFunctionOrObject,
    ITheme
} from '@fluentui/react';
import { IDataHistoryTimeSeriesTwin } from '../../../../Models/Constants/Interfaces';

export interface ITimeSeriesViewerProps {
    timeSeriesTwinList: Array<IDataHistoryTimeSeriesTwin>;
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
    commandWrapper?: IStyle;
    command?: IStyle;
    /**
     * SubComponent styles.
     */
    subComponentStyles?: ITimeSeriesViewerSubComponentStyles;
}

export interface ITimeSeriesViewerSubComponentStyles {
    pivot?: Partial<IPivotStyles>;
}

export enum TimeSeriesViewerPivot {
    Chart = 'Chart',
    Table = 'Table'
}

export interface ITimeSeriesViewerContext {
    timeSeriesTwinList: Array<IDataHistoryTimeSeriesTwin>;
}
