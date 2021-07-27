import { IADTModelDefinition, IADTProperty } from '../Constants';

export const CURRENT_CONTEXT_VERSION = 'dtmi:dtdl:context;2';

export enum DTDLType {
    Interface = 'Interface',
    Telemetry = 'Telemetry',
    Property = 'Property',
    Command = 'Command',
    Relationship = 'Relationship',
    Component = 'Component'
}

export type DTDLSchema = DTDLPrimitiveSchema | DTDLComplexSchema;

export type DTDLPrimitiveSchema =
    | 'boolean'
    | 'date'
    | 'dateTime'
    | 'double'
    | 'duration'
    | 'float'
    | 'integer'
    | 'long'
    | 'string'
    | 'time';

export type DTDLComplexSchema = DTDLArray | DTDLEnum | DTDLMap | DTDLObject;

export enum DTDLSchemaType {
    Enum = 'Enum',
    Array = 'Array',
    Map = 'Map',
    Object = 'Object'
}

export class DTDLModel {
    //TODO: add validations
    readonly ['@type']: string;
    readonly ['@context']: string;
    ['@id']: string;
    displayName?: string;
    description?: string;
    comment?: string;
    contents?: any[];

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

    static fromObject(obj: IADTModelDefinition): DTDLModel {
        return new DTDLModel(
            obj['@id'],
            obj.displayName,
            obj.description,
            obj.comment,
            obj.contents
                .filter((p) => p['@type'] === DTDLType.Property)
                .map((p: any) => DTDLProperty.fromObject(p)), //TODO fix interfaces
            obj.contents
                .filter((r) => r['@type'] === DTDLType.Relationship)
                .map((r: any) => DTDLRelationship.fromObject(r)),
            obj.contents
                .filter((c) => c['@type'] === DTDLType.Component)
                .map((c: any) => DTDLComponent.fromObject(c))
        );
    }

    get properties() {
        return this.contents.filter((c) => c['@type'] === DTDLType.Property);
    }

    get relationships() {
        return this.contents.filter((c) => c.type === DTDLType.Relationship);
    }

    get components() {
        return this.contents.filter((c) => c.type === DTDLType.Component);
    }

    removeEmptyProperties() {
        Object.keys(this).map((k) => {
            if (this[k] === '' || this[k] === null || this[k] === undefined) {
                delete this[k];
            }
            this.contents?.map((c) => {
                Object.keys(c).map((cProp) => {
                    if (
                        c[cProp] === '' ||
                        c[cProp] === null ||
                        c[cProp] === undefined
                    ) {
                        delete c[cProp];
                    }
                });
            });
        });
    }
}

export class DTDLProperty {
    readonly ['@type']: string;
    ['@id']?: string;
    name: string;
    schema: DTDLSchema;
    comment?: string;
    description?: string;
    displayName?: string;
    unit?: string;
    writable?: boolean;

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
        this['@type'] = 'Property';
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
        return new DTDLProperty('', '', 'double', '', '', '', '', false);
    }

    static fromObject(obj: IADTProperty): DTDLProperty {
        return new DTDLProperty(
            obj['@id'],
            obj.name,
            typeof obj.schema === 'string'
                ? (obj.schema as DTDLPrimitiveSchema)
                : obj.schema['@type'] === DTDLSchemaType.Array
                ? DTDLArray.fromObject(obj)
                : obj.schema['@type'] === DTDLSchemaType.Enum
                ? DTDLEnum.fromObject(obj)
                : obj.schema['@type'] === DTDLSchemaType.Map
                ? DTDLMap.fromObject(obj)
                : DTDLObject.fromObject(obj),
            obj.comment,
            obj.description,
            obj.displayName,
            obj.unit,
            obj.writable
        );
    }
}

export class DTDLRelationship {
    readonly ['@type']: string;
    name: string;
    ['@id']?: string;
    maxMultiplicity?: number;
    writable?: boolean;
    target?: string;
    readonly minMultiplicity?: number;
    properties?: DTDLProperty[];
    displayName?: string;
    description?: string;
    comment?: string;

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

    static fromObject(obj: any): DTDLRelationship {
        //TODO: Use interface for obj
        return new DTDLRelationship(
            obj['@id'],
            obj.name,
            obj.displayName,
            obj.description,
            obj.comment,
            obj.writeable,
            obj.properties.map((p) => DTDLProperty.fromObject(p)),
            obj.target,
            obj.maxMultiplicity
        );
    }
}

