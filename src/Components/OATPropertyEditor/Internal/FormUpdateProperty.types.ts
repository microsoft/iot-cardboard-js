import { IDropdownOption } from '@fluentui/react';
import { IAction } from '../../../Models/Constants/Interfaces';
import { IOATPropertyEditorState } from '../OATPropertyEditor.types';

export type FormUpdatePropertyProps = {
    dispatch: React.Dispatch<React.SetStateAction<IAction>>;
    languages: IDropdownOption[];
    onClose: () => void;
    state: IOATPropertyEditorState;
};
