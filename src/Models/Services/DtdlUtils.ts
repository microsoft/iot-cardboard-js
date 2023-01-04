import i18n from '../../i18n';
import {
    DTDLArray,
    DTDLComplexSchema,
    DTDLEnum,
    DTDLEnumValue,
    DTDLMap,
    DTDLMapKey,
    DTDLMapValue,
    DTDLObject,
    DTDLObjectField,
    DTDLProperty,
    DTDLRelationship,
    DTDLSchema,
    DTDLSchemaType,
    DTDLSchemaTypes,
    DTDLType
} from '../Classes/DTDL';
import {
    DtdlComponent,
    DtdlInterface,
    DtdlInterfaceContent,
    DtdlReference,
    DtdlRelationship,
    OAT_EXTEND_HANDLE_NAME,
    OAT_INTERFACE_TYPE,
    DtdlEnum,
    DtdlObject
} from '../Constants';
import { isValueInEnum } from './Utils';

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

export const hasComplexSchemaType = <T extends { schema: DTDLSchema }>(
    property: T
): property is T & { schema: DTDLComplexSchema } => {
    return isComplexSchemaType(property.schema);
};

export const hasArraySchemaType = <T extends { schema: DTDLSchema }>(
    property: T
): property is T & { schema: DTDLArray } => {
    return (
        hasComplexSchemaType(property) &&
        property.schema['@type'] === DTDLSchemaType.Array
    );
};

export const hasMapSchemaType = <T extends { schema: DTDLSchema }>(
    property: T
): property is T & { schema: DTDLMap } => {
    return (
        hasComplexSchemaType(property) &&
        property.schema['@type'] === DTDLSchemaType.Map
    );
};

export const hasObjectSchemaType = <T extends { schema: DTDLSchema }>(
    property: T
): property is T & { schema: DTDLObject } => {
    return (
        hasComplexSchemaType(property) &&
        property.schema['@type'] === DTDLSchemaType.Object
    );
};

export const hasEnumSchemaType = <T extends { schema: DTDLSchema }>(
    property: T
): property is T & { schema: DTDLEnum } => {
    return (
        hasComplexSchemaType(property) &&
        property.schema['@type'] === DTDLSchemaType.Enum
    );
};

