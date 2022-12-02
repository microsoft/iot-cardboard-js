import { IStyle, IStyleFunctionOrObject } from '@fluentui/react';
import { DTDLEnumValue } from '../../../../../../../../../../Models/Classes/DTDL';
import { IExtendedTheme } from '../../../../../../../../../../Theming/Theme.types';

export interface IPropertyListItemEnumChildProps {
    item: DTDLEnumValue;
    enumType: 'integer' | 'string';
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<
        IPropertyListItemEnumChildStyleProps,
        IPropertyListItemEnumChildStyles
    >;
}

export interface IPropertyListItemEnumChildStyleProps {
    theme: IExtendedTheme;
}
export interface IPropertyListItemEnumChildStyles {
    root: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: IPropertyListItemEnumChildSubComponentStyles;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IPropertyListItemEnumChildSubComponentStyles {}
