import { DtdlInterfaceContent } from '../../Models/Constants';
import { OatPageContextAction } from '../../Models/Context/OatPageContext/OatPageContext.types';
import { IOATEditorState } from '../../Pages/OATEditorPage/OATEditorPage.types';
import { IOATPropertyEditorState } from './OATPropertyEditor.types';

export type PropertyListProps = {
    enteredPropertyRef: any;
    enteredTemplateRef: any;
    isSupportedModelType: boolean;
    propertyList?: DtdlInterfaceContent[];
    dispatch?: React.Dispatch<React.SetStateAction<OatPageContextAction>>;
    setModalBody?: React.Dispatch<React.SetStateAction<string>>;
    state?: IOATEditorState & IOATPropertyEditorState;
};
