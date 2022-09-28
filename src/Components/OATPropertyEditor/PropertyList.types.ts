import { DtdlInterfaceContent, IAction } from '../../Models/Constants';
import { IOATPropertyEditorState } from './OATPropertyEditor.types';

export type PropertyListProps = {
    dispatch: React.Dispatch<React.SetStateAction<IAction>>;
    enteredPropertyRef: any;
    enteredTemplateRef: any;
    isSupportedModelType: boolean;
    propertyList: DtdlInterfaceContent[];
    setModalBody: React.Dispatch<React.SetStateAction<string>>;
    state: IOATPropertyEditorState;
};
