import { IAction } from '../../../Models/Constants/Interfaces';
import { IOATEditorState } from '../../../Pages/OATEditorPage/OATEditorPage.types';

export type EnumItemProps = {
    collectionLength?: number;
    deleteNestedItem?: (parentIndex: number, index: number) => any;
    dispatch?: React.Dispatch<React.SetStateAction<IAction>>;
    index?: number;
    item?: any;
    onMove?: (index: number, moveUp: boolean) => void;
    parentIndex?: number;
    state?: IOATEditorState;
};
