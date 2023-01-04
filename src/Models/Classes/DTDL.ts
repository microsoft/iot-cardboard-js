import {
    DtdlArray,
    DtdlComponent,
    DtdlEnum,
    DtdlEnumValue,
    DtdlInterface,
    DtdlInterfaceContent,
    DtdlInterfaceSchema,
    DtdlMap,
    DtdlMapKey,
    DtdlMapValue,
    DtdlObject,
    DtdlObjectField,
    DtdlProperty,
    DtdlRelationship,
    IADTProperty
} from '../Constants';

export const CURRENT_CONTEXT_VERSION = 'dtmi:dtdl:context;2';

export enum DTDLType {
    Interface = 'Interface',
    Telemetry = 'Telemetry',
    Property = 'Property',
    Command = 'Command',
    Relationship = 'Relationship',
    Component = 'Component'
}

export const DTDLSemanticTypes = [
    {
        SemanticType: 'Acceleration',
        UnitType: 'AccelerationUnit',
        Unit: ['metrePerSecondSquared', 'centimetrePerSecondSquared', 'gForce']
    },
    {
        SemanticType: 'Angle',
        UnitType: 'AngleUnit',
        Unit: ['radian', 'degreeOfArc', 'minuteOfArc', 'secondOfArc', 'turn']
    },
    {
        SemanticType: 'AngularAcceleration',
        UnitType: 'AngularAccelerationUnit',
        Unit: ['radianPerSecondSquared']
    },
    {
        SemanticType: 'AngularVelocity',
        UnitType: 'AngularVelocityUnit',
        Unit: [
            'radianPerSecond',
            'degreePerSecond',
            'revolutionPerSecond',
            'revolutionPerMinute'
        ]
    },
    {
        SemanticType: 'Area',
        UnitType: 'AreaUnit',
        Unit: [
            'squareMetre',
            'squareCentimetre',
            'squareMillimetre',
            'squareKilometre',
            'hectare',
            'squareFoot',
            'squareInch',
            'acre'
        ]
    },
    {
        SemanticType: 'Capacitance',
        UnitType: 'CapacitanceUnit',
        Unit: ['farad', 'millifarad', 'microfarad', 'nanofarad', 'picofarad']
    },
    {
        SemanticType: 'Current',
        UnitType: 'CurrentUnit',
        Unit: ['ampere', 'microampere', 'milliampere']
    },
    {
        SemanticType: 'DataRate',
        UnitType: 'DataRateUnit',
        Unit: [
            'bitPerSecond',
            'kibibitPerSecond',
            'mebibitPerSecond',
            'gibibitPerSecond',
            'tebibitPerSecond',
            'exbibitPerSecond',
            'zebibitPerSecond',
            'yobibitPerSecond',
            'bytePerSecond',
            'kibibytePerSecond',
            'mebibytePerSecond',
            'gibibytePerSecond',
            'tebibytePerSecond',
            'exbibytePerSecond',
            'zebibytePerSecond',
            'yobibytePerSecond'
        ]
    },
    {
        SemanticType: 'DataSize',
        UnitType: 'DataSizeUnit',
        Unit: [
            'bit',
            'kibibit',
            'mebibit',
            'gibibit',
            'tebibit',
            'exbibit',
            'zebibit',
            'yobibit',
            'byte',
            'kibibyte',
            'mebibyte',
            'gibibyte',
            'tebibyte',
            'exbibyte',
            'zebibyte',
            'yobibyte'
        ]
    },
    {
        SemanticType: 'Density',
        UnitType: 'DensityUnit',
        Unit: ['kilogramPerCubicMetre', 'gramPerCubicMetre']
    },
    {
        SemanticType: 'Distance',
        UnitType: 'LengthUnit',
        Unit: [
            'metre',
            'centimetre',
            'millimetre',
            'micrometre',
            'nanometre',
            'kilometre',
            'foot',
            'inch',
            'mile',
            'nauticalMile',
            'astronomicalUnit'
        ]
    },
    {
        SemanticType: 'ElectricCharge',
        UnitType: 'ChargeUnit',
        Unit: ['coulomb']
    },
    {
        SemanticType: 'Energy',
        UnitType: 'EnergyUnit',
        Unit: [
            'joule',
            'kilojoule',
            'megajoule',
            'gigajoule',
            'electronvolt',
            'megaelectronvolt',
            'kilowattHour'
        ]
    },
    {
        SemanticType: 'Force',
        UnitType: 'ForceUnit',
        Unit: ['newton', 'pound', 'ounce', 'ton']
    },
    {
        SemanticType: 'Frequency',
        UnitType: 'FrequencyUnit',
        Unit: ['hertz', 'kilohertz', 'megahertz', 'gigahertz']
    },
    {
        SemanticType: 'Humidity',
        UnitType: 'DensityUnit',
        Unit: ['kilogramPerCubicMetre', 'gramPerCubicMetre']
    },
    {
        SemanticType: 'Illuminance',
        UnitType: 'IlluminanceUnit',
        Unit: ['lux', 'footcandle']
    },
    {
        SemanticType: 'Inductance',
        UnitType: 'InductanceUnit',
        Unit: ['henry', 'millihenry', 'microhenry']
    },
    {
        SemanticType: 'Latitude',
        UnitType: 'AngleUnit',
        Unit: ['radian', 'degreeOfArc', 'minuteOfArc', 'secondOfArc', 'turn']
    },
    {
        SemanticType: 'Longitude',
        UnitType: 'AngleUnit',
        Unit: ['radian', 'degreeOfArc', 'minuteOfArc', 'secondOfArc', 'turn']
    },
    {
        SemanticType: 'Length',
        UnitType: 'LengthUnit',
        Unit: [
            'metre',
            'centimetre',
            'millimetre',
            'micrometre',
            'nanometre',
            'kilometre',
            'foot',
            'inch',
            'mile',
            'nauticalMile',
            'astronomicalUnit'
        ]
    },
    {
        SemanticType: 'Luminance',
        UnitType: 'LuminanceUnit',
        Unit: ['candelaPerSquareMetre']
    },
    {
        SemanticType: 'Luminosity',
        UnitType: 'PowerUnit',
        Unit: [
            'watt',
            'microwatt',
            'milliwatt',
            'kilowatt',
            'megawatt',
            'gigawatt',
            'horsepower',
            'kilowattHourPerYear'
        ]
    },
    {
        SemanticType: 'LuminousFlux',
        UnitType: 'LuminousFluxUnit',
        Unit: ['lumen']
    },
    {
        SemanticType: 'LuminousIntensity',
        UnitType: 'LuminousIntensityUnit',
        Unit: ['candela']
    },
    {
        SemanticType: 'MagneticFlux',
        UnitType: 'MagneticFluxUnit',
        Unit: ['weber', 'maxwell']
    },
    {
        SemanticType: 'MagneticInduction',
        UnitType: 'MagneticInductionUnit',
        Unit: ['tesla']
    },
    {
        SemanticType: 'Mass',
        UnitType: 'MassUnit',
        Unit: ['kilogram', 'gram', 'milligram', 'microgram', 'tonne', 'slug']
    },
    {
        SemanticType: 'MassFlowRate',
        UnitType: 'MassFlowRateUnit',
        Unit: [
            'gramPerSecond',
            'kilogramPerSecond',
            'gramPerHour',
            'kilogramPerHour'
        ]
    },
    {
        SemanticType: 'Power',
        UnitType: 'PowerUnit',
        Unit: [
            'watt',
            'microwatt',
            'milliwatt',
            'kilowatt',
            'megawatt',
            'gigawatt',
            'horsepower',
            'kilowattHourPerYear'
        ]
    },
    {
        SemanticType: 'Pressure',
        UnitType: 'PressureUnit',
        Unit: [
            'pascal',
            'kilopascal',
            'bar',
            'millibar',
            'millimetresOfMercury',
            'poundPerSquareInch',
            'inchesOfMercury',
            'inchesOfWater'
        ]
    },
    {
        SemanticType: 'RelativeHumidity',
        UnitType: 'unitless',
        Unit: ['unity percent']
    },
    {
        SemanticType: 'Resistance',
        UnitType: 'ResistanceUnit',
        Unit: ['ohm', 'milliohm', 'kiloohm', 'megaohm']
    },
    {
        SemanticType: 'SoundPressure',
        UnitType: 'SoundPressureUnit',
        Unit: ['decibel', 'bel']
    },
    {
        SemanticType: 'Temperature',
        UnitType: 'TemperatureUnit',
        Unit: ['kelvin', 'degreeCelsius', 'degreeFahrenheit']
    },
    {
        SemanticType: 'Thrust',
        UnitType: 'ForceUnit',
        Unit: ['newton', 'pound', 'ounce', 'ton']
    },
    {
        SemanticType: 'TimeSpan',
        UnitType: 'TimeUnit',
        Unit: [
            'second',
            'millisecond',
            'microsecond',
            'nanosecond',
            'minute',
            'hour',
            'day',
            'year'
        ]
    },
    {
        SemanticType: 'Torque',
        UnitType: 'TorqueUnit',
        Unit: ['newtonMetre']
    },
    {
        SemanticType: 'Velocity',
        UnitType: 'VelocityUnit',
        Unit: [
            'metrePerSecond',
            'centimetrePerSecond',
            'kilometrePerSecond',
            'metrePerHour',
            'kilometrePerHour',
            'milePerHour',
            'milePerSecond',
            'knot'
        ]
    },
    {
        SemanticType: 'Voltage',
        UnitType: 'VoltageUnit',
        Unit: ['volt', 'millivolt', 'microvolt', 'kilovolt', 'megavolt']
    },
    {
        SemanticType: 'Volume',
        UnitType: 'VolumeUnit',
        Unit: [
            'cubicMetre',
            'cubicCentimetre',
            'litre',
            'millilitre',
            'cubicFoot',
            'cubicInch',
            'fluidOunce',
            'gallon'
        ]
    },
    {
        SemanticType: 'VolumeFlowRate',
        UnitType: 'VolumeFlowRateUnit',
        Unit: [
            'litrePerSecond',
            'millilitrePerSecond',
            'litrePerHour',
            'millilitrePerHour'
        ]
    }
];

