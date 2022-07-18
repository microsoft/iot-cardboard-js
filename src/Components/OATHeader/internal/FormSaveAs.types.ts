import { IAction } from '../../../Models/Constants/Interfaces';
import { IOATEditorState } from '../../../Pages/OATEditorPage/OATEditorPage.types';

export type FromSaveAsProps = {
    dispatch?: React.Dispatch<React.SetStateAction<IAction>>;
    setModalBody?: React.Dispatch<React.SetStateAction<string>>;
    resetProject?: () => void;
    resetProjectOnSave?: boolean;
    state?: IOATEditorState;
    onClose?: () => void;
};
