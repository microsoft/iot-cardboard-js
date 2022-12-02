import { IStyle, IStyleFunctionOrObject } from '@fluentui/react';
import { DTDLObjectField } from '../../../../../../../../../../Models/Classes/DTDL';
import { IExtendedTheme } from '../../../../../../../../../../Theming/Theme.types';

export interface IPropertyListItemObjectChildProps {
    /** key used for test automation for the row */
    indexKey: string;
    item: DTDLObjectField;
    /** Level in the nesting tree. index of 1 is not nested */
    level: number;
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<
        IPropertyListItemObjectChildStyleProps,
        IPropertyListItemObjectChildStyles
    >;
}

export interface IPropertyListItemObjectChildStyleProps {
    theme: IExtendedTheme;
}
export interface IPropertyListItemObjectChildStyles {
    root: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: IPropertyListItemObjectChildSubComponentStyles;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IPropertyListItemObjectChildSubComponentStyles {}
