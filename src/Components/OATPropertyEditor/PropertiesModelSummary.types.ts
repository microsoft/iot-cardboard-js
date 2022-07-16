import { IAction } from '../../Models/Constants/Interfaces';
import { IOATEditorState } from '../../Pages/OATEditorPage/OATEditorPage.types';

export type PropertiesModelSummaryProps = {
    dispatch?: React.Dispatch<React.SetStateAction<IAction>>;
    dispatchPE?: React.Dispatch<React.SetStateAction<IAction>>;
    state?: IOATEditorState;
    isSupportedModelType?: boolean;
};
