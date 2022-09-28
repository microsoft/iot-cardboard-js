import { IDropdownOption } from '@fluentui/react';
import { IOATPropertyEditorState } from './OATPropertyEditor.types';

export type ModalFormAddEnumItemProps = {
    languages: IDropdownOption[];
    onClose?: () => void;
    state?: IOATPropertyEditorState;
};
