import i18n from '../../i18n';
import { IOATSelection } from '../../Pages/OATEditorPage/OATEditorPage.types';
import {
    DTDLArray,
    DTDLComplexSchema,
    DTDLEnum,
    DTDLEnumValue,
    DTDLGeospatialSchema,
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
    DTDLType,
    DTDL_CONTEXT_VERSION_2,
    DTDL_CONTEXT_VERSION_3,
    DTDL_CONTEXT_VERSION_PREFIX
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
    DtdlObject,
    DtdlEnumValueSchema,
    OatReferenceType,
    DtdlContext,
    DtdlVersion
} from '../Constants';
import {
    getModelById,
    getModelIndexById,
    getReferenceIndexByName
} from '../Context/OatPageContext/OatPageContextUtils';
import { parseModels } from './OatPublicUtils';
import { ensureIsArray } from './OatUtils';
import { deepCopy, isDefined, isValueInEnum } from './Utils';

// #region DTDL Version

/** returns the version number of a model (either 2 or 3) */
export const getDtdlVersion = (model: DtdlInterface): DtdlVersion => {
    if (!model) {
        return '2';
    }
    return getDtdlVersionFromContext(model['@context']);
};
/** returns the DTDL version number of a model (either 2 or 3) */
export const getDtdlVersionFromContext = (
    context: DtdlContext
): DtdlVersion => {
    if (!context) {
        return '2';
    }
    if (contextHasVersion3(context)) {
        return '3';
    } else {
        return '2';
    }
};

/** is the model DTDL version 3 */
export const modelHasVersion3Context = (model: DtdlInterface): boolean => {
    return getDtdlVersion(model) === '3';
};

/** is the model DTDL version 2 */
export const modelHasVersion2Context = (model: DtdlInterface): boolean => {
    return getDtdlVersion(model) === '2';
};

/** is the model DTDL version 3 */
export const contextHasVersion3 = (context: DtdlContext): boolean => {
    const contextInternal = ensureIsArray(context);
    return contextInternal.includes(DTDL_CONTEXT_VERSION_3);
};

/** is the model DTDL version 2 */
export const contextHasVersion2 = (context: DtdlContext): boolean => {
    const contextInternal = ensureIsArray(context);
    return contextInternal.includes(DTDL_CONTEXT_VERSION_2);
};

export function getModelOrParentContext(
    selectedItem: DtdlInterface | DtdlInterfaceContent,
    currentModelsList: DtdlInterface[],
    currentSelection: IOATSelection
): DtdlContext {
    if (isDTDLModel(selectedItem)) {
        return selectedItem['@context'];
    } else if (
        isDTDLReference(selectedItem) &&
        currentSelection &&
        currentModelsList
    ) {
        const parentId = currentSelection.modelId;
        const parentModel = getModelById(currentModelsList, parentId);
        return isDTDLModel(parentModel) && parentModel['@context'];
    }
    return '';
}

/** takes either a model or relationship and deteremines if it is considered v3 */
export function isModelOrParentDtdlVersion3(
    selectedItem: DtdlInterface | DtdlInterfaceContent,
    currentModelsList: DtdlInterface[],
    currentSelection: IOATSelection
): boolean {
    const context = getModelOrParentContext(
        selectedItem,
        currentModelsList,
        currentSelection
    );
    return contextHasVersion3(context);
}

export const isValidDtdlVersion = (version: string): boolean => {
    if (!version) {
        return false;
    }
    [DTDL_CONTEXT_VERSION_3, DTDL_CONTEXT_VERSION_2].includes(version.trim());
};

/** takes a model and version number and updates the context in-place */
export const updateDtdlVersion = (
    model: DtdlInterface,
    version: string
): DtdlInterface => {
    if (Array.isArray(model['@context'])) {
        // replace the existing value with the new version
        model['@context'] = model['@context'].filter(
            (x) => !x.startsWith(DTDL_CONTEXT_VERSION_PREFIX)
        );
        model['@context'].unshift(version);
    } else {
        // directly update the value
        model['@context'] = version;
    }
    return model;
};

// #endregion

export const hasType = (
    actualType: string | string[],
    targetType: string
): boolean => {
    return ensureIsArray(actualType).includes(targetType);
};

