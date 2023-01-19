import { IStackStyles, IStyle, IStyleFunctionOrObject } from '@fluentui/react';
import {
    DtdlInterface,
    DtdlInterfaceContent
} from '../../../../Models/Constants';
import { IExtendedTheme } from '../../../../Theming/Theme.types';

export interface IEditorPropertiesTabProps {
    selectedItem: DtdlInterface | DtdlInterfaceContent;
    /** the id of the parent model (if relationship is selected, else undefined) */
    parentModelId: string | undefined;
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<
        IEditorPropertiesTabStyleProps,
        IEditorPropertiesTabStyles
    >;
}

export interface IEditorPropertiesTabStyleProps {
    theme: IExtendedTheme;
}
export interface IEditorPropertiesTabStyles {
    root: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: IEditorPropertiesTabSubComponentStyles;
}

export interface IEditorPropertiesTabSubComponentStyles {
    propertyListStack: IStackStyles;
}
