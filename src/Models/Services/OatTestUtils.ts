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

interface IMockPropertyBaseArgs {
    type: DTDLSchema | 'Object';
}
interface IMockPropertyEnumArgs {
    type: 'Enum';
    enumType: 'string' | 'integer';
}
interface IMockPropertyMapArgs {
    type: 'Map';
    valueType: 'Complex' | 'Primitive';
}
interface IMockPropertyArrayArgs {
    type: 'Array';
    itemSchema: DTDLSchema;
}
export const getMockProperty = (
    args:
        | IMockPropertyBaseArgs
        | IMockPropertyEnumArgs
        | IMockPropertyArrayArgs
        | IMockPropertyMapArgs
): DTDLProperty => {
    if (args.type === 'Enum') {
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
        return new DTDLProperty(
            'test ' + args.type + ' property name',
            new DTDLEnum(
                items,
                args.enumType,
                'test display name',
                'test description',
                'test comment'
            ),
            'id1',
            'test comment',
            'test description',
            'test display name',
            '',
            true
        );
    } else if (args.type === 'Object') {
        return new DTDLProperty(
            'test ' + args.type + ' property name',
            new DTDLObject(
                'test object 1',
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
                        name: 'mega object property name',
                        schema: new DTDLObject('', [
                            new DTDLObjectField('name 1', 'string'),
                            new DTDLObjectField(
                                'object 1',
                                new DTDLObject('', [
                                    new DTDLObjectField('prop 1', 'string'),
                                    new DTDLObjectField('prop 2', 'string'),
                                    new DTDLObjectField('prop 3', 'string')
                                ])
                            ),
                            new DTDLObjectField(
                                'my double array',
                                new DTDLArray('', 'double')
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
            ),
            'id1',
            'test comment',
            'test description',
            'test display name',
            '',
            true
        );
    } else if (args.type === 'Map') {
        let schema: DTDLSchema;
        if (args.valueType === 'Complex') {
            schema = new DTDLMap(
                'test map 1',
                new DTDLMapKey('map key 1'),
                new DTDLMapValue(
                    'value 1',
                    new DTDLObject('', [
                        new DTDLObjectField('prop 1', 'double'),
                        new DTDLObjectField(
                            'prop 2',
                            new DTDLObject('', [
                                new DTDLObjectField('my double', 'double')
                            ])
                        ),
                        new DTDLObjectField('prop 3', 'string')
                    ])
                )
            );
        } else {
            schema = new DTDLMap(
                'test map 1',
                new DTDLMapKey('map key 1'),
                new DTDLMapValue('value 1', 'string')
            );
        }
        return new DTDLProperty('test ' + args.type + ' property name', schema);
    } else if (args.type === 'Array') {
        return new DTDLProperty(
            'test ' + args.type + ' property name',
            new DTDLArray(
                'test array 1',
                args.itemSchema,
                'test array display name',
                'test array description',
                'test array comment'
            ),
            'id1',
            'test comment',
            'test description',
            'test display name',
            '',
            true
        );
    } else {
        return new DTDLProperty(
            'test ' + args.type + ' property name',
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
