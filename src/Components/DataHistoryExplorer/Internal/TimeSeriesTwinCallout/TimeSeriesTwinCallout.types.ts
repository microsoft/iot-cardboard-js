import {
    IButtonStyles,
    ICalloutContentStyles,
    IStyle,
    IStyleFunctionOrObject,
    ITheme,
    IToggleStyles
} from '@fluentui/react';
import MockAdapter from '../../../../Adapters/MockAdapter';
import {
    IADTDataHistoryAdapter,
    IDataHistoryTimeSeriesTwin
} from '../../../../Models/Constants';

export interface ITimeSeriesTwinCalloutProps {
    adapter: IADTDataHistoryAdapter | MockAdapter;
    timeSeriesTwin?: IDataHistoryTimeSeriesTwin;
    target: string;
    onDismiss?: () => void;
    onPrimaryActionClick: (timeSeriesTwin: IDataHistoryTimeSeriesTwin) => void;
    dataHistoryInstanceId?: string;
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
