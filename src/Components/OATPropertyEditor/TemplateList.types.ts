import { IAction } from '../../Models/Constants/Interfaces';

export type TemplateListProps = {
    draggingTemplate?: boolean;
    draggingProperty?: boolean;
    enteredTemplateRef: any;
    draggedTemplateItemRef: any;
    enteredPropertyRef: any;
    dispatch?: React.Dispatch<React.SetStateAction<IAction>>;
};
