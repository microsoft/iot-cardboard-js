import {
    DTDLArray,
    DTDLEnum,
    DTDLMap,
    DTDLObject,
    DTDLProperty,
    DTDLSchemaType,
    DTDLType
} from '../Classes/DTDL';
import {
    DtdlInterface,
    DtdlInterfaceContent,
    DtdlRelationship,
    OAT_EXTEND_HANDLE_NAME,
    OAT_INTERFACE_TYPE
} from '../Constants';

export const isDTDLRelationship = (
    object: DtdlRelationship | DtdlInterface | DtdlInterfaceContent
): object is DtdlRelationship => {
    if (!object) {
        return false;
    }
    return (
        object['@type'] === DTDLType.Relationship ||
        object['@type'] === DTDLType.Component ||
        object['@type'] === OAT_EXTEND_HANDLE_NAME
    );
};

export const isDTDLModel = (
    object: DtdlRelationship | DtdlInterface | DtdlInterfaceContent
): object is DtdlInterface => {
    if (!object) {
        return false;
    }
    return object['@type'] === OAT_INTERFACE_TYPE;
};

export const isDTDLObject = (
    object: DTDLProperty
): object is DTDLProperty & { schema: DTDLObject } => {
    if (!object || !object.schema) {
        return false;
    }
    return object.schema['@type'] === DTDLSchemaType.Object;
};

export const isDTDLArray = (
    object: DTDLProperty
): object is DTDLProperty & { schema: DTDLArray } => {
    if (!object || !object.schema) {
        return false;
    }
    return object.schema['@type'] === DTDLSchemaType.Array;
};

export const isDTDLMap = (
    object: DTDLProperty
): object is DTDLProperty & { schema: DTDLMap } => {
    if (!object || !object.schema) {
        return false;
    }
    return object.schema['@type'] === DTDLSchemaType.Map;
};

export const isDTDLEnum = (
    object: DTDLProperty
): object is DTDLProperty & { schema: DTDLEnum } => {
    if (!object || !object.schema) {
        return false;
    }
    return object.schema['@type'] === DTDLSchemaType.Enum;
};
