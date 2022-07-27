import { IAction, DTDLProperty } from '../../Models/Constants/Interfaces';
import { IOATEditorState } from '../../Pages/OATEditorPage/OATEditorPage.types';

export type PropertyListItemNestedProps = {
    collectionLength?: number;
    deleteNestedItem?: (parentIndex: number, index: number) => any;
    dispatch?: React.Dispatch<React.SetStateAction<IAction>>;
    getItemClassName?: (index: number) => any;
    getErrorMessage?: (value: string) => string;
    index?: number;
    item?: DTDLProperty;
    onMove?: (index: number, moveUp: boolean) => void;
    parentIndex?: number;
    state?: IOATEditorState;
};
