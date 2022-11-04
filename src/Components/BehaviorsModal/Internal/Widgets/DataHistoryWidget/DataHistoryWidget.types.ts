import {
    IImageStyles,
    IStyle,
    IStyleFunctionOrObject,
    ITheme
} from '@fluentui/react';
import { CSSProperties } from 'react';
import { IDataHistoryWidget } from '../../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';

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
    errorContainer: {
        root: CSSProperties;
        image: Partial<IImageStyles>;
        textContainer: IStyle;
        descriptionContainer: IStyle;
    };
}

export enum DataHistoryErrors {
    General_BadRequest = 'General_BadRequest',
    BadRequest_EntityNotFound = 'BadRequest_EntityNotFound',
    Forbidden = 'Forbidden'
}
