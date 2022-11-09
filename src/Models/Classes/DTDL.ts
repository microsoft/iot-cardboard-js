import {
    DtdlInterfaceContent,
    IADTModelDefinition,
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
    '@id': string;
    readonly ['@type']: string;
    readonly ['@context']: string;
    comment?: string;
    contents?: any[];
    description?: string;
    displayName?: string;
    /** array of strings of ids that this model extends */
    extends?: string[];

    constructor(
        id: string,
        displayName: string,
        description: string,
        comment: string,
        properties: DtdlInterfaceContent[],
        relationships: DtdlInterfaceContent[],
        components: DtdlInterfaceContent[],
        extendRelationships: string[]
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
    }

    static getBlank(): DTDLModel {
        return new DTDLModel('', '', '', '', [], [], [], []);
    }

    static fromObject(obj: IADTModelDefinition): DTDLModel {
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
                ? DTDLArray.fromObject(obj.schema)
                : obj.schema['@type'] === DTDLSchemaType.Enum
                ? DTDLEnum.fromObject(obj.schema)
                : obj.schema['@type'] === DTDLSchemaType.Map
                ? DTDLMap.fromObject(obj.schema)
                : DTDLObject.fromObject(obj.schema),
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
            obj.properties?.map((p) => DTDLProperty.fromObject(p)),
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
    valueSchema: 'integer' | 'string';
    ['@id']?: string;
    displayName?: string;
    description?: string;
    comment?: string;

    constructor(
        id: string,
        enumValues: DTDLEnumValue[],
        valueSchema: 'integer' | 'string' | undefined,
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
        return new DTDLEnum('', [], 'integer', '', '', '');
    }

    static fromObject(obj: any) {
        return new DTDLEnum(
            obj['@id'],
            obj.enumValues.map((eV) =>
                DTDLEnumValue.fromObject(eV, obj.valueSchema)
            ),
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

    static fromObject(obj: any, valueSchema: 'integer' | 'string') {
        return new DTDLEnumValue(
            obj['@id'],
            obj.name,
            valueSchema === 'integer'
                ? Number.parseInt(obj.enumValue)
                : obj.enumValue,
            obj.displayName,
            obj.description,
            obj.comment
        );
    }
}
