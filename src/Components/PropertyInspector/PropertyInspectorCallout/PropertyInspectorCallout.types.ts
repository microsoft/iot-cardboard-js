import {
    IButtonStyles,
    ICalloutContentStyles,
    IStyle,
    IStyleFunctionOrObject,
    ITheme
} from '@fluentui/react';
import { IPropertyInspectorAdapter } from '../../../Models/Constants';

export interface IPropertyInspectorCalloutProps {
    adapter: IPropertyInspectorAdapter;
    twinId: string;
    disabled?: boolean;
    hasDataHistoryControl?:
        | boolean
        | {
              isEnabled?: boolean; // to force control if the button is enabled in UI without relying on adapter's timeSeriesConnection information
          };
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<
        IPropertyInspectorCalloutStyleProps,
        IPropertyInspectorCalloutStyles
    >;
}

export interface IPropertyInspectorCalloutStyleProps {
    theme: ITheme;
}
export interface IPropertyInspectorCalloutStyles {
    root: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: IPropertyInspectorCalloutSubComponentStyles;
}

export interface IPropertyInspectorCalloutSubComponentStyles {
    button?: IButtonStyles;
    callout?: ICalloutContentStyles;
}
