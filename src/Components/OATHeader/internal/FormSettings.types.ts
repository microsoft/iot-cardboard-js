import { IAction } from '../../../Models/Constants/Interfaces';
import { IOATEditorState } from '../../../Pages/OATEditorPage/OATEditorPage.types';

export type FormSettingsProps = {
    dispatch?: React.Dispatch<React.SetStateAction<IAction>>;
    setModalBody?: React.Dispatch<React.SetStateAction<string>>;
    state?: IOATEditorState;
    onClose?: () => void;
};
