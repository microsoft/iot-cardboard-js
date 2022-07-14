import { IAction } from '../../../Models/Constants/Interfaces';
import { IOATEditorState } from '../../../Pages/OATEditorPage/OATEditorPage.types';

export type FileSubMenuProps = {
    dispatch?: React.Dispatch<React.SetStateAction<IAction>>;
    onFileSubMenuClose: () => void;
    isActive?: boolean;
    state?: IOATEditorState;
    targetId?: string;
};
