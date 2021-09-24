export interface DtdlInterface {
    '@id': string;
    '@type': string;
    '@context': string | string[];
    comment?: string;
    contents?: (
        | DtdlProperty
        | DtdlRelationship
        | DtdlTelemetry
        | DtdlCommand
        | DtdlComponent
    )[];
    description?: string;
    displayName?: string;
    extends?: string | string[];
    schemas?: DtdlInterfaceSchema[];
}

export interface DtdlTelemetry {
    '@type': string;
    name: string;
    schema: string | Record<string, any>;
    '@id'?: string;
    comment?: string;
    description?: string;
    displayName?: string;
    unit?: string;
}

export interface DtdlCommand {
    '@type': string;
    name: string;
    '@id'?: string;
    description?: string;
    displayName?: string;
    commandType?: string;
    request?: DtdlCommandPayload;
    response?: DtdlCommandPayload;
}

export interface DtdlCommandPayload {
    name: string;
    schema: string | Record<string, any>;
    '@id'?: string;
    comment?: string;
    description?: string;
    displayName?: string;
}

export interface DtdlComponent {
    '@type': string;
    name: string;
    schema: string;
    '@id'?: string;
    comment?: string;
    description?: string;
    displayName?: string;
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
}
