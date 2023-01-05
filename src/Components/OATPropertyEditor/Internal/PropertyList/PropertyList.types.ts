import { IStyle, IStyleFunctionOrObject } from '@fluentui/react';
import { DTDLProperty } from '../../../../Models/Classes/DTDL';
import { DtdlInterface, DtdlReference } from '../../../../Models/Constants';
import { IExtendedTheme } from '../../../../Theming/Theme.types';

export interface IPropertyListProps {
    /** the selected item being shown in the property editor */
    selectedItem: DtdlInterface | DtdlReference;
    /** the id of the parent model (if relationship is selected, else undefined) */
    parentModelId: string | undefined;
    properties: DTDLProperty[];
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
