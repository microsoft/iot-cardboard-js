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
        IFormRootModelDetailsContentStyleProps,
        IFormRootModelDetailsContentStyles
    >;
};

export interface IFormRootModelDetailsContentStyleProps {
    theme: IExtendedTheme;
}
export interface IFormRootModelDetailsContentStyles {
    root: IStyle;
    label: IStyle;
    labelWithTooltip: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: IFormRootModelDetailsContentSubComponentStyles;
}

export interface IFormRootModelDetailsContentSubComponentStyles {
    writeableChoiceGroup?: IChoiceGroupStyles;
}
