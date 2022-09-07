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

export interface ITwinPropertySearchDropdownProps {
    adapter: ADTAdapter | MockAdapter;
    searchPropertyName: string;
    label?: string;
    labelIconName?: string;
    labelTooltip?: ITooltipCalloutContent;
    isLabelHidden?: boolean;
    descriptionText?: string;
    placeholderText?: string;
    initialSelectedValue?: string;
    onChange?: (selectedValue: string) => void;
    inputStyles?: StylesConfig;
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
    label: IStyle;
    requiredIcon: IStyle;
    /**
     * SubComponent styles.
     */
    subComponentStyles?: ITwinPropertySearchDropdownSubComponentStyles;
}

export interface ITwinPropertySearchDropdownSubComponentStyles {
    callout?: Partial<ICalloutContentStyles>;
    description?: Partial<ITextStyles>;
}
