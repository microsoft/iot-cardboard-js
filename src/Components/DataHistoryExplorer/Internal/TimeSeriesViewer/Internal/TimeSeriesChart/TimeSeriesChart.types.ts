import { IStyle, IStyleFunctionOrObject, ITheme } from '@fluentui/react';
import { IDataHistoryChartOptions } from '../../../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { IDataHistoryErrorHandlingWrapperStyles } from '../../../../../DataHistoryErrorHandlingWrapper/DataHistoryErrorHandlingWrapper.types';

export interface ITimeSeriesChartProps {
    defaultOptions?: IDataHistoryChartOptions;
    onChartOptionsChange?: (options: IDataHistoryChartOptions) => void;
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<
        ITimeSeriesChartStyleProps,
        ITimeSeriesChartStyles
    >;
}

export interface ITimeSeriesChartStyleProps {
    theme: ITheme;
}
export interface ITimeSeriesChartStyles {
    root: IStyle;
    chartContainer: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: ITimeSeriesChartSubComponentStyles;
}

export interface ITimeSeriesChartSubComponentStyles {
    errorWrapper?: Partial<IDataHistoryErrorHandlingWrapperStyles>;
}
