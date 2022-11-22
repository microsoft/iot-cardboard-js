import {
    ICalloutContentStyles,
    IStyle,
    IStyleFunctionOrObject,
    ITextStyles,
    ITheme
} from '@fluentui/react';
import { StylesConfig } from 'react-select';
import ADTAdapter from '../../Adapters/ADTAdapter';
import MockAdapter from '../../Adapters/MockAdapter';
import { ITooltipCalloutContent } from '../TooltipCallout/TooltipCallout.types';

export type PropertyValueHandle = {
    setValue: (newValue: string) => void;
};

export interface IReactSelectOption {
    value: string;
    label: string;
}

export interface ITwinPropertySearchDropdownProps {
    adapter: ADTAdapter | MockAdapter;
    descriptionText?: string;
    initialSelectedValue?: string;
    inputStyles?: StylesConfig;
    isLabelHidden?: boolean;
    label?: string;
    labelIconName?: string;
    labelTooltip?: ITooltipCalloutContent;
    onChange?: (selectedValue: string) => void;
    /** text to show when no value is entered. `Defaults` to twin id message */
    placeholderText?: string;
    /** text to show when no options are found from source. `Defaults` to twin id message */
    noOptionsText?: string;
    /** when focus is lost on the control, if the user did not select a value, reset the value back to the previously selected option instead of keeping the search text */
    resetInputOnBlur?: boolean;
    searchPropertyName: string;
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<
        ITwinPropertySearchDropdownStyleProps,
        ITwinPropertySearchDropdownStyles
    >;
}

export interface ITwinPropertySearchDropdownStyleProps {
    theme: ITheme;
    menuWidth: number;
}
export interface ITwinPropertySearchDropdownStyles {
    root: IStyle;
    dropdown: IStyle;
    label: IStyle;
    requiredIcon: IStyle;
    optionContainer: IStyle;
    /**
     * SubComponent styles.
     */
    subComponentStyles?: ITwinPropertySearchDropdownSubComponentStyles;
}

export interface ITwinPropertySearchDropdownSubComponentStyles {
    callout?: Partial<ICalloutContentStyles>;
    description?: Partial<ITextStyles>;
}
