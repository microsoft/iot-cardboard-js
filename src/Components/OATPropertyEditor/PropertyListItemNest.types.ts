import {
    IAction,
    IOATLastPropertyFocused,
    DTDLProperty
} from '../../Models/Constants/Interfaces';
import { IOATEditorState } from '../../Pages/OATEditorPage/OATEditorPage.types';

type IPropertySelectorTriggerElementsBoundingBox = {
    top: number;
    left: number;
};

export type PropertyListItemNestProps = {
    deleteItem?: (index: number) => any;
    dispatch?: React.Dispatch<React.SetStateAction<IAction>>;
    draggingProperty?: boolean;
    getItemClassName?: (index: number) => any;
    getNestedItemClassName?: () => any;
    getErrorMessage?: (value: any, index?: any) => string;
    onPropertyDisplayNameChange?: (value: any, index?: any) => void;
    onDragEnter?: (event: any, item: any) => any;
    onDragEnterExternalItem?: (index: number) => any;
    onDragStart?: (event: any, item: any) => any;
    onMove?: (index: number, moveUp: boolean) => void;
    propertiesLength?: number;
    index?: number;
    item?: DTDLProperty;
    lastPropertyFocused?: IOATLastPropertyFocused;
    setLastPropertyFocused?: React.Dispatch<React.SetStateAction<any>>;
    state?: IOATEditorState;
    setPropertySelectorVisible?: React.Dispatch<React.SetStateAction<boolean>>;
    definePropertySelectorPosition?: (event: MouseEvent) => void;
    propertySelectorTriggerElementsBoundingBox: IPropertySelectorTriggerElementsBoundingBox;
};