/** the names for the schemas */
export type DTDLSchemaTypes =
    | DTDLPrimitiveSchema
    | DTDLGeospatialSchema
    | DTDLSchemaType;
/** the actual schema types that a DTDL item can have */
export type DTDLSchema =
    | DTDLPrimitiveSchema
    | DTDLGeospatialSchema
    | DTDLComplexSchema;
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

export type DTDLGeospatialSchema =
    | 'linestring'
    | 'multiLinestring'
    | 'multiPoint'
    | 'multiPolygon'
    | 'point'
    | 'polygon';

export type DTDLComplexSchema = DtdlArray | DtdlEnum | DtdlMap | DtdlObject;

export enum DTDLSchemaType {
    Enum = 'Enum',
    Array = 'Array',
    Map = 'Map',
    Object = 'Object'
}

export class DTDLModel implements DtdlInterface {
    //TODO: add validations
    '@id': string;
    readonly ['@type']: string;
    readonly ['@context']: string;
    comment?: string;
    contents: DtdlInterfaceContent[];
    description?: string | Record<string, string>;
    displayName?: string | Record<string, string>;
    /** array of strings of ids that this model extends */
    extends?: string[];
    schemas?: DtdlInterfaceSchema[];

    constructor(
        id: string,
        displayName?: string | Record<string, string>,
        description?: string | Record<string, string>,
        comment?: string,
        properties?: DtdlInterfaceContent[],
        relationships?: DtdlInterfaceContent[],
        components?: DtdlInterfaceContent[],
        extendRelationships?: string[],
        schemas?: DtdlInterfaceSchema[]
    ) {
        this['@type'] = DTDLType.Interface;
        this['@context'] = CURRENT_CONTEXT_VERSION;
        this['@id'] = id;
        this.displayName = displayName;
        this.description = description;
        this.comment = comment;
        this.contents = [
            ...(properties ?? []),
            ...(relationships ?? []),
            ...(components ?? [])
        ];
        this.extends = [...(extendRelationships ?? [])];
        this.schemas = [...(schemas ?? [])];
    }

