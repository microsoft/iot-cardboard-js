import { IStyle, IStyleFunctionOrObject } from '@fluentui/react';
import { IDTDLPropertyType } from '../../../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { IExtendedTheme } from '../../../../../../Theming/Theme.types';

export interface IValueRangeValidation {
    minValid: boolean;
    maxValid: boolean;
    rangeValid: boolean;
}

export interface IConditionSummaryProps {
    areValuesValid: boolean;
    conditionType: IDTDLPropertyType;
    currentValues: unknown[];
    onChangeValues: (
        valueType: IDTDLPropertyType,
        newValues: (string | boolean | number)[],
        index?: number
    ) => void;
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<
        IConditionSummaryStyleProps,
        IConditionSummaryStyles
    >;
}

export interface IConditionSummaryStyleProps {
    theme: IExtendedTheme;
}
export interface IConditionSummaryStyles {
    invalidText: IStyle;
    title: IStyle;
    /**
     * SubComponent styles.
     */
    subComponentStyles?: IConditionSummarySubComponentStyles;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IConditionSummarySubComponentStyles {}
