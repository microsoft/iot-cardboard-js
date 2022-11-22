import {
    DTDLArray,
    DTDLEnum,
    DTDLMap,
    DTDLObject,
    DTDLProperty,
    DTDLRelationship,
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

/** is the relationship a known DTDL relationship type */
export const isDTDLReference = (
    object: DtdlRelationship | DtdlInterface | DtdlInterfaceContent | string
): object is DtdlInterfaceContent => {
    if (!object) {
        return false;
    }
    if (typeof object === 'string') {
        return (
            object === DTDLType.Relationship ||
            object === DTDLType.Component ||
            object === OAT_EXTEND_HANDLE_NAME
        );
    }
    return (
        object['@type'] === DTDLType.Relationship ||
        object['@type'] === DTDLType.Component ||
        object['@type'] === OAT_EXTEND_HANDLE_NAME
    );
};

export const isDTDLRelationshipReference = (
    object: DtdlRelationship | DtdlInterface | DtdlInterfaceContent | string
): object is DTDLRelationship => {
    return object['@type'] === DTDLType.Relationship;
};

export const isDTDLModel = (
    object: DtdlRelationship | DtdlInterface | DtdlInterfaceContent | string
): object is DtdlInterface => {
    if (!object) {
        return false;
    }

    if (typeof object === 'string') {
        return object === OAT_INTERFACE_TYPE;
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
