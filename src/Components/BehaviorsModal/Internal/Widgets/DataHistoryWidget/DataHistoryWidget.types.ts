import { IStyle, IStyleFunctionOrObject, ITheme } from '@fluentui/react';
import { CSSProperties } from 'react';
import { IDataHistoryWidget } from '../../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { IDataHistoryErrorHandlingWrapperStyles } from '../../../../DataHistoryErrorHandlingWrapper/DataHistoryErrorHandlingWrapper.types';

export interface IDataHistoryWidgetProps {
    widget: IDataHistoryWidget;
    styles?: IStyleFunctionOrObject<
        IDataHistoryWidgetStyleProps,
        IDataHistoryWidgetStyles
    >;
}

export interface IDataHistoryWidgetStyleProps {
    theme: ITheme;
}
export interface IDataHistoryWidgetStyles {
    root: IStyle;
    header: IStyle;
    title: IStyle;
    chartContainer: IStyle;
    menuButton: IStyle;
    menu: IStyle;
    menuItem: IStyle;
    /**
     * SubComponent styles.
     */
    subComponentStyles?: IDataHistoryWidgetSubComponentStyles;
}

export interface IDataHistoryWidgetSubComponentStyles {
    quickTimePicker: {
        dropdown?: IStyle;
        menuItemIcon?: CSSProperties;
    };
    errorWrapper?: Partial<IDataHistoryErrorHandlingWrapperStyles>;
}

export const ERROR_IMAGE_HEIGHT = 72;
