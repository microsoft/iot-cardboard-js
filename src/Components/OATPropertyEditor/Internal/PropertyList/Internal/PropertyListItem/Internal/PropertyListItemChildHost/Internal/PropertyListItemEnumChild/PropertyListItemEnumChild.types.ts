import {
    ISpinButtonStyles,
    IStyle,
    IStyleFunctionOrObject,
    ITextFieldStyles
} from '@fluentui/react';
import { DTDLEnumValue } from '../../../../../../../../../../Models/Classes/DTDL';
import { IExtendedTheme } from '../../../../../../../../../../Theming/Theme.types';
import { IPropertyIconStyles } from '../../../PropertyIcon/PropertyIcon.types';
import { IPropertyListItemChildBaseProps } from '../../PropertyListItemChildHost.types';

export interface IPropertyListItemEnumChildProps
    extends Omit<
        IPropertyListItemChildBaseProps,
        'onUpdateSchema' | 'onUpdateName' | 'onDuplicate'
    > {
    enumType: 'integer' | 'string';
    /** is the first item in the list */
    isFirstItem: boolean;
    /** is the last item in list */
    isLastItem: boolean;
    item: DTDLEnumValue;
    onUpdateKey: (key: string) => void;
    onUpdateValue: (value: string | number) => void;
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
    buttonSpacer: IStyle;
    container: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: IPropertyListItemEnumChildSubComponentStyles;
}

export interface IPropertyListItemEnumChildSubComponentStyles {
    icon?: Partial<IPropertyIconStyles>;
    keyField?: Partial<ITextFieldStyles>;
    valueTextField?: Partial<ITextFieldStyles>;
    valueNumberField?: Partial<ISpinButtonStyles>;
}
