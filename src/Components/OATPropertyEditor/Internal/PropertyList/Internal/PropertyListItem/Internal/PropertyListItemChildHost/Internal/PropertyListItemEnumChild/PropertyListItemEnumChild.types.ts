import { IStyle, IStyleFunctionOrObject } from '@fluentui/react';
import { DTDLEnumValue } from '../../../../../../../../../../Models/Classes/DTDL';
import { IExtendedTheme } from '../../../../../../../../../../Theming/Theme.types';
import { IPropertyIconStyles } from '../../../PropertyIcon/PropertyIcon.types';
import { IPropertyListItemChildBaseProps } from '../../PropertyListItemChildHost.types';

export interface IPropertyListItemEnumChildProps
    extends IPropertyListItemChildBaseProps {
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
    level: number;
}
export interface IPropertyListItemEnumChildStyles {
    root: IStyle;
    container: IStyle;
    name: IStyle;
    value: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: IPropertyListItemEnumChildSubComponentStyles;
}

export interface IPropertyListItemEnumChildSubComponentStyles {
    icon?: Partial<IPropertyIconStyles>;
}
