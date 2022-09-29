import { IAction } from '../../../Models/Constants/Interfaces';
import { IOATPropertyEditorState } from '../OATPropertyEditor.types';

export type TemplateColumnProps = {
    enteredPropertyRef: any;
    enteredTemplateRef: any;
    dispatch?: React.Dispatch<React.SetStateAction<IAction>>;
    state?: IOATPropertyEditorState;
};