export class DTDLComponent {
    readonly ['@type']: string;
    ['@id']?: string;
    name: string;
    schema: string;
    comment?: string;
    description?: string;
    displayName?: string;

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

    static fromObject(obj: any): DTDLComponent {
        //TODO: Use interface for obj
        return new DTDLComponent(
            obj['@id'],
            obj.name,
            obj.schema,
            obj.comment,
            obj.description,
            obj.displayName
        );
    }
}

export class DTDLArray {
    readonly ['@type']: DTDLSchemaType;
    elementSchema: DTDLSchema;
    ['@id']?: string;
    displayName?: string;
    description?: string;
    comment?: string;

    constructor(
        id: string,
        elementSchema: DTDLSchema,
        displayName?: string,
        description?: string,
        comment?: string
    ) {
        this['@type'] = DTDLSchemaType.Array;
        this.elementSchema = elementSchema;
        this['@id'] = id;
        this.displayName = displayName;
        this.description = description;
        this.comment = comment;
    }

    static getBlank() {
        return new DTDLArray('', 'double', '', '', '');
    }

    static fromObject(obj: any) {
        return new DTDLArray(
            obj['@id'],
            obj.elementSchema,
            obj.displayName,
            obj.description,
            obj.comment
        );
    }
}

export class DTDLMap {
    readonly ['@type']: DTDLSchemaType;
    mapKey: Record<string, any>; //TODO: Create type/interface for mapKey and mapValue
    mapValue: Record<string, any>;
    ['@id']?: string;
    displayName?: string;
    description?: string;
    comment?: string;

    constructor(
        id: string,
        mapKey: Record<string, any>,
        mapValue: Record<string, any>,
        displayName?: string,
        description?: string,
        comment?: string
    ) {
        this['@type'] = DTDLSchemaType.Map;
        this.mapKey = mapKey;
        this.mapValue = mapValue;
        this['@id'] = id;
        this.displayName = displayName;
        this.description = description;
        this.comment = comment;
    }

    static getBlank() {
        return new DTDLMap('', {}, {}, '', '');
    }

    static fromObject(obj: any) {
        return new DTDLMap(
            obj['@id'],
            obj.mapKey,
            obj.mapValue,
            obj.displayName,
            obj.description,
            obj.comment
        );
    }
}

export class DTDLObject {
    readonly ['@type']: DTDLSchemaType;
    fields: Array<Record<string, any>>; //TODO: Create type/interface for fields
    ['@id']?: string;
    displayName?: string;
    description?: string;
    comment?: string;

    constructor(
        id: string,
        fields: Array<Record<string, any>>,
        displayName?: string,
        description?: string,
        comment?: string
    ) {
        this['@type'] = DTDLSchemaType.Object;
        this.fields = fields;
        this['@id'] = id;
        this.displayName = displayName;
        this.description = description;
        this.comment = comment;
    }

    static getBlank() {
        return new DTDLObject('', [], '', '', '');
    }

    static fromObject(obj: any) {
        return new DTDLMap(
            obj['@id'],
            obj.fields,
            obj.displayName,
            obj.description,
            obj.comment
        );
    }
}

export class DTDLEnum {
    readonly ['@type']: string = 'Enum';
    enumValues: DTDLEnumValue[];
    valueSchema: string;
    ['@id']?: string;
    displayName?: string;
    description?: string;
    comment?: string;

    constructor(
        id: string,
        enumValues: DTDLEnumValue[],
        valueSchema: string,
        displayName: string,
        description: string,
        comment: string
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
        return new DTDLEnum('', [], '', '', '', '');
    }

    static fromObject(obj: any) {
        return new DTDLEnum(
            obj['@id'],
            obj.enumValues.map((eV) => DTDLEnumValue.fromObject(eV)),
            obj.valueSchema,
            obj.displayName,
            obj.unit,
            obj.writable
        );
    }
}

export class DTDLEnumValue {
    ['@id']: string;
    name: string;
    enumValue: number | string;
    displayName?: string;
    description?: string;
    comment?: string;

    constructor(
        id: string,
        name: string,
        enumValue: number | string,
        displayName: string,
        description: string,
        comment: string
    ) {
        this['@id'] = id;
        this.name = name;
        this.enumValue = enumValue;
        this.displayName = displayName;
        this.description = description;
        this.comment = comment;
    }

    static getBlank() {
        return new DTDLEnumValue('', '', '', '', '', '');
    }

    static fromObject(obj: any) {
        return new DTDLEnumValue(
            obj['@id'],
            obj.name,
            obj.enumValue,
            obj.displayName,
            obj.description,
            obj.comment
        );
    }
}
