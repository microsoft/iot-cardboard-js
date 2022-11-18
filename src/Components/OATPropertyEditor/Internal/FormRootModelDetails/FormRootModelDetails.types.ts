import {
    IDropdownOption,
    IStyle,
    IStyleFunctionOrObject
} from '@fluentui/react';
import {
    DtdlInterface,
    DtdlInterfaceContent
} from '../../../../Models/Constants/dtdlInterfaces';
import { IExtendedTheme } from '../../../../Theming/Theme.types';

export type IModalFormRootModelProps = {
    onClose?: () => void;
    languages: IDropdownOption[];
    selectedItem: DtdlInterface | DtdlInterfaceContent;
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<
        IFormRootModelDetailsStyleProps,
        IFormRootModelDetailsStyles
    >;
};

export interface IFormRootModelDetailsStyleProps {
    theme: IExtendedTheme;
}
export interface IFormRootModelDetailsStyles {
    root: IStyle;
    label: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: IFormRootModelDetailsSubComponentStyles;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IFormRootModelDetailsSubComponentStyles {}
