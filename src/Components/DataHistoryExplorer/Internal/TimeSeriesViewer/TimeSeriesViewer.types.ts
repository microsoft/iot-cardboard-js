import {
    IPivotStyles,
    IStyle,
    IStyleFunctionOrObject,
    ITheme
} from '@fluentui/react';
import { ADXAdapter, MockAdapter } from '../../../../Adapters';
import { IDataHistoryTimeSeriesTwin } from '../../../../Models/Constants/Interfaces';
import { IHighChartsWrapperStyles } from '../../../HighChartsWrapper/HighChartsWrapper.types';

export interface ITimeSeriesViewerProps {
    adapter: ADXAdapter | MockAdapter;
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
    /**
     * SubComponent styles.
     */
    subComponentStyles?: ITimeSeriesViewerSubComponentStyles;
}

export interface ITimeSeriesViewerSubComponentStyles {
    pivot?: Partial<IPivotStyles>;
    chartWrapper?: Partial<IHighChartsWrapperStyles>;
}
