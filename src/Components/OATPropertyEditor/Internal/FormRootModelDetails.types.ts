import { IDropdownOption } from '@fluentui/react';

export type ModalFormRootModelProps = {
    onClose?: () => void;
    languages: IDropdownOption[];
};
