import {
    IChoiceGroupStyles,
    IStyle,
    IStyleFunctionOrObject
} from '@fluentui/react';
import { Dispatch, SetStateAction } from 'react';
import {
    DtdlInterface,
    DtdlInterfaceContent
} from '../../../../../../Models/Constants/dtdlInterfaces';
import { IExtendedTheme } from '../../../../../../Theming/Theme.types';

export type IModalFormRootModelContentProps = {
    onUpdateItem: Dispatch<
        SetStateAction<DtdlInterface | DtdlInterfaceContent>
    >;
    selectedItem: DtdlInterface | DtdlInterfaceContent;
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<
        IPropertyDetailsEditorModalContentStyleProps,
        IPropertyDetailsEditorModalContentStyles
    >;
};

export interface IPropertyDetailsEditorModalContentStyleProps {
    theme: IExtendedTheme;
}
export interface IPropertyDetailsEditorModalContentStyles {
    root: IStyle;
    label: IStyle;
    labelWithTooltip: IStyle;
    splitInputColumn: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: IPropertyDetailsEditorModalContentSubComponentStyles;
}

export interface IPropertyDetailsEditorModalContentSubComponentStyles {
    writeableChoiceGroup?: IChoiceGroupStyles;
}
