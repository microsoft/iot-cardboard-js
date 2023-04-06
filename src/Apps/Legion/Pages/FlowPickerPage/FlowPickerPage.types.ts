import { IStyle, IStyleFunctionOrObject } from '@fluentui/react';
import { IExtendedTheme } from '../../../../Theming/Theme.types';

export interface IFlowPickerPageProps {
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<
        IFlowPickerPageStyleProps,
        IFlowPickerPageStyles
    >;
}

export interface IFlowPickerPageStyleProps {
    theme: IExtendedTheme;
}
export interface IFlowPickerPageStyles {
    root: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: IFlowPickerPageSubComponentStyles;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IFlowPickerPageSubComponentStyles {}
