import {
    IChoiceGroupStyles,
    IStyle,
    IStyleFunctionOrObject
} from '@fluentui/react';
import {
    DtdlInterface,
    DtdlInterfaceContent
} from '../../../../Models/Constants/dtdlInterfaces';
import { IExtendedTheme } from '../../../../Theming/Theme.types';

export type IModalFormRootModelProps = {
    onSubmit: (data: DtdlInterface | DtdlInterfaceContent) => void;
    onClose?: () => void;
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
    labelWithTooltip: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: IFormRootModelDetailsSubComponentStyles;
}

export interface IFormRootModelDetailsSubComponentStyles {
    writeableChoiceGroup?: IChoiceGroupStyles;
}
