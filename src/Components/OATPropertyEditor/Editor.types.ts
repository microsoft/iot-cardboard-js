import { IAction } from '../../Models/Constants/Interfaces';
import { IOATPropertyEditorState } from './OATPropertyEditor.types';
import { IDropdownOption } from '@fluentui/react';
import { Theme } from '../../Models/Constants/Enums';
import { DtdlInterface, DtdlInterfaceContent } from '../..';

export type IEditorProps = {
    editorDispatch?: React.Dispatch<React.SetStateAction<IAction>>;
    editorState?: IOATPropertyEditorState;
    languages: IDropdownOption[];
    selectedItem: DtdlInterface | DtdlInterfaceContent;
    selectedThemeName?: Theme;
};
