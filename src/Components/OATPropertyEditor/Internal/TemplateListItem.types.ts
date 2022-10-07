import { DTDLProperty } from '../../../Models/Classes/DTDL';

export type TemplateListItemListProps = {
    draggingTemplate?: boolean;
    item?: DTDLProperty;
    index: number;
    deleteItem?: (index: number) => void;
    getDragItemClassName?: (index: number) => string;
    onDragEnter?: (event: any, index: number) => void;
    onDragEnterExternalItem?: (index: number) => void;
    onDragStart?: (event: any, index: number) => void;
    onPropertyListAddition?: (item: DTDLProperty) => void;
    onMove?: (index: number, moveUp: boolean) => void;
    getSchemaText?: (schema: any) => string;
    templatesLength?: number;
};
