import { IOATEditorState } from '../../../Pages/OATEditorPage/OATEditorPage.types';

export type ModalDeleteProps = {
    resetProject?: () => void;
    onClose?: () => void;
    setModalBody?: React.Dispatch<React.SetStateAction<string>>;
    state?: IOATEditorState;
};
