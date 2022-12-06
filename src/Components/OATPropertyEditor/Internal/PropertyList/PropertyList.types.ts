import { IStyle, IStyleFunctionOrObject } from '@fluentui/react';
import { DTDLProperty } from '../../../../Models/Classes/DTDL';
import { IExtendedTheme } from '../../../../Theming/Theme.types';

export interface IPropertyListProps {
    properties: DTDLProperty[];
    arePropertiesSupported: boolean;
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<
        IPropertyListStyleProps,
        IPropertyListStyles
    >;
}

export interface IPropertyListStyleProps {
    theme: IExtendedTheme;
}
export interface IPropertyListStyles {
    root: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: IPropertyListSubComponentStyles;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IPropertyListSubComponentStyles {}
