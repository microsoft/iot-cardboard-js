import { DTDLProperty } from '../../../Models/Classes/DTDL';
import { IAction } from '../../../Models/Constants';
import { IOATLastPropertyFocused } from '../../../Models/Constants/Interfaces';

type IPropertySelectorTriggerElementsBoundingBox = {
    top: number;
    left: number;
};

export type PropertyListItemNestProps = {
    definePropertySelectorPosition?: (event: MouseEvent) => void;
    deleteItem?: (index: number) => any;
    dispatch: React.Dispatch<React.SetStateAction<IAction>>;
    draggingProperty?: boolean;
    getErrorMessage?: (value: any, index?: any) => string;
    getItemClassName?: (index: number) => any;
    getNestedItemClassName?: () => any;
    index: number;
    item: DTDLProperty;
    lastPropertyFocused?: IOATLastPropertyFocused;
    onDragEnter?: (event: React.DragEvent<HTMLDivElement>, item: any) => any;
    onDragEnterExternalItem?: (index: number) => any;
    onDragStart?: (event: React.DragEvent<HTMLDivElement>, item: any) => any;
    onMove?: (index: number, moveUp: boolean) => void;
    onPropertyDisplayNameChange?: (value: any, index?: any) => void;
    propertiesLength: number;
    propertySelectorTriggerElementsBoundingBox: IPropertySelectorTriggerElementsBoundingBox;
    setLastPropertyFocused?: React.Dispatch<React.SetStateAction<any>>;
    setPropertySelectorVisible?: React.Dispatch<React.SetStateAction<boolean>>;
};
