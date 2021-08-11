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
    '@type': 'Array' | 'String' | 'Map' | 'Object';
    comment?: string;
    description?: string;
    displayName?: string;
    [schemaProperty: string]: any;
}

export interface DtdlRelationship {
    $relationshipId: string;
    $relationshipName: string;
    $sourceId: string;
    $targetId: string;
    properties?: Record<string, any>;
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
