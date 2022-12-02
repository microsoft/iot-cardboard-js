import {
    DTDLSchema,
    DTDLEnum,
    DTDLProperty,
    DTDLEnumValue,
    DTDLObject,
    DTDLMap,
    DTDLArray,
    DTDLObjectField
} from '../Classes/DTDL';

interface IMockPropertyBaseArgs {
    type: DTDLSchema | 'Object' | 'Map';
}
interface IMockPropertyEnumArgs {
    type: 'Enum';
    enumType: 'string' | 'integer';
}
interface IMockPropertyArrayArgs {
    type: 'Array';
    itemSchema: DTDLSchema;
}
export const getMockProperty = (
    args: IMockPropertyBaseArgs | IMockPropertyEnumArgs | IMockPropertyArrayArgs
): DTDLProperty => {
    const { type } = args;
    if (type === 'Enum') {
        const items: DTDLEnumValue[] = [
            {
                '@id': 'test id 1',
                name: 'test item 1',
                enumValue: args.enumType === 'integer' ? 1 : 'value 1'
            },
            {
                '@id': 'test id 2',
                name: 'test item 2',
                enumValue: args.enumType === 'integer' ? 2 : 'value 2'
            },
            {
                '@id': 'test id 3',
                name: 'test item 3',
                enumValue: args.enumType === 'integer' ? 3 : 'value 3'
            }
        ];
        return new DTDLProperty(
            'id1',
            'test ' + type + ' property name',
            new DTDLEnum(
                items,
                args.enumType,
                'test display name',
                'test description',
                'test comment'
            ),
            'test comment',
            'test description',
            'test display name',
            '',
            true
        );
    } else if (type === 'Object') {
        return new DTDLProperty(
            'id1',
            'test ' + type + ' property name',
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
                                        new DTDLEnumValue('enum val 2', 2),
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
            'test comment',
            'test description',
            'test display name',
            '',
            true
        );
    } else if (type === 'Map') {
        return new DTDLProperty(
            'id1',
            'test ' + type + ' property name',
            new DTDLMap(
                'test map 1',
                {},
                {},
                'test map display name',
                'test description',
                'test comment'
            ),
            'test comment',
            'test description',
            'test display name',
            '',
            true
        );
    } else if (type === 'Array') {
        return new DTDLProperty(
            'id1',
            'test ' + type + ' property name',
            new DTDLArray(
                'test array 1',
                args.itemSchema,
                'test array display name',
                'test array description',
                'test array comment'
            ),
            'test comment',
            'test description',
            'test display name',
            '',
            true
        );
    } else {
        return new DTDLProperty(
            'id1',
            'test ' + type + ' property name',
            type,
            'test comment',
            'test description',
            'test display name',
            '',
            true
        );
    }
};
