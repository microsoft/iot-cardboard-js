import { IDropdownOption } from '@fluentui/react';
import { IAction } from '../../Models/Constants/Interfaces';
import { IOATEditorState } from '../../Pages/OATEditorPage/OATEditorPage.types';

export type ModalFormRootModelProps = {
    dispatch?: React.Dispatch<React.SetStateAction<IAction>>;
    onClose?: () => void;
    state?: IOATEditorState;
    languages: IDropdownOption[];
};
