import { IStyle, IStyleFunctionOrObject } from '@fluentui/react';
import { DTDLSchema } from '../../../../../../../../Models/Classes/DTDL';
import { IExtendedTheme } from '../../../../../../../../Theming/Theme.types';

export interface IPropertyIconProps {
    schema: DTDLSchema;
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
    fluentIcon: IStyle;
    customIcon: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: IPropertyIconSubComponentStyles;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IPropertyIconSubComponentStyles {}
