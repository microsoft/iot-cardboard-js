import { IAction } from '../../../Models/Constants/Interfaces';
import { IOATPropertyEditorState } from '../OATPropertyEditor.types';

export type FormUpdatePropertyProps = {
    dispatch: React.Dispatch<React.SetStateAction<IAction>>;
    onClose: () => void;
    state: IOATPropertyEditorState;
};
