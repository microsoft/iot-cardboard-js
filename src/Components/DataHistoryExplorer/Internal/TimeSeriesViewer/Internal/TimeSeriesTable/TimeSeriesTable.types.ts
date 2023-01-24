import {
    IDetailsListStyles,
    ISpinnerStyles,
    IStyle,
    IStyleFunctionOrObject,
    ITheme
} from '@fluentui/react';
import { ADXTimeSeriesTableRow } from '../../../../../../Models/Constants/Types';

export interface ITimeSeriesTableProps {
    quickTimeSpanInMillis: number;
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
    detailsList?: Partial<IDetailsListStyles>;
}

export enum TimeStampFormat {
    'date',
    'iso'
}

export interface TimeSeriesTableRow extends ADXTimeSeriesTableRow {
    property: string;
    seriesId: string;
}
