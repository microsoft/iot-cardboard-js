import { DTDLSchema, DTDLSchemaType, DTDLType } from '../Classes/DTDL';

export type DtdlVersion = '2' | '3';
export type DtdlContext = string | string[];
export type DtdlReference = DtdlComponent | DtdlRelationship;

export type DtdlInterfaceContent =
    | DtdlComponent
    | DtdlRelationship
    | DtdlProperty
    | DtdlCommand;

export interface DtdlInterface {
    '@id': string;
    '@type': string;
    '@context': DtdlContext;
    comment?: string;
    contents?: DtdlInterfaceContent[];
    // supports single or multiple languages. key is lang code, value is string for that lang
    description?: string | Record<string, string>;
    // supports single or multiple languages. key is lang code, value is string for that lang
    displayName?: string | Record<string, string>;
    extends?: string | string[];
    schemas?: DtdlInterfaceSchema[];
}

export interface DtdlInterfaceSchema {
    '@id': string;
    '@type': 'Array' | 'Enum' | 'Map' | 'Object';
    comment?: string;
    description?: string;
    displayName?: string;
    [schemaProperty: string]: any;
}

export interface DtdlComponent {
    /** This must be "Component". */
    '@type': DTDLType.Component;
    /** The programming name of the element. */
    name: string;
    /** The data type of the Component, which is an instance of Interface. */
    schema: DtdlInterface | string;
    /** An identifer for the Component. If no @id is provided, one will be assigned automatically. */
    '@id'?: string;
    /** A comment for model authors. */
    comment?: string;
    /** supports single or multiple languages. key is lang code, value is string for that lang */
    description?: string | Record<string, string>;
    /** supports single or multiple languages. key is lang code, value is string for that lang */
    displayName?: string | Record<string, string>;
}

export interface DtdlRelationship {
    /** This must be "Relationship". */
    '@type': DTDLType.Relationship;
    /** The programming name of the element. */
    name: string;
    /** An identifer for the Component. If no @id is provided, one will be assigned automatically. */
    '@id'?: string;
    /** A comment for model authors. */
    comment?: string;
    /** supports single or multiple languages. key is lang code, value is string for that lang */
    description?: string | Record<string, string>;
    /** supports single or multiple languages. key is lang code, value is string for that lang */
    displayName?: string | Record<string, string>;
    maxMultiplicity?: number;
    minMultiplicity?: number;
    properties?: DtdlProperty[];
    target?: string;
    writable?: boolean;
}

export interface DtdlCommand {
    /** This must be "Relationship". */
    '@type': DTDLType.Command;
    /** The "programming" name of the command. The name may only contain the characters a-z, A-Z, 0-9, and underscore, and must match this regular expression ^[a-zA-Z](?:[a-zA-Z0-9_]*[a-zA-Z0-9])?$.*/
    name: string;
    /** An identifer for the Component. If no @id is provided, one will be assigned automatically. */
    '@id'?: string;
    /** A comment for model authors. */
    comment?: string;
    /** supports single or multiple languages. key is lang code, value is string for that lang */
    description?: string | Record<string, string>;
    /** supports single or multiple languages. key is lang code, value is string for that lang */
    displayName?: string | Record<string, string>;
    request?: CommandPayload;
    response?: CommandPayload;
}
export interface CommandPayload {
    name: string;
    schema: DTDLSchema;
    '@id'?: string;
    comment?: string;
    /** supports single or multiple languages. key is lang code, value is string for that lang */
    description?: string | Record<string, string>;
    /** supports single or multiple languages. key is lang code, value is string for that lang */
    displayName?: string | Record<string, string>;
}

export interface DtdlProperty {
    '@type': string | string[];
    name: string;
    schema: DTDLSchema;
    '@id'?: string;
    comment?: string;
    description?: string;
    displayName?: string;
    unit?: string;
    writable?: boolean;
    index?: number;
}

export interface DtdlArray {
    ['@type']: DTDLSchemaType.Array;
    elementSchema: DTDLSchema;
    ['@id']?: string;
    displayName?: string;
    description?: string;
    comment?: string;
}

export interface DtdlMapKey {
    /** The "programming" name of the map's value. The name may only contain the characters a-z, A-Z, 0-9, and underscore, and must match this regular expression `^[a-zA-Z](?:[a-zA-Z0-9_]*[a-zA-Z0-9])?$.` */
    name: string;
    /** The data type of the map's key */
    schema: DTDLSchema;
    /** The ID of the map key. If no @id is provided, the digital twin interface processor will assign one. */
    ['@id']?: string;
    /** A comment for model authors */
    comment?: string;
    /** A localizable description for display */
    description?: string;
    /** A localizable name for display */
    displayName?: string;
}

export interface DtdlMapValue {
    /** The "programming" name of the map's value. The name may only contain the characters a-z, A-Z, 0-9, and underscore, and must match this regular expression `^[a-zA-Z](?:[a-zA-Z0-9_]*[a-zA-Z0-9])?$.` */
    name: string;
    /** The data type of the map's values */
    schema: DTDLSchema;
    /** The ID of the map key. If no @id is provided, the digital twin interface processor will assign one. */
    ['@id']?: string;
    /** A comment for model authors */
    comment?: string;
    /** A localizable description for display */
    description?: string;
    /** A localizable name for display */
    displayName?: string;
}

export interface DtdlMap {
    ['@type']: DTDLSchemaType.Map;
    mapKey: DtdlMapKey;
    mapValue: DtdlMapValue;
    ['@id']?: string;
    displayName?: string;
    description?: string;
    comment?: string;
}

export interface DtdlObject {
    ['@type']: DTDLSchemaType.Object;
    fields: DtdlObjectField[];
    ['@id']?: string;
    displayName?: string;
    description?: string;
    comment?: string;
}

export interface DtdlObjectField {
    name: string;
    schema: DTDLSchema;
    ['@id']?: string;
    comment?: string;
    description?: string;
    displayName?: string;
}

export interface DtdlEnum {
    ['@type']: DTDLSchemaType.Enum;
    enumValues: DtdlEnumValue[];
    valueSchema: DtdlEnumValueSchema;
    ['@id']?: string;
    displayName?: string;
    description?: string;
}

export type DtdlEnumValueSchema = 'integer' | 'string';

export interface DtdlEnumValue {
    ['@id']?: string;
    name: string;
    enumValue: number | string;
    displayName?: string;
    description?: string;
    comment?: string;
}
