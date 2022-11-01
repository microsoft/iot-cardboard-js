import { IAction } from '../../Models/Constants/Interfaces';
import { IOATPropertyEditorState } from './OATPropertyEditor.types';
import { IDropdownOption } from '@fluentui/react';
import { Theme } from '../../Models/Constants/Enums';

export type IEditorProps = {
    editorDispatch?: React.Dispatch<React.SetStateAction<IAction>>;
    editorState?: IOATPropertyEditorState;
    languages: IDropdownOption[];
    selectedThemeName?: Theme;
};
