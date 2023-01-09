import {
    IPivotStyles,
    IStyle,
    IStyleFunctionOrObject,
    ITheme
} from '@fluentui/react';
import { IDataHistoryTimeSeriesTwin } from '../../../../Models/Constants/Interfaces';
import { IHighChartsWrapperStyles } from '../../../HighChartsWrapper/HighChartsWrapper.types';
import { ITimeSeriesTableStyles } from './Internal/Table/TimeSeriesTable.types';

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
    chartWrapper?: Partial<IHighChartsWrapperStyles>;
    table?: Partial<ITimeSeriesTableStyles>;
}
