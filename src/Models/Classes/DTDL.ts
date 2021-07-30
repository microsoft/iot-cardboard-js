export const CURRENT_CONTEXT_VERSION = 'dtmi:dtdl:context;2';

export enum DTDLType {
    Interface = 'Interface',
    Telemetry = 'Telemetry',
    Property = 'Property',
    Command = 'Command',
    Relationship = 'Relationship',
    Component = 'Component'
}

export type DTDLSchema = string | DTDLEnum | null;

export enum DTDLSchemaType {
    Enum = 'Enum'
}

export class DTDLModel {
    readonly ['@type']: string;
    readonly ['@context']: string;
    ['@id']: string;
    displayName: string;
    description: string;
    comment: string;
    contents: any[];

    constructor(
        id: string,
        displayName: string,
        description: string,
        comment: string,
        properties: any[],
        relationships: any[],
        components: any[]
    ) {
        this['@type'] = DTDLType.Interface;
        this['@context'] = CURRENT_CONTEXT_VERSION;
        this['@id'] = id;
        this.displayName = displayName;
        this.description = description;
        this.comment = comment;
        this.contents = [...properties, ...relationships, ...components];
    }

    static getBlank(): DTDLModel {
        return new DTDLModel('', '', '', '', [], [], []);
    }

    get properties() {
        return this.contents.filter((c) => c['@type'] === DTDLType.Property);
    }

    get relationships() {
        return this.contents.filter(
            (c) => c['@type'] === DTDLType.Relationship
        );
    }

    get components() {
        return this.contents.filter((c) => c['@type'] === DTDLType.Component);
    }
}

export class DTDLProperty {
    readonly ['@type']: string;
    ['@id']: string;
    name: string;
    schema: DTDLSchema;
    comment: string;
    description: string;
    displayName: string;
    unit: string;
    writable: boolean;

    constructor(
        id: string,
        name: string,
        schema: DTDLSchema,
        comment: string,
        description: string,
        displayName: string,
        unit: string,
        writable: boolean
    ) {
        this['@type'] = 'Component';
        this['@id'] = id;
        this.name = name;
        this.schema = schema;
        this.comment = comment;
        this.description = description;
        this.displayName = displayName;
        this.unit = unit;
        this.writable = writable;
    }

    static getBlank() {
        return new DTDLProperty('', '', '', '', '', '', '', false);
    }
}

export class DTDLRelationship {
    readonly ['@type']: string;
    ['@id']: string;
    name: string;
    displayName: string;
    description: string;
    comment: string;
    maxMultiplicity: number;
    writable: boolean;
    target: string;
    readonly minMultiplicity: number;
    properties: DTDLProperty[];

    constructor(
        id: string,
        name: string,
        displayName: string,
        description: string,
        comment: string,
        writeable: boolean,
        properties: DTDLProperty[],
        target: string | null = null,
        maxMultiplicity: number | null = null
    ) {
        this['@type'] = 'Relationship';
        this['@id'] = id;
        this.name = name;
        this.displayName = displayName;
        this.description = description;
        this.comment = comment;
        this.writable = writeable;
        this.properties = properties;

        // The default value for target is 'any interface'. Here we use
        // the null value to indicate the value shout not be set.
        if (target !== null) {
            this.target = target;
        }

        // The default value for maxMultiplicity is 'infinite'. Here we
        // use the null value to indicate the value should not be set.
        if (maxMultiplicity !== null) {
            this.maxMultiplicity = maxMultiplicity;
        }

        this.minMultiplicity = 0;
    }

    static getBlank() {
        return new DTDLRelationship('', '', '', '', '', false, []);
    }
}

export class DTDLComponent {
    readonly ['@type']: string;
    ['@id']: string;
    name: string;
    schema: string;
    comment: string;
    description: string;
    displayName: string;

    constructor(
        id: string,
        name: string,
        schema: string,
        comment: string,
        description: string,
        displayName: string
    ) {
        this['@type'] = DTDLType.Component;
        this['@id'] = id;
        this.name = name;
        this.schema = schema;
        this.comment = comment;
        this.description = description;
        this.displayName = displayName;
    }

    static getBlank() {
        return new DTDLComponent('', '', '', '', '', '');
    }
}

export class DTDLEnum {
    readonly ['@type']: string;
    ['@id']: string;
    displayName: string;
    description: string;
    comment: string;
    valueSchema: string;
    enumValues: DTDLEnumValue[];

    constructor(
        id: string,
        displayName: string,
        description: string,
        comment: string,
        valueSchema: string,
        enumValues: DTDLEnumValue[]
    ) {
        this['@type'] = DTDLSchemaType.Enum;
        this['@id'] = id;
        this.displayName = displayName;
        this.description = description;
        this.comment = comment;
        this.valueSchema = valueSchema;
        this.enumValues = enumValues;
    }

    static getBlank() {
        return new DTDLEnum('', '', '', '', '', []);
    }
}

export class DTDLEnumValue {
    ['@id']: string;
    name: string;
    displayName: string;
    description: string;
    comment: string;
    enumValue: number | string;

    constructor(
        id: string,
        name: string,
        displayName: string,
        description: string,
        comment: string,
        enumValue: number | string
    ) {
        this['@id'] = id;
        this.name = name;
        this.displayName = displayName;
        this.description = description;
        this.comment = comment;
        this.enumValue = enumValue;
    }

    static getBlank() {
        return new DTDLEnumValue('', '', '', '', '', '');
    }
}
