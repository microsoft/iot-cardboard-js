import { IDropdownOption } from '@fluentui/react';
import { IAction } from '../../Models/Constants/Interfaces';
import { IOATEditorState } from '../../Pages/OATEditorPage/OATEditorPage.types';
import { IOATPropertyEditorState } from './OATPropertyEditor.types';

export type ModalFormAddEnumItemProps = {
    dispatch?: React.Dispatch<React.SetStateAction<IAction>>;
    languages: IDropdownOption[];
    onClose?: () => void;
    state?: IOATEditorState;
    statePE?: IOATPropertyEditorState;
};
