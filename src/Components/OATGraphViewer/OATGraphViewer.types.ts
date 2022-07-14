import { IAction } from '../../Models/Constants/Interfaces';
import { IOATEditorState } from '../../Pages/OATEditorPage/OATEditorPage.types';

export type OATGraphProps = {
    dispatch?: React.Dispatch<React.SetStateAction<IAction>>;
    state?: IOATEditorState;
};
