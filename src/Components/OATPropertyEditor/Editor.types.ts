import { IAction } from '../../Models/Constants/Interfaces';
import { IOATPropertyEditorState } from './OATPropertyEditor.types';
import { IOATEditorState } from '../../Pages/OATEditorPage/OATEditorPage.types';
import { IDropdownOption } from '@fluentui/react';
import { Theme } from '../../Models/Constants/Enums';

export type EditorProps = {
    dispatch?: React.Dispatch<React.SetStateAction<IAction>>;
    languages: IDropdownOption[];
    state?: IOATEditorState & IOATPropertyEditorState;
    theme?: Theme;
};
