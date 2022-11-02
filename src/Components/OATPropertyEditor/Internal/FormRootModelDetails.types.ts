import { IDropdownOption } from '@fluentui/react';
import { DtdlInterface, DtdlInterfaceContent } from '../../..';

export type ModalFormRootModelProps = {
    onClose?: () => void;
    languages: IDropdownOption[];
    selectedItem: DtdlInterface | DtdlInterfaceContent;
};
