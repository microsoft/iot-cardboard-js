import { IStyleFunctionOrObject } from '@fluentui/react';
import {
    DtdlInterface,
    DtdlInterfaceContent
} from '../../../../Models/Constants/dtdlInterfaces';
import { IExtendedTheme } from '../../../../Theming/Theme.types';
import { ICardboardModalStyles } from '../../../CardboardModal/CardboardModal.types';
import { IFormRootModelDetailsContentStyles } from '../FormRootModelDetailsContent/FormRootModelDetailsContent.types';

export type IModalFormRootModelProps = {
    isOpen: boolean;
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
    /**
     * SubComponent styles.
     */
    subComponentStyles?: IFormRootModelDetailsSubComponentStyles;
}

export interface IFormRootModelDetailsSubComponentStyles {
    root?: ICardboardModalStyles;
    content?: IFormRootModelDetailsContentStyles;
}
