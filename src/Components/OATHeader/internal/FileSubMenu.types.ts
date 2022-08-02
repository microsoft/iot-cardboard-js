import { IAction } from '../../../Models/Constants/Interfaces';
import { IOATEditorState } from '../../../Pages/OATEditorPage/OATEditorPage.types';

export type FileSubMenuProps = {
    dispatch?: React.Dispatch<React.SetStateAction<IAction>>;
    onFileSubMenuClose: () => void;
    state?: IOATEditorState;
    targetId?: string;
    resetProject?: () => void;
    setModalOpen?: (isOpen: boolean) => void;
    setModalBody?: (body: string) => void;
};
