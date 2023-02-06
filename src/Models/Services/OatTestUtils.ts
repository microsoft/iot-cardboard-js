import {
    DTDLSchema,
    DTDLEnum,
    DTDLProperty,
    DTDLEnumValue,
    DTDLObject,
    DTDLMap,
    DTDLArray,
    DTDLObjectField,
    DTDLMapKey,
    DTDLMapValue
} from '../Classes/DTDL';
import { DtdlMapValue } from '../Constants';

interface IMockPropertyBaseArgs {
    type: DTDLSchema;
    discriminator?: number;
}
interface IMockPropertyObjectArgs {
    type: 'Object';
    complexity: 'complex' | 'simple';
    discriminator?: number;
}
interface IMockPropertyEnumArgs {
    type: 'Enum';
    enumType: 'string' | 'integer';
    discriminator?: number;
}
interface IMockPropertyMapArgs {
    type: 'Map';
    valueType: 'Complex' | 'Primitive';
    discriminator?: number;
    mapValue?: DtdlMapValue;
}
interface IMockPropertyArrayArgs {
    type: 'Array';
    itemSchema: DTDLSchema;
    discriminator?: number;
}
export const getMockProperty = (
    args:
        | IMockPropertyBaseArgs
        | IMockPropertyArrayArgs
        | IMockPropertyEnumArgs
        | IMockPropertyMapArgs
        | IMockPropertyObjectArgs
): DTDLProperty => {
    const discriminator = args.discriminator ? `-${args.discriminator}` : '';
    if (args.type === 'Enum') {
        return new DTDLProperty(
            'test ' + args.type + ' property name' + discriminator,
            getMockEnumSchema(args),
            'id1',
            'test comment',
            'test description',
            'test display name',
            '',
            true
        );
    } else if (args.type === 'Object') {
        return new DTDLProperty(
            'test ' + args.type + ' property name' + discriminator,
            getMockObjectSchema(args),
            'id1',
            'test comment',
            'test description',
            'test display name',
            '',
            true
        );
    } else if (args.type === 'Map') {
        return new DTDLProperty(
            'test ' + args.type + ' property name' + discriminator,
            getMockMapSchema(args)
        );
    } else if (args.type === 'Array') {
        return new DTDLProperty(
            'test ' + args.type + ' property name' + discriminator,
            getMockArraySchema(args),
            'id1',
            'test comment',
            'test description',
            'test display name',
            '',
            true
        );
    } else {
        return new DTDLProperty(
            'test ' + args.type + ' property name' + discriminator,
            args.type,
            'id1',
            'test comment',
            'test description',
            'test display name',
            '',
            true
        );
    }
};

export const getMockEnumSchema = (args: IMockPropertyEnumArgs): DTDLEnum => {
    const items: DTDLEnumValue[] = [
        {
            '@id': 'test id 1',
            name: 'test item 1 with a longer name',
            enumValue: args.enumType === 'integer' ? 1 : 'value 1'
        },
        {
            '@id': 'test id 2',
            name: 'test item 2',
            enumValue: args.enumType === 'integer' ? 2 : 'value 2'
        },
        {
            '@id': 'test id 3',
            name: 'test long name 3',
            enumValue: args.enumType === 'integer' ? 3 : 'value is longer 3'
        }
    ];
    return new DTDLEnum(
        items,
        args.enumType,
        'test display name',
        'test description',
        'test comment'
    );
};
export const getMockMapSchema = (args: IMockPropertyMapArgs): DTDLMap => {
    let schema: DTDLSchema;
    if (args.valueType === 'Complex') {
        schema = new DTDLMap(
            new DTDLMapKey('map key 1'),
            args.mapValue ??
                new DTDLMapValue(
                    'value 1',
                    new DTDLObject([
                        new DTDLObjectField('prop 1', 'double'),
                        new DTDLObjectField(
                            'prop 2',
                            new DTDLObject([
                                new DTDLObjectField('my double', 'double')
                            ])
                        ),
                        new DTDLObjectField('prop 3', 'string')
                    ])
                ),
            'test map 1'
        );
    } else {
        schema = new DTDLMap(
            new DTDLMapKey('map key 1'),
            args.mapValue ?? new DTDLMapValue('value 1', 'string'),
            'test map 1'
        );
    }
    return schema;
};
export const getMockObjectSchema = (
    args: IMockPropertyObjectArgs
): DTDLObject => {
    let schema: DTDLObject;
    if (args.complexity === 'complex') {
        schema = new DTDLObject(
            [
                {
                    name: 'double property 1 name',
                    schema: 'double'
                },
                {
                    name: 'string property 2 name',
                    schema: 'string'
                },
                {
                    name: 'mega object property name' + args.discriminator,
                    schema: new DTDLObject([
                        new DTDLObjectField('name 1', 'string'),
                        new DTDLObjectField(
                            'object 1',
                            new DTDLObject([
                                new DTDLObjectField('prop 1', 'string'),
                                new DTDLObjectField('prop 2', 'string'),
                                new DTDLObjectField('prop 3', 'string')
                            ])
                        ),
                        new DTDLObjectField(
                            'my double array',
                            new DTDLArray('double')
                        ),
                        new DTDLObjectField(
                            'enum 2',
                            new DTDLEnum(
                                [
                                    new DTDLEnumValue('enum val 1', 1),
                                    new DTDLEnumValue('enum value 2', 200),
                                    new DTDLEnumValue('enum val 3', 3)
                                ],
                                'integer'
                            )
                        ),
                        new DTDLObjectField('name 3', 'string')
                    ])
                },
                {
                    name: 'long property 2 name',
                    schema: 'long'
                }
            ],
            'test object display name',
            'test object description',
            'test object comment'
        );
    } else {
        schema = new DTDLObject(
            [
                {
                    name: 'double property 1 name',
                    schema: 'double'
                },
                {
                    name: 'mega object property name' + args.discriminator,
                    schema: new DTDLObject([
                        new DTDLObjectField('name 1', 'string'),
                        new DTDLObjectField(
                            'enum 2',
                            new DTDLEnum(
                                [
                                    new DTDLEnumValue('enum val 1', 1),
                                    new DTDLEnumValue('enum value 2', 200),
                                    new DTDLEnumValue('enum val 3', 3)
                                ],
                                'integer'
                            )
                        ),
                        new DTDLObjectField('name 3', 'string')
                    ])
                },
                {
                    name: 'long property 2 name',
                    schema: 'long'
                }
            ],
            'test object display name',
            'test object description',
            'test object comment'
        );
    }
    return schema;
};
export const getMockArraySchema = (args: IMockPropertyArrayArgs): DTDLArray => {
    return new DTDLArray(
        args.itemSchema,
        'test array 1',
        'test array display name',
        'test array description',
        'test array comment'
    );
};
