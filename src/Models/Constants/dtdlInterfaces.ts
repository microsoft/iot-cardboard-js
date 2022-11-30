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

export interface DtdlRelationship {
    '@type': 'Relationship';
    name: string;
    '@id'?: string;
    comment?: string;
    // supports single or multiple languages. key is lang code, value is string for that lang
    description?: string | Record<string, string>;
    // supports single or multiple languages. key is lang code, value is string for that lang
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
}
