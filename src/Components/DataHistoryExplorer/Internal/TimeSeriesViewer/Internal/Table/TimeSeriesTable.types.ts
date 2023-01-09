import {
    IDetailsListStyles,
    IDropdownStyles,
    IStyle,
    IStyleFunctionOrObject,
    ITheme
} from '@fluentui/react';
import { ADXTimeSeries } from '../../../../../../Models/Constants/Types';

export interface ITimeSeriesTableProps {
    adxTimeSeries: Array<ADXTimeSeries>;
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

    /**
     * SubComponent styles.
     */
    subComponentStyles?: ITimeSeriesTableSubComponentStyles;
}

export interface ITimeSeriesTableSubComponentStyles {
    detailsList?: Partial<IDetailsListStyles>;
    seriesDropdown?: Partial<IDropdownStyles>;
}

export enum TimeStampFormat {
    'date',
    'iso'
}
