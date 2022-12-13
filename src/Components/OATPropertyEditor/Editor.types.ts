import { IAction } from '../../Models/Constants/Interfaces';
import { IOATPropertyEditorState } from './OATPropertyEditor.types';
import { Theme } from '../../Models/Constants/Enums';
import { DtdlInterface, DtdlInterfaceContent } from '../..';

export type IEditorProps = {
    editorDispatch?: React.Dispatch<React.SetStateAction<IAction>>;
    editorState?: IOATPropertyEditorState;
    selectedItem: DtdlInterface | DtdlInterfaceContent;
    selectedThemeName?: Theme;
    /** the id of the parent model (if relationship is selected, else undefined) */
    parentModelId: string | undefined;
};
