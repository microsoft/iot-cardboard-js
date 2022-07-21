import { IAction, DTDLProperty } from '../../Models/Constants/Interfaces';
import { IOATEditorState } from '../../Pages/OATEditorPage/OATEditorPage.types';

export type PropertyListItemProps = {
    index?: number;
    deleteItem?: (index: number) => any;
    dispatch?: React.Dispatch<React.SetStateAction<IAction>>;
    draggingProperty?: boolean;
    getItemClassName?: (index: number) => any;
    getErrorMessage?: (value: string, index?: number) => string;
    onMove?: (index: number, moveUp: boolean) => void;
    propertiesLength?: number;
    onPropertyDisplayNameChange?: (value: string, index?: number) => void;
    onDragEnter?: (event: any, item: any) => any;
    onDragEnterExternalItem?: (index: number) => any;
    onDragStart?: (event: any, item: any) => any;
    item?: DTDLProperty;
    setLastPropertyFocused?: React.Dispatch<React.SetStateAction<any>>;
    state?: IOATEditorState;
};
