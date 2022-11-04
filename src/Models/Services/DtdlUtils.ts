import {
    DTDLArray,
    DTDLEnum,
    DTDLMap,
    DTDLObject,
    DTDLProperty,
    DTDLSchemaType
} from '../Classes/DTDL';
import {
    DtdlInterface,
    DtdlInterfaceContent,
    DtdlRelationship,
    OAT_COMPONENT_HANDLE_NAME,
    OAT_EXTEND_HANDLE_NAME,
    OAT_INTERFACE_TYPE,
    OAT_RELATIONSHIP_HANDLE_NAME
} from '../Constants';

export const isDTDLRelationship = (
    object: DtdlRelationship | DtdlInterface | DtdlInterfaceContent
): object is DtdlRelationship => {
    return (
        object['@type'] === OAT_RELATIONSHIP_HANDLE_NAME ||
        object['@type'] === OAT_COMPONENT_HANDLE_NAME ||
        object['@type'] === OAT_EXTEND_HANDLE_NAME
    );
};

export const isDTDLModel = (
    object: DtdlRelationship | DtdlInterface | DtdlInterfaceContent
): object is DtdlInterface => {
    return object['@type'] === OAT_INTERFACE_TYPE;
};

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
