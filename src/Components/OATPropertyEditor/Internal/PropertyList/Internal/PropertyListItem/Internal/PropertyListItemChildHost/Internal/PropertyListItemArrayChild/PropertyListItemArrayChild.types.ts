import { IStyle, IStyleFunctionOrObject } from '@fluentui/react';
import { DTDLSchema } from '../../../../../../../../../../Models/Classes/DTDL';
import { IExtendedTheme } from '../../../../../../../../../../Theming/Theme.types';

export interface IPropertyListItemArrayChildProps {
    item: DTDLSchema;
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<
        IPropertyListItemArrayChildStyleProps,
        IPropertyListItemArrayChildStyles
    >;
}

export interface IPropertyListItemArrayChildStyleProps {
    theme: IExtendedTheme;
}
export interface IPropertyListItemArrayChildStyles {
    root: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: IPropertyListItemArrayChildSubComponentStyles;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IPropertyListItemArrayChildSubComponentStyles {}
