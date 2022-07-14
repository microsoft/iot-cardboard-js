import { IOATEditorState } from '../../../Pages/OATEditorPage/OATEditorPage.types';

export type ModalSaveCurrentProjectAndClearProps = {
    resetProject?: () => void;
    setModalBody?: React.Dispatch<React.SetStateAction<string>>;
    state?: IOATEditorState;
    onClose?: () => void;
};