    static getBlank(): DTDLModel {
        return new DTDLModel('', '', '', '', [], [], [], []);
    }

    static fromObject(obj: any): DTDLModel {
        return new DTDLModel(
            obj['@id'],
            obj.displayName,
            obj.description,
            obj.comment,
            obj.contents
                ?.filter((p) => p['@type'] === DTDLType.Property)
                .map((p: any) => DTDLProperty.fromObject(p)), //TODO fix interfaces
            obj.contents
                ?.filter((r) => r['@type'] === DTDLType.Relationship)
                .map((r: any) => DTDLRelationship.fromObject(r)),
            obj.contents
                ?.filter((c) => c['@type'] === DTDLType.Component)
                .map((c: any) => DTDLComponent.fromObject(c)),
            []
        );
    }

    get properties() {
        return this.contents.filter(
            (c) => c['@type'] === DTDLType.Property
        ) as DTDLProperty[];
    }

    get relationships() {
        return this.contents.filter(
            (c) => c['@type'] === DTDLType.Relationship
        ) as DTDLRelationship[];
    }

    get components() {
        return this.contents.filter(
            (c) => c['@type'] === DTDLType.Component
        ) as DTDLComponent[];
    }

    trimmedCopy() {
        const removeEmptyProps = (elem: any) => {
            if (typeof elem === 'object') {
                Object.keys(elem).map((k) => {
                    if (
                        elem[k] === '' ||
                        elem[k] === null ||
                        elem[k] === undefined
                    ) {
                        delete elem[k];
                    } else {
                        removeEmptyProps(elem[k]);
                    }
                });
            } else if (Array.isArray(elem)) {
                elem.map((item) => removeEmptyProps(item));
            }
        };

        const copy = { ...this };
        removeEmptyProps(copy);
        return copy;
    }
}