const hasSchemaType = (
    actualSchema: DTDLSchemaType | DTDLSchemaType[],
    targetType: DTDLSchemaType
): boolean => {
    return ensureIsArray(actualSchema).includes(targetType);
};

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
        hasType(object['@type'], DTDLType.Relationship) ||
        hasType(object['@type'], DTDLType.Component)
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
    return hasType(object['@type'], OAT_EXTEND_HANDLE_NAME);
};

export const isDTDLRelationshipReference = (
    object: DtdlRelationship | DtdlInterface | DtdlInterfaceContent | string
): object is DTDLRelationship => {
    if (!object) {
        return false;
    }
    return hasType(object['@type'], DTDLType.Relationship);
};

export const isDTDLComponentReference = (
    object: DtdlRelationship | DtdlInterface | DtdlInterfaceContent | string
): object is DtdlComponent => {
    if (!object) {
        return false;
    }
    return hasType(object['@type'], DTDLType.Component);
};

export const isComplexSchemaProperty = (
    property: DTDLProperty
): property is DTDLProperty & { schema: DTDLComplexSchema } => {
    if (!property) {
        return false;
    }
    return isComplexSchemaType(property.schema);
};

export const hasComplexSchemaType = <T extends { schema: DTDLSchema }>(
    property: T
): property is T & { schema: DTDLComplexSchema } => {
    if (!property) {
        return false;
    }
    return isComplexSchemaType(property.schema);
};

export const hasArraySchemaType = <T extends { schema: DTDLSchema }>(
    property: T
): property is T & { schema: DTDLArray } => {
    if (!property) {
        return false;
    }
    return (
        hasComplexSchemaType(property) &&
        hasSchemaType(property.schema['@type'], DTDLSchemaType.Array)
    );
};

export const hasMapSchemaType = <T extends { schema: DTDLSchema }>(
    property: T
): property is T & { schema: DTDLMap } => {
    if (!property) {
        return false;
    }
    return (
        hasComplexSchemaType(property) &&
        hasSchemaType(property.schema['@type'], DTDLSchemaType.Map)
    );
};

export const hasObjectSchemaType = <T extends { schema: DTDLSchema }>(
    property: T
): property is T & { schema: DTDLObject } => {
    if (!property) {
        return false;
    }
    return (
        hasComplexSchemaType(property) &&
        hasSchemaType(property.schema['@type'], DTDLSchemaType.Object)
    );
};

export const hasEnumSchemaType = <T extends { schema: DTDLSchema }>(
    property: T
): property is T & { schema: DTDLEnum } => {
    if (!property) {
        return false;
    }
    return (
        hasComplexSchemaType(property) &&
        hasSchemaType(property.schema['@type'], DTDLSchemaType.Enum)
    );
};

