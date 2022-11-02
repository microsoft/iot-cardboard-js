import {
    DTDLArray,
    DTDLEnum,
    DTDLMap,
    DTDLObject,
    DTDLProperty,
    DTDLSchemaType
} from '../Classes/DTDL';

export const isDTDLObject = (
    object: DTDLProperty
): object is DTDLProperty & { schema: DTDLObject } => {
    return object.schema['@type'] === DTDLSchemaType.Object;
};

export const isDTDLArray = (
    object: DTDLProperty
): object is DTDLProperty & { schema: DTDLArray } => {
    return object.schema['@type'] === DTDLSchemaType.Array;
};

export const isDTDLMap = (
    object: DTDLProperty
): object is DTDLProperty & { schema: DTDLMap } => {
    return object.schema['@type'] === DTDLSchemaType.Map;
};

export const isDTDLEnum = (
    object: DTDLProperty
): object is DTDLProperty & { schema: DTDLEnum } => {
    return object.schema['@type'] === DTDLSchemaType.Enum;
};
