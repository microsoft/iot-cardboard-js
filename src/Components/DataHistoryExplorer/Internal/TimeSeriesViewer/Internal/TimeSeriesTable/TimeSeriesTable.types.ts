import {
    IProcessedStyleSet,
    ISpinnerStyles,
    IStyle,
    IStyleFunctionOrObject,
    ITheme
} from '@fluentui/react';
import {
    ADXTimeSeries,
    ADXTimeSeriesTableRow
} from '../../../../../../Models/Constants/Types';

export interface ITimeSeriesTableProps {
    quickTimeSpanInMillis: number;
    adxTimeSeries?: Array<ADXTimeSeries>;
    timeStampFormat?: TimeStampFormat;
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<
        ITimeSeriesTableStyleProps,
        ITimeSeriesTableStyles
    >;
}

export interface ITimeSeriesTableStyleProps {
    theme: ITheme;
}
export interface ITimeSeriesTableStyles {
    root: IStyle;
    listWrapper: IStyle;
    notSetCell: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: ITimeSeriesTableSubComponentStyles;
}

export interface ITimeSeriesTableSubComponentStyles {
    loadingSpinner?: Partial<ISpinnerStyles>;
    colorCellStyles?: IColorCellSubComponentStyles;
}

export enum TimeStampFormat {
    'date',
    'iso'
}

export interface TimeSeriesTableRow extends ADXTimeSeriesTableRow {
    property: string;
    seriesId: string;
}

interface ColorPillStyles {
    root: IStyle;
}

export interface IColorCellSubComponentStyles {
    pillStyles?: IStyleFunctionOrObject<
        { color: string },
        IProcessedStyleSet<ColorPillStyles>
    >;
}
