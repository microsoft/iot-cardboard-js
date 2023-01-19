import {
    ICommandBarStyles,
    IStyle,
    IStyleFunctionOrObject,
    ITheme
} from '@fluentui/react';
import { ADXTimeSeriesTableRow } from '../../../../../../../../Models/Constants/Types';

export interface ITableCommandBarProps {
    data: Array<ADXTimeSeriesTableRow>;
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<
        ITableCommandBarStyleProps,
        ITableCommandBarStyles
    >;
}

export interface ITableCommandBarStyleProps {
    theme: ITheme;
}
export interface ITableCommandBarStyles {
    root: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: ITableCommandBarSubComponentStyles;
}

export interface ITableCommandBarSubComponentStyles {
    commandBar?: Partial<ICommandBarStyles>;
}
