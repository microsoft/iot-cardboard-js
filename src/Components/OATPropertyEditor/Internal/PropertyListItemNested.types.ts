import { IAction } from '../../../Models/Constants/Interfaces';
import { DTDLProperty } from '../../../Models/Classes/DTDL';

export type PropertyListItemNestedProps = {
    collectionLength?: number;
    deleteNestedItem?: (parentIndex: number, index: number) => any;
    dispatch?: React.Dispatch<React.SetStateAction<IAction>>;
    getErrorMessage?: (value: string) => string;
    getItemClassName?: (index: number) => any;
    index?: number;
    item?: DTDLProperty;
    onMove?: (index: number, moveUp: boolean) => void;
    parentIndex?: number;
};
