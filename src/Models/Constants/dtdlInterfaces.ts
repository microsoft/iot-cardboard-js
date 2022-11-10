export interface DtdlInterface {
    '@id': string;
    '@type': string;
    '@context': string | string[];
    comment?: string;
    contents?: DtdlInterfaceContent[];
    description?: string;
    displayName?: string;
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
    description?: string;
    displayName?: string;
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
    description?: string;
    displayName?: string;
    writable?: boolean;
    schema?: string | Record<string, any>;
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