export const hasGeospatialSchemaType = <T extends { schema: DTDLSchema }>(
    property: T
): property is T & { schema: DTDLGeospatialSchema } => {
    if (!property) {
        return false;
    }
    return (
        typeof property.schema === 'string' &&
        // NOTE: must stay in sync with the `DTDLGeospatialSchema` union type
        [
            'linestring',
            'multiLinestring',
            'multiPoint',
            'multiPolygon',
            'point',
            'polygon'
        ].includes(property.schema)
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

    return hasType(object['@type'], OAT_INTERFACE_TYPE);
};

export const isDTDLObject = (
    object: DTDLProperty
): object is DTDLProperty & { schema: DTDLObject } => {
    if (!object || !object.schema) {
        return false;
    }
    return hasSchemaType(object.schema['@type'], DTDLSchemaType.Object);
};

export const isDTDLProperty = (
    property: DtdlInterfaceContent
): property is DTDLProperty => {
    return hasType(property['@type'], DTDLType.Property);
};

export const isDTDLArray = (
    object: DTDLProperty
): object is DTDLProperty & { schema: DTDLArray } => {
    if (!object || !object.schema) {
        return false;
    }
    return hasSchemaType(object.schema['@type'], DTDLSchemaType.Array);
};

export const isDTDLMap = (
    object: DTDLProperty
): object is DTDLProperty & { schema: DTDLMap } => {
    if (!object || !object.schema) {
        return false;
    }
    return hasSchemaType(object.schema['@type'], DTDLSchemaType.Map);
};

export const isDTDLEnum = (
    object: DTDLProperty
): object is DTDLProperty & { schema: DTDLEnum } => {
    if (!object || !object.schema) {
        return false;
    }
    return hasSchemaType(object.schema['@type'], DTDLSchemaType.Enum);
};

export const copyDTDLProperty = (
    property: DTDLProperty,
    contents: DtdlInterfaceContent[]
): DTDLProperty => {
    let nextName = property.name + '_' + i18n.t('Copy').toLowerCase();
    let nextNameIndex = 0;
    let nameAlreadyExists = contents.some((x) => x.name === nextName);
    while (nameAlreadyExists) {
        nextNameIndex++;
        const testName = `${nextName}_${nextNameIndex}`;
        nameAlreadyExists = contents.some((x) => x.name === testName);
        if (!nameAlreadyExists) {
            nextName = testName;
        }
    }
    const copy = deepCopy(property);
    copy['@id'] = undefined;
    copy.name = nextName;
    return copy;
};

export const updateEnumValueSchema = (
    item: { schema: DtdlEnum },
    newEnumSchema: DtdlEnumValueSchema
) => {
    // early abort if the type didn't actually change
    if (newEnumSchema === item.schema.valueSchema) {
        return item;
    }

    // create copies
    const itemCopy = deepCopy(item);
    // update the schema definition
    itemCopy.schema.valueSchema = newEnumSchema;

    // update all existing values to the new schema type
    if (itemCopy.schema.enumValues?.length > 0) {
        itemCopy.schema.enumValues.forEach((item) => {
            if (newEnumSchema === 'integer') {
                item.enumValue = Number(item.enumValue);
            } else if (newEnumSchema === 'string') {
                item.enumValue = String(item.enumValue);
            }
        });
    }

    return itemCopy;
};

// #region Field Validations
export const DTMI_VALIDATION_REGEX = /^dtmi:(?:_+[A-Za-z0-9]|[A-Za-z])(?:[A-Za-z0-9_]*[A-Za-z0-9])?(?::(?:_+[A-Za-z0-9]|[A-Za-z])(?:[A-Za-z0-9_]*[A-Za-z0-9])?)*(?:;1-9][0-9]{0,8}(?:\\.[1-9][0-9]{0,5})?)?$/;

const DEFAULT_NAME_REGEX = /^[a-zA-Z](?:[a-zA-Z0-9_]*[a-zA-Z0-9])?$/;
/** allows for _ at the end when typing is in progress, should not get committed */
const DEFAULT_NAME_REGEX_IN_PROGRESS = /^[a-zA-Z](?:[a-zA-Z0-9_]*[a-zA-Z0-9_])?$/;

/**
 * Regex for validating the model path field
 * Note: it's mostly the same as name, but allows for : as well
 */
const DEFAULT_PATH_REGEX = /^[a-zA-Z](?:[a-zA-Z0-9_:]*[a-zA-Z0-9])?$/;
const DEFAULT_PATH_REGEX_IN_PROGRESS = /^[a-zA-Z](?:[a-zA-Z0-9_:]*[a-zA-Z0-9_:])?$/;

// integers only
const INTEGER_VERSION_REGEX = /^\d+$/;
// allow numerics only, can include . (ex: 31.1, 32)
const DECIMAL_VERSION_REGEX = /^\d+(\.\d+)?$/;

const DEFAULT_MAX_NAME_LENGTH = 64;

export const isValidDtmiId = (dtmiId: string): boolean => {
    // return false if we can't get the version segment
    if (!dtmiId?.includes(';')) {
        return false;
    }
    const trimmedVersion = dtmiId.substring(0, dtmiId.lastIndexOf(';'));
    return new RegExp(DTMI_VALIDATION_REGEX).test(trimmedVersion);
};

const defaultNameValidation = (name: string, isFinal: boolean): boolean => {
    let isValid = true;
    const nameTrimmed = name?.trim();
    if (
        !isDefined(nameTrimmed) ||
        nameTrimmed.length === 0 ||
        nameTrimmed.length > DEFAULT_MAX_NAME_LENGTH
    ) {
        isValid = false;
        return isValid;
    }
    if (isFinal) {
        isValid = new RegExp(DEFAULT_NAME_REGEX).test(nameTrimmed);
    } else {
        isValid = new RegExp(DEFAULT_NAME_REGEX_IN_PROGRESS).test(nameTrimmed);
    }

    return isValid;
};
/** performs the necessary checks to determine if a given name is valid */
export const isValidModelName = (name: string, isFinal: boolean): boolean => {
    return defaultNameValidation(name, isFinal);
};
/** performs the necessary checks to determine if a given version is valid */
export const isValidModelVersion = (
    version: string,
    dtdlVersion: DtdlVersion,
    isFinal: boolean
): boolean => {
    if (dtdlVersion === '2') {
        // doesn't matter if it's final or not since it's always only numbers
        return RegExp(INTEGER_VERSION_REGEX).test(version);
    }

    if (isFinal) {
        return RegExp(DECIMAL_VERSION_REGEX).test(version);
    } else {
        if (version.endsWith('.')) {
            return RegExp(INTEGER_VERSION_REGEX).test(version.replace('.', ''));
        } else {
            return RegExp(DECIMAL_VERSION_REGEX).test(version);
        }
    }
};

