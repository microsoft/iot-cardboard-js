import { DTDLProperty, IAction } from '../../Models/Constants/Interfaces';
import { IOATEditorState } from '../../Pages/OATEditorPage/OATEditorPage.types';
import { IOATPropertyEditorState } from './OATPropertyEditor.types';

export type PropertyListProps = {
    enteredPropertyRef: any;
    enteredTemplateRef: any;
    isSupportedModelType: boolean;
    propertyList?: DTDLProperty[];
    dispatch?: React.Dispatch<React.SetStateAction<IAction>>;
    setModalBody?: React.Dispatch<React.SetStateAction<string>>;
    state?: IOATEditorState & IOATPropertyEditorState;
};
