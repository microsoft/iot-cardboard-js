import {
    IDetailsListStyles,
    IDropdownStyles,
    IProcessedStyleSet,
    ISpinnerStyles,
    IStyle,
    IStyleFunctionOrObject,
    ITheme
} from '@fluentui/react';
import { ADXTimeSeries } from '../../../../../../Models/Constants/Types';

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
    seriesDropdown?: Partial<IDropdownStyles>;
    detailsList?: Partial<IDetailsListStyles>;
    colorCellStyles?: IColorCellSubComponentStyles;
}

export enum TimeStampFormat {
    'date',
    'iso'
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
