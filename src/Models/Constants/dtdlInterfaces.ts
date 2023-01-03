export interface DtdlInterface {
    '@id': string;
    '@type': string;
    '@context': string | string[];
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

export type DtdlReference = DtdlComponent | DtdlRelationship;

export interface DtdlComponent {
    /** This must be "Component". */
    '@type': 'Component';
    /** An identifer for the Component. If no @id is provided, one will be assigned automatically. */
    '@id'?: string;
    /** A comment for model authors. */
    comment?: string;
    /** supports single or multiple languages. key is lang code, value is string for that lang */
    description?: string | Record<string, string>;
    /** supports single or multiple languages. key is lang code, value is string for that lang */
    displayName?: string | Record<string, string>;
    /** The programming name of the element. */
    name: string;
    /** The data type of the Component, which is an instance of Interface. */
    schema: DtdlInterface;
}

export interface DtdlRelationship {
    /** This must be "Relationship". */
    '@type': 'Relationship';
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

export interface DtdlInterfaceContent {
    '@type': string | string[];
    name: string;
    comment?: string;
    // supports single or multiple languages. key is lang code, value is string for that lang
    description?: string | Record<string, string>;
    // supports single or multiple languages. key is lang code, value is string for that lang
    displayName?: string | Record<string, string>;
    writable?: boolean;
    schema?: string | Record<string, any>;
    target?: string;
    [propertyName: string]: any;
}

export interface DtdlProperty {
    '@type': string | string[];
    name: string;
    schema?: string | Record<string, any>;
    '@id'?: string;
    comment?: string;
    description?: string;
    displayName?: string;
    unit?: string;
    writable?: boolean;
    index?: number;
}
