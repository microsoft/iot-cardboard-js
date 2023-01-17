import { IStyle, IStyleFunctionOrObject, ITheme } from '@fluentui/react';
import { IDataHistoryTimeSeriesTwin } from '../../../../Models/Constants';
import { ITimeSeriesTwinCalloutStyles } from '../TimeSeriesTwinCallout/TimeSeriesTwinCallout.types';

export const MAX_NUMBER_OF_TIME_SERIES_TWINS = 3;
export const TIME_SERIES_TWIN_LIST_ITEM_ID_PREFIX =
    'cb-data-history-explorer-series';

export interface ITimeSeriesBuilderProps {
    timeSeriesTwins?: Array<IDataHistoryTimeSeriesTwin>;
    onTimeSeriesTwinListChange?: (
        timeSeriesTwinList: Array<IDataHistoryTimeSeriesTwin>
    ) => void;
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<
        ITimeSeriesBuilderStyleProps,
        ITimeSeriesBuilderStyles
    >;
}

export interface ITimeSeriesBuilderStyleProps {
    theme: ITheme;
}
export interface ITimeSeriesBuilderStyles {
    root: IStyle;
    header?: IStyle;
    description?: IStyle;
    twinPropertyList?: IStyle;
    addNewButton?: IStyle;
    /**
     * SubComponent styles.
     */
    subComponentStyles?: ITimeSeriesBuilderSubComponentStyles;
}

export interface ITimeSeriesBuilderSubComponentStyles {
    timeSeriesTwinCallout?: Partial<ITimeSeriesTwinCalloutStyles>;
}
