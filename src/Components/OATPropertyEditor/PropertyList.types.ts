import { DTDLProperty } from '../../Models/Classes/DTDL';
import { IAction } from '../../Models/Constants';
import { IOATPropertyEditorState } from './OATPropertyEditor.types';

export type PropertyListProps = {
    dispatch: React.Dispatch<React.SetStateAction<IAction>>;
    enteredPropertyRef: any;
    enteredTemplateRef: any;
    isSupportedModelType: boolean;
    propertyList: DTDLProperty[];
    state: IOATPropertyEditorState;
};
