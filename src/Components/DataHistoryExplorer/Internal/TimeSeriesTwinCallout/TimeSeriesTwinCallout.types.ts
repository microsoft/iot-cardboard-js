import {
    IButtonStyles,
    ICalloutContentStyles,
    IStyle,
    IStyleFunctionOrObject,
    ITheme,
    IToggleStyles
} from '@fluentui/react';
import { IDataHistoryTimeSeriesTwin } from '../../../../Models/Constants';

export interface ITimeSeriesTwinCalloutProps {
    timeSeriesTwin?: IDataHistoryTimeSeriesTwin;
    target: string;
    onDismiss?: () => void;
    onPrimaryActionClick: (timeSeriesTwin: IDataHistoryTimeSeriesTwin) => void;
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<
        ITimeSeriesTwinCalloutStyleProps,
        ITimeSeriesTwinCalloutStyles
    >;
}

export interface ITimeSeriesTwinCalloutStyleProps {
    theme: ITheme;
}
export interface ITimeSeriesTwinCalloutStyles {
    root: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: ITimeSeriesTwinCalloutSubComponentStyles;
}

export interface ITimeSeriesTwinCalloutSubComponentStyles {
    callout?: Partial<ICalloutContentStyles>;
    addButton?: Partial<IButtonStyles>;
    typeCastToggle?: Partial<IToggleStyles>;
}