export class DTDLProperty implements DtdlProperty {
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
        name: string,
        schema: DTDLSchema,
        id?: string,
        comment?: string,
        description?: string,
        displayName?: string,
        unit?: string,
        writable?: boolean
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
        return new DTDLProperty('', 'double', '', '', '', '', '', false);
    }

    static fromObject(obj: IADTProperty): DTDLProperty {
        return new DTDLProperty(
            obj.name,
            typeof obj.schema === 'string'
                ? (obj.schema as DTDLPrimitiveSchema)
                : obj.schema['@type'] === DTDLSchemaType.Array
                ? DTDLArray.fromObject(obj.schema)
                : obj.schema['@type'] === DTDLSchemaType.Enum
                ? DTDLEnum.fromObject(obj.schema)
                : obj.schema['@type'] === DTDLSchemaType.Map
                ? DTDLMap.fromObject(obj.schema)
                : DTDLObject.fromObject(obj.schema),
            obj['@id'],
            obj.comment,
            obj.description,
            obj.displayName,
            obj.unit,
            obj.writable
        );
    }
}

export class DTDLRelationship implements DtdlRelationship {
    readonly ['@type']: DTDLType.Relationship;
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
        this['@type'] = DTDLType.Relationship;
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
            obj.properties?.map((p) => DTDLProperty.fromObject(p)),
            obj.target,
            obj.maxMultiplicity
        );
    }
}

export class DTDLComponent implements DtdlComponent {
    readonly ['@type']: DTDLType.Component;
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
        comment?: string,
        description?: string,
        displayName?: string
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
export class DTDLArray implements DtdlArray {
    readonly ['@type']: DTDLSchemaType.Array;
    elementSchema: DTDLSchema;
    ['@id']?: string;
    displayName?: string;
    description?: string;
    comment?: string;

    constructor(
        elementSchema: DTDLSchema,
        id?: string,
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
        return new DTDLArray('string', '', '', '', '');
    }

    static fromObject(obj: any) {
        return new DTDLArray(
            obj.elementSchema,
            obj['@id'],
            obj.displayName,
            obj.description,
            obj.comment
        );
    }
}

export class DTDLMapKey implements DtdlMapKey {
    name: string;
    schema: DTDLSchema;
    ['@id']?: string;
    comment?: string;
    description?: string;
    displayName?: string;

    constructor(
        name: string,
        id?: string,
        displayName?: string,
        description?: string,
        comment?: string
    ) {
        this['@id'] = id;
        this.name = name;
        this.schema = 'string';
        this.displayName = displayName;
        this.description = description;
        this.comment = comment;
    }

    static getBlank() {
        return new DTDLMapKey('', '', '', '', '');
    }

    static fromObject(obj: any) {
        return new DTDLMapKey(
            obj.name,
            obj['@id'],
            obj.displayName,
            obj.description,
            obj.comment
        );
    }
}

export class DTDLMapValue implements DtdlMapValue {
    name: string;
    schema: DTDLSchema;
    ['@id']?: string;
    comment?: string;
    description?: string;
    displayName?: string;

