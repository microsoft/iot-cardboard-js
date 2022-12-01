import { IStyle, IStyleFunctionOrObject } from '@fluentui/react';
import { DTDLSchemaTypes } from '../../../../Models/Classes/DTDL';
import { IExtendedTheme } from '../../../../Theming/Theme.types';

export interface IPropertyIconProps {
    type: DTDLSchemaTypes | string;
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<
        IPropertyIconStyleProps,
        IPropertyIconStyles
    >;
}

export interface IPropertyIconStyleProps {
    theme: IExtendedTheme;
}
export interface IPropertyIconStyles {
    root: IStyle;
    icon: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: IPropertyIconSubComponentStyles;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IPropertyIconSubComponentStyles {}