export const isComplexSchemaType = (
    schema: DTDLSchema
): schema is DTDLComplexSchema => {
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
    property: DtdlInterfaceContent
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

// #region Add child to complex schemas

interface IAddChildArgs {
    parentSchema: DTDLSchema;
}
/**
 * Adds a new default child item to the schema based on the type of schema.
 * Schema is updated by reference and also returned
 * */
export const addChildToSchema = (args: IAddChildArgs) => {
    const { parentSchema } = args;
    // children are only supported on objects
    if (!parentSchema || typeof parentSchema !== 'object') {
        return;
    }
    switch (parentSchema['@type']) {
        case DTDLSchemaType.Enum:
            addItemToEnum(parentSchema);
            break;
        case DTDLSchemaType.Object:
            addPropertyToObject(parentSchema);
            break;
    }
    return parentSchema;
};

const addItemToEnum = (schema: DtdlEnum) => {
    if (!schema.enumValues) {
        schema.enumValues = [];
    }
    const index = schema.enumValues.length + 1;
    schema.enumValues.push(getDefaultEnumValue(schema.valueSchema, index));
};

const addPropertyToObject = (schema: DtdlObject) => {
    if (!schema?.fields) {
        schema.fields = [];
    }
    const index = schema.fields.length + 1;
    schema.fields.push(getDefaultObjectField(index));
};

// #endregion

// #region Initialize schemas

export const getDefaultProperty = (
    schemaType: DTDLSchemaTypes,
    index: number
): DTDLProperty => {
    const name = i18n.t('OATPropertyEditor.defaultPropertyName', {
        index: index
    });
    return new DTDLProperty(name, getDefaultSchemaByType(schemaType));
};

export const getDefaultSchemaByType = (
    schemaType: DTDLSchemaTypes
): DTDLSchema => {
    let schema: DTDLSchema;

    if (isValueInEnum(DTDLSchemaType, schemaType)) {
        switch (schemaType) {
            case DTDLSchemaType.Array: {
                schema = getDefaultArraySchema();
                break;
            }
            case DTDLSchemaType.Enum: {
                schema = getDefaultEnumSchema();
                break;
            }
            case DTDLSchemaType.Map: {
                schema = getDefaultMapSchema();
                break;
            }
            case DTDLSchemaType.Object: {
                schema = getDefaultObjectSchema();
                break;
            }
        }
    } else {
        schema = schemaType as DTDLSchema;
    }

    return schema;
};

const getDefaultArraySchema = (): DTDLArray => {
    const object = new DTDLArray('string');

    return object;
};

const getDefaultEnumValue = (
    valueSchema: 'string' | 'integer',
    index: number
) => {
    const defaultName = i18n.t(
        'OATPropertyEditor.SchemaDefaults.defaultEnumName',
        { index: 0 }
    );
    const defaultValue = valueSchema === 'integer' ? index : String(index);

    return new DTDLEnumValue(defaultName, defaultValue);
};
const getDefaultEnumSchema = (): DTDLEnum => {
    const object = new DTDLEnum([getDefaultEnumValue('string', 0)], 'string');

    return object;
};

const getDefaultMapKey = (index: number): DTDLMapKey => {
    const name = i18n.t('OATPropertyEditor.SchemaDefaults.defaultMapKeyName', {
        index: index
    });
    return new DTDLMapKey(name);
};
const getDefaultMapValue = (index: number): DTDLMapValue => {
    const value = i18n.t(
        'OATPropertyEditor.SchemaDefaults.defaultMapValueName',
        { index: index }
    );
    return new DTDLMapValue(value, 'string');
};
const getDefaultMapSchema = (): DTDLMap => {
    const object = new DTDLMap(getDefaultMapKey(0), getDefaultMapValue(0));

    return object;
};

const getDefaultObjectField = (index: number): DTDLObjectField => {
    const fieldName = i18n.t(
        'OATPropertyEditor.SchemaDefaults.defaultObjectPropertyName',
        { index: index }
    );
    return new DTDLObjectField(fieldName, 'string');
};
const getDefaultObjectSchema = (): DTDLObject => {
    const object = new DTDLObject([getDefaultObjectField(0)]);
    return object;
};

// #endregion

// #region Modifying collection

/**
 * Moves a property up or down within the collection.
 * Modifications are made in-place. The collection is returned for testing purposes
 * It takes into account that non-property objects might be in the collection and will not be shown in the UI so it looks to position the item before or after the next valid property in the collection.
 */
export const movePropertyInCollection = (
    direction: 'Up' | 'Down',
    property: DTDLProperty,
    propertyIndex: number,
    items: DtdlInterfaceContent[]
) => {
    if (direction === 'Up') {
        if (propertyIndex === 0) {
            console.warn('Cannot move item up. Already first item in list');
            // early return if the first item in the list
            return items;
        }
        // loop through and find the index of the last property before the one being moved
        let previousPropertyIndex = -1;
        items.forEach((x, index) => {
            if (isDTDLProperty(x) && index < propertyIndex) {
                previousPropertyIndex = index;
            }
        });
        if (previousPropertyIndex === -1) {
            console.warn('Cannot move item up. No items before it.');
            // early return if there's nothing above this to move above
            return items;
        }

        // insert the item at the new position
        items.splice(previousPropertyIndex, 0, property);
        // remove the old item
        items.splice(propertyIndex + 1, 1);
        return items;
    } else {
        if (propertyIndex === items.length - 1) {
            console.warn('Cannot move item down. Already last item in list');
            // early return if the last item in the list
            return items;
        }
        // loop through and find the index of the next property after the one being moved
        let nextPropertyIndex = -1;
        items.forEach((x, index) => {
            if (
                nextPropertyIndex === -1 && // only find the first one
                isDTDLProperty(x) &&
                index > propertyIndex
            ) {
                nextPropertyIndex = index;
                return;
            }
        });
        if (nextPropertyIndex === -1) {
            console.warn('Cannot move item down. Already last item in list');
            // early return if there's nothing below this to move after
            return items;
        }
        const indexInOriginalList = nextPropertyIndex + 1;

        // insert the item at the new position
        items.splice(indexInOriginalList, 0, property);
        // remove the old item
        items.splice(propertyIndex, 1);
        return items;
    }
};

// #endregion