    constructor(
        name: string,
        schema: DTDLSchema,
        id?: string,
        displayName?: string,
        description?: string,
        comment?: string
    ) {
        this['@id'] = id;
        this.name = name;
        this.schema = schema;
        this.displayName = displayName;
        this.description = description;
        this.comment = comment;
    }

    static getBlank() {
        return new DTDLMapValue('', 'string', '', '', '', '');
    }

    static fromObject(obj: any) {
        return new DTDLMapValue(
            obj.name,
            typeof obj.schema === 'string'
                ? (obj.schema as DTDLPrimitiveSchema)
                : obj.schema['@type'] === DTDLSchemaType.Array
                ? DTDLArray.fromObject(obj.schema)
                : obj.schema['@type'] === DTDLSchemaType.Enum
                ? DTDLEnum.fromObject(obj.schema)
                : obj.schema['@type'] === DTDLSchemaType.Map
                ? DTDLMap.fromObject(obj.schema)
                : DTDLObject.fromObject(obj.schema),
            obj['@id'],
            obj.displayName,
            obj.description,
            obj.comment
        );
    }
}

export class DTDLMap implements DtdlMap {
    readonly ['@type']: DTDLSchemaType.Map;
    mapKey: DtdlMapKey;
    mapValue: DtdlMapValue;
    ['@id']?: string;
    displayName?: string;
    description?: string;
    comment?: string;

    constructor(
        mapKey: DtdlMapKey,
        mapValue: DtdlMapValue,
        id?: string,
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
        return new DTDLMap(
            DTDLMapKey.getBlank(),
            DTDLMapValue.getBlank(),
            '',
            '',
            ''
        );
    }

    static fromObject(obj: any) {
        return new DTDLMap(
            obj.mapKey,
            obj.mapValue,
            obj['@id'],
            obj.displayName,
            obj.description,
            obj.comment
        );
    }
}

export class DTDLObject implements DtdlObject {
    readonly ['@type']: DTDLSchemaType.Object;
    fields: DtdlObjectField[];
    ['@id']?: string;
    displayName?: string;
    description?: string;
    comment?: string;

    constructor(
        fields: DtdlObjectField[],
        id?: string,
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
        return new DTDLObject([], '', '', '', '');
    }

    static fromObject(obj: any) {
        return new DTDLObject(
            obj.fields,
            obj['@id'],
            obj.displayName,
            obj.description,
            obj.comment
        );
    }
}

export class DTDLObjectField implements DtdlObjectField {
    name: string;
    schema: DTDLSchema;
    ['@id']?: string;
    comment?: string;
    description?: string;
    displayName?: string;

    constructor(
        name: string,
        schema: DTDLSchema,
        id?: string,
        comment?: string,
        description?: string,
        displayName?: string
    ) {
        this.name = name;
        this.schema = schema;
        this['@id'] = id;
        this.displayName = displayName;
        this.description = description;
        this.comment = comment;
    }
}

export class DTDLEnum implements DtdlEnum {
    readonly ['@type']: DTDLSchemaType.Enum;
    enumValues: DTDLEnumValue[];
    valueSchema: 'integer' | 'string';
    ['@id']?: string;
    displayName?: string;
    description?: string;
    comment?: string;

    constructor(
        enumValues: DTDLEnumValue[],
        valueSchema: 'integer' | 'string' | undefined,
        id?: string,
        displayName?: string,
        description?: string,
        comment?: string
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
        return new DTDLEnum([], 'integer', '', '', '', '');
    }

    static fromObject(obj: any) {
        return new DTDLEnum(
            obj.enumValues.map((eV) =>
                DTDLEnumValue.fromObject(eV, obj.valueSchema)
            ),
            obj.valueSchema,
            obj['@id'],
            obj.displayName,
            obj.unit,
            obj.writable
        );
    }
}

export class DTDLEnumValue implements DtdlEnumValue {
    ['@id']?: string;
    name: string;
    enumValue: number | string;
    displayName?: string;
    description?: string;
    comment?: string;

    constructor(
        name: string,
        enumValue: number | string,
        id?: string,
        displayName?: string,
        description?: string,
        comment?: string
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

    static fromObject(obj: any, valueSchema: 'integer' | 'string') {
        return new DTDLEnumValue(
            obj.name,
            valueSchema === 'integer'
                ? Number.parseInt(obj.enumValue)
                : obj.enumValue,
            obj['@id'],
            obj.displayName,
            obj.description,
            obj.comment
        );
    }
}
