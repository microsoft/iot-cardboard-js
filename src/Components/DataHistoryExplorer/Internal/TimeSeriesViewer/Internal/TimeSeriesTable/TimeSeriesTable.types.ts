import {
    IDetailsListStyles,
    IProcessedStyleSet,
    IStyle,
    IStyleFunctionOrObject,
    ITheme
} from '@fluentui/react';
import { ADXTimeSeriesTableRow } from '../../../../../../Models/Constants/Types';
import { IllustrationMessageStyles } from '../../../../../IllustrationMessage/IllustrationMessage.types';

export interface ITimeSeriesTableProps {
    data: Array<TimeSeriesTableRow>;
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

interface SeriesColumnStyles {
    root: IStyle;
}

export interface ITimeSeriesTableSubComponentStyles {
    illustrationMessage?: Partial<IllustrationMessageStyles>;
    detailsList?: Partial<IDetailsListStyles>;
    seriesColumn?: IStyleFunctionOrObject<
        { color: string },
        IProcessedStyleSet<SeriesColumnStyles>
    >;
}

export enum TimeStampFormat {
    'date',
    'iso'
}

export interface TimeSeriesTableRow extends ADXTimeSeriesTableRow {
    property: string;
    seriesId: string;
}
