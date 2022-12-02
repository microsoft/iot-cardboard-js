import {
    DTDLArray,
    DTDLComplexSchema,
    DTDLEnum,
    DTDLMap,
    DTDLObject,
    DTDLProperty,
    DTDLRelationship,
    DTDLSchema,
    DTDLSchemaType,
    DTDLType
} from '../Classes/DTDL';
import {
    DtdlComponent,
    DtdlInterface,
    DtdlInterfaceContent,
    DtdlReference,
    DtdlRelationship,
    OAT_EXTEND_HANDLE_NAME,
    OAT_INTERFACE_TYPE
} from '../Constants';

/** is the relationship a known DTDL relationship type */
export const isDTDLReference = (
    object: DtdlRelationship | DtdlInterface | DtdlInterfaceContent | string
): object is DtdlReference => {
    if (!object) {
        return false;
    }
    if (typeof object === 'string') {
        return (
            object === DTDLType.Relationship || object === DTDLType.Component
        );
    }
    return (
        object['@type'] === DTDLType.Relationship ||
        object['@type'] === DTDLType.Component
    );
};

export const isDTDLExtendReference = (
    object: DtdlRelationship | DtdlInterface | DtdlInterfaceContent | string
): object is string => {
    if (!object) {
        return false;
    }
    if (typeof object === 'string') {
        return object === OAT_EXTEND_HANDLE_NAME;
    }
    return object['@type'] === OAT_EXTEND_HANDLE_NAME;
};

export const isDTDLRelationshipReference = (
    object: DtdlRelationship | DtdlInterface | DtdlInterfaceContent | string
): object is DTDLRelationship => {
    return object['@type'] === DTDLType.Relationship;
};

export const isDTDLComponentReference = (
    object: DtdlRelationship | DtdlInterface | DtdlInterfaceContent | string
): object is DtdlComponent => {
    return object['@type'] === DTDLType.Component;
};

export const isComplexSchemaProperty = (
    property: DTDLProperty
): property is DTDLProperty & { schema: DTDLComplexSchema } => {
    return isComplexSchemaType(property.schema);
};

export const isComplexSchemaType = (schema: DTDLSchema): boolean => {
    if (typeof schema === 'object') {
        return true;
    } else {
        return false;
    }
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

export const isDTDLProperty = (
    property: DTDLProperty
): property is DTDLProperty => {
    if (typeof property['@type'] !== 'string') {
        return (property['@type'] as string[]).includes('Property');
    } else {
        return property['@type'] === 'Property';
    }
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
