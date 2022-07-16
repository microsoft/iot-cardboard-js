import { IAction } from '../../Models/Constants/Interfaces';
import { IOATEditorState } from '../../Pages/OATEditorPage/OATEditorPage.types';
import { IOATPropertyEditorState } from './OATPropertyEditor.types';

export type TemplateColumnProps = {
    enteredPropertyRef: any;
    enteredTemplateRef: any;
    dispatch?: React.Dispatch<React.SetStateAction<IAction>>;
    state?: IOATEditorState;
    dispatchPE?: React.Dispatch<React.SetStateAction<IAction>>;
    statePE?: IOATPropertyEditorState;
};
