import {
    ICommandBarStyles,
    IStyle,
    IStyleFunctionOrObject,
    ITheme
} from '@fluentui/react';
import { IDataHistoryChartOptions } from '../../../../../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';

export interface IChartCommandBarProps {
    defaultOptions?: IDataHistoryChartOptions;
    onChange?: (options: IDataHistoryChartOptions) => void;
    deeplink?: string;
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<
        IChartCommandBarStyleProps,
        IChartCommandBarStyles
    >;
}

export interface IChartCommandBarStyleProps {
    theme: ITheme;
}
export interface IChartCommandBarStyles {
    root: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: IChartCommandBarSubComponentStyles;
}

export interface IChartCommandBarSubComponentStyles {
    commandBar?: Partial<ICommandBarStyles>;
}
