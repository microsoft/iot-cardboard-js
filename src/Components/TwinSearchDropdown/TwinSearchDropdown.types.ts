import {
    ICalloutContentStyles,
    IStyle,
    IStyleFunctionOrObject,
    ITheme
} from '@fluentui/react';
import { StylesConfig } from 'react-select';
import ADTAdapter from '../../Adapters/ADTAdapter';
import MockAdapter from '../../Adapters/MockAdapter';
import { ITooltipCalloutContent } from '../TooltipCallout/TooltipCallout.types';

export interface ITwinSearchDropdownProps {
    adapter: ADTAdapter | MockAdapter;
    searchPropertyName: string;
    label?: string;
    labelIconName?: string;
    labelTooltip?: ITooltipCalloutContent;
    isLabelHidden?: boolean;
    descriptionText?: string;
    placeholderText?: string;
    selectedValue?: string;
    onChange?: (selectedValue: string) => void;
    inputStyles?: StylesConfig;
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<
        ITwinSearchDropdownStyleProps,
        ITwinSearchDropdownStyles
    >;
}

export interface ITwinSearchDropdownStyleProps {
    theme: ITheme;
    menuWidth: number;
}
export interface ITwinSearchDropdownStyles {
    root: IStyle;
    description: IStyle;
    label: IStyle;
    requiredIcon: IStyle;
    /**
     * SubComponent styles.
     */
    subComponentStyles?: ITwinSearchDropdownSubComponentStyles;
}

export interface ITwinSearchDropdownSubComponentStyles {
    callout?: Partial<ICalloutContentStyles>;
}