/** performs the necessary checks to determine if a given name is valid */
export const isValidReferenceName = (
    name: string,
    referenceType: OatReferenceType,
    isFinal: boolean
): boolean => {
    let isValid = true;
    switch (referenceType) {
        case DTDLType.Relationship:
        case DTDLType.Component:
            isValid = defaultNameValidation(name, isFinal);
            break;
        case 'Extend':
            isValid = false;
    }

    return isValid;
};

/** performs the necessary checks to determine if a given name is valid */
export const isValidDtmiPath = (path: string, isFinal: boolean): boolean => {
    if (!isDefined(path) || !path.trim()) {
        return true;
    }
    if (isFinal) {
        return new RegExp(DEFAULT_PATH_REGEX).test(path);
    } else {
        return new RegExp(DEFAULT_PATH_REGEX_IN_PROGRESS).test(path);
    }
};

// #endregion

type IValidationArgs<T extends DtdlInterface | DtdlInterfaceContent> = {
    updatedItem: T;
    originalItem: T;
    selectedModelId: string;
    existingModels: DtdlInterface[];
};
type IValidationResult =
    | {
          isValid: true;
          updatedModel: DtdlInterface;
      }
    | {
          isValid: false;
          error: {
              title: string;
              message: string;
          };
      };
export async function validateItemChangeBeforeSaving<
    T extends DtdlInterface | DtdlInterfaceContent
>(args: {
    content: string;
    originalItem: T;
    selectedModelId: string;
    existingModels: DtdlInterface[];
}): Promise<IValidationResult> {
    const isJsonStringValid = (value: string): T | null => {
        try {
            return JSON.parse(value);
        } catch (e) {
            return null;
        }
    };
    const updatedItem = isJsonStringValid(args.content);
    if (!updatedItem) {
        return {
            isValid: false,
            error: {
                title: i18n.t('OAT.Errors.invalidJSONTitle'),
                message: i18n.t('OAT.Errors.invalidJSONMessage')
            }
        };
    }
    return validateOntology({ ...args, updatedItem: updatedItem });
}
export async function validateOntology<
    T extends DtdlInterface | DtdlInterfaceContent
>(args: IValidationArgs<T>): Promise<IValidationResult> {
    const { updatedItem, originalItem, selectedModelId, existingModels } = args;

    try {
        let updatedModel: DtdlInterface;
        const originalModelId = selectedModelId;
        if (isDTDLModel(updatedItem)) {
            // bind the updated model
            updatedModel = updatedItem;
        } else if (
            isDTDLReference(originalItem) &&
            isDTDLReference(updatedItem)
        ) {
            // get the model and update the reference on the model
            updatedModel = getModelById(existingModels, originalModelId);
            const contents = ensureIsArray(updatedModel.contents);
            const index = getReferenceIndexByName(
                updatedModel,
                originalItem.name // use the original name in case they change it in the update
            );
            contents[index] = updatedItem;
            updatedModel.contents = contents;
        }

        // validate the updated collection is valid
        const models = deepCopy(existingModels);
        const modelIndex = getModelIndexById(models, originalModelId);
        models[modelIndex] = updatedModel;
        const parsingError = await parseModels(models);

        if (parsingError) {
            return {
                isValid: false,
                error: {
                    title: i18n.t('OAT.Errors.validationFailedTitle'),
                    message: parsingError
                }
            };
        }

        return {
            isValid: true,
            updatedModel: updatedModel
        };
    } catch (error) {
        return {
            isValid: false,
            error: {
                title: i18n.t('OAT.Errors.validationFailedTitle'),
                message: i18n.t('OAT.Errors.validationFailedMessage')
            }
        };
    }
}

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
    const name = i18n.t(
        'OATPropertyEditor.SchemaDefaults.defaultPropertyName',
        {
            index: index
        }
    );
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
