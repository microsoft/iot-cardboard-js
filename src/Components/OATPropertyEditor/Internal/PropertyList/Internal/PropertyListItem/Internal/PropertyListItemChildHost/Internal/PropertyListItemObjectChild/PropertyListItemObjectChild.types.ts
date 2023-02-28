import { IStyle, IStyleFunctionOrObject } from '@fluentui/react';
import { DTDLObjectField } from '../../../../../../../../../../Models/Classes/DTDL';
import { DtdlContext } from '../../../../../../../../../../Models/Constants';
import { IExtendedTheme } from '../../../../../../../../../../Theming/Theme.types';
import { IPropertyListItemChildBaseProps } from '../../PropertyListItemChildHost.types';

export interface IPropertyListItemObjectChildProps
    extends IPropertyListItemChildBaseProps {
    item: DTDLObjectField;
    /** is the first item in the list */
    isFirstItem: boolean;
    /** is the last item in list */
    isLastItem: boolean;
    /** the DTDL context of the model or source model (if relationship) */
    parentModelContext: DtdlContext;
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
