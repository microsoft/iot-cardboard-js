import { IStyleFunctionOrObject } from '@fluentui/react';
import {
    DtdlInterface,
    DtdlInterfaceContent
} from '../../../../Models/Constants/dtdlInterfaces';
import { IExtendedTheme } from '../../../../Theming/Theme.types';
import { ICardboardModalStyles } from '../../../CardboardModal/CardboardModal.types';
import { IPropertyDetailsEditorModalContentStyles } from './Internal/FormRootModelDetailsContent/PropertyDetailsEditorModalContent.types';

export type IModalFormRootModelProps = {
    isOpen: boolean;
    onSubmit: (data: DtdlInterface | DtdlInterfaceContent) => void;
    onClose?: () => void;
    selectedItem: DtdlInterface | DtdlInterfaceContent;
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<
        IPropertyDetailsEditorModalStyleProps,
        IPropertyDetailsEditorModalStyles
    >;
};

export interface IPropertyDetailsEditorModalStyleProps {
    theme: IExtendedTheme;
}
export interface IPropertyDetailsEditorModalStyles {
    /**
     * SubComponent styles.
     */
    subComponentStyles?: IPropertyDetailsEditorModalSubComponentStyles;
}

export interface IPropertyDetailsEditorModalSubComponentStyles {
    root?: ICardboardModalStyles;
    content?: IPropertyDetailsEditorModalContentStyles;
}
