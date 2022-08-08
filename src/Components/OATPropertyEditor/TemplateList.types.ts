import { IAction } from '../../Models/Constants/Interfaces';
import { IOATEditorState } from '../../Pages/OATEditorPage/OATEditorPage.types';

export type TemplateListProps = {
    draggingTemplate?: boolean;
    draggingProperty?: boolean;
    enteredTemplateRef: any;
    draggedTemplateItemRef: any;
    enteredPropertyRef: any;
    dispatch?: React.Dispatch<React.SetStateAction<IAction>>;
    state?: IOATEditorState;
};
