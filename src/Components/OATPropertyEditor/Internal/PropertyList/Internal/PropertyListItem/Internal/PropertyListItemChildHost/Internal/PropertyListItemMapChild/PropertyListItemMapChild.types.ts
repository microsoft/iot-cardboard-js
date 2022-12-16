import { IStyle, IStyleFunctionOrObject } from '@fluentui/react';
import { DTDLMap } from '../../../../../../../../../../Models/Classes/DTDL';
import { IExtendedTheme } from '../../../../../../../../../../Theming/Theme.types';
import { IPropertyListItemChildBaseProps } from '../../PropertyListItemChildHost.types';

export interface IPropertyListItemMapChildProps
    extends Omit<
        IPropertyListItemChildBaseProps,
        | 'onUpdateSchema'
        | 'onDuplicate'
        | 'onReorderItem'
        | 'onUpdateName'
        | 'onRemove'
    > {
    item: DTDLMap;
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<
        IPropertyListItemMapChildStyleProps,
        IPropertyListItemMapChildStyles
    >;
}

export interface IPropertyListItemMapChildStyleProps {
    theme: IExtendedTheme;
}
export interface IPropertyListItemMapChildStyles {
    root: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: IPropertyListItemMapChildSubComponentStyles;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IPropertyListItemMapChildSubComponentStyles {}
