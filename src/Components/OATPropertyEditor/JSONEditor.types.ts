import { IAction } from '../../Models/Constants/Interfaces';
import { Theme } from '../../Models/Constants/Enums';
import { IOATEditorState } from '../../Pages/OATEditorPage/OATEditorPage.types';

export type JSONEditorProps = {
    dispatch?: React.Dispatch<React.SetStateAction<IAction>>;
    theme?: Theme;
    state?: IOATEditorState;
};
