import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../../../../../Models/Services/StoryUtilities';
import PropertyListItem from './PropertyListItem';
import { IPropertyListItemProps } from './PropertyListItem.types';
import { OatPageContextProvider } from '../../../../../../Models/Context/OatPageContext/OatPageContext';
import { getMockFile } from '../../../../../../Models/Context/OatPageContext/OatPageContext.mock';
import { getMockProperty } from '../../../../../../Models/Services/OatTestUtils';
import {
    DTDLEnum,
    DTDLMap,
    DTDLMapKey,
    DTDLMapValue,
    DTDLObject,
    DTDLObjectField
} from '../../../../../../Models/Classes/DTDL';

const wrapperStyle = {
    width: '400px',
    height: '400px',
    padding: 8
};

export default {
    title: 'Components - OAT/OATPropertyEditor/PropertyList/PropertyListItem',
    component: PropertyListItem,
    decorators: [getDefaultStoryDecorator<IPropertyListItemProps>(wrapperStyle)]
};

type PropertyListItemStory = ComponentStory<typeof PropertyListItem>;

const DEFAULT_ARGS = {
    parentEntity: {},
    indexKey: '0',
    onUpdateItem: () => {
        //
    }
};
const Template: PropertyListItemStory = (args) => {
    return (
        <div style={{ marginLeft: 32 }}>
            <OatPageContextProvider
                disableLocalStorage={true}
                initialState={{
                    ontologyFiles: [getMockFile(0, '123', '234')]
                }}
            >
                <PropertyListItem {...args} />
            </OatPageContextProvider>
        </div>
    );
};

export const PrimitiveBoolean = Template.bind({}) as PropertyListItemStory;
PrimitiveBoolean.args = {
    ...DEFAULT_ARGS,
    item: getMockProperty({ type: 'boolean' })
} as IPropertyListItemProps;

export const PrimitiveDate = Template.bind({}) as PropertyListItemStory;
PrimitiveDate.args = {
    ...DEFAULT_ARGS,
    item: getMockProperty({ type: 'date' })
} as IPropertyListItemProps;

export const PrimitiveDouble = Template.bind({}) as PropertyListItemStory;
PrimitiveDouble.args = {
    ...DEFAULT_ARGS,
    item: getMockProperty({ type: 'double' })
} as IPropertyListItemProps;

export const PrimitiveDuration = Template.bind({}) as PropertyListItemStory;
PrimitiveDuration.args = {
    ...DEFAULT_ARGS,
    item: getMockProperty({ type: 'duration' })
} as IPropertyListItemProps;

export const PrimitiveFloat = Template.bind({}) as PropertyListItemStory;
PrimitiveFloat.args = {
    ...DEFAULT_ARGS,
    item: getMockProperty({ type: 'float' })
} as IPropertyListItemProps;

export const PrimitiveInteger = Template.bind({}) as PropertyListItemStory;
PrimitiveInteger.args = {
    ...DEFAULT_ARGS,
    item: getMockProperty({ type: 'integer' })
} as IPropertyListItemProps;

export const PrimitiveLong = Template.bind({}) as PropertyListItemStory;
PrimitiveLong.args = {
    ...DEFAULT_ARGS,
    item: getMockProperty({ type: 'long' })
} as IPropertyListItemProps;

export const PrimitiveString = Template.bind({}) as PropertyListItemStory;
PrimitiveString.args = {
    ...DEFAULT_ARGS,
    item: getMockProperty({ type: 'string' })
} as IPropertyListItemProps;

export const PrimitiveTime = Template.bind({}) as PropertyListItemStory;
PrimitiveTime.args = {
    ...DEFAULT_ARGS,
    item: getMockProperty({ type: 'time' })
} as IPropertyListItemProps;

export const ComplexObject = Template.bind({}) as PropertyListItemStory;
ComplexObject.args = {
    ...DEFAULT_ARGS,
    item: getMockProperty({ type: 'Object' })
} as IPropertyListItemProps;

export const ComplexEnumInteger = Template.bind({}) as PropertyListItemStory;
ComplexEnumInteger.args = {
    ...DEFAULT_ARGS,
    item: (() => {
        const value = getMockProperty({ type: 'Enum', enumType: 'integer' });
        (value.schema as DTDLEnum).enumValues[1].name = 'longer name 2';
        return value;
    })()
} as IPropertyListItemProps;

export const ComplexEnumString = Template.bind({}) as PropertyListItemStory;
ComplexEnumString.args = {
    ...DEFAULT_ARGS,
    item: (() => {
        const value = getMockProperty({ type: 'Enum', enumType: 'string' });
        (value.schema as DTDLEnum).enumValues[1].name = 'longer name 2';
        (value.schema as DTDLEnum).enumValues[2].enumValue = 'longer value 3';
        return value;
    })()
} as IPropertyListItemProps;

export const ComplexMapOfPrimitive = Template.bind({}) as PropertyListItemStory;
ComplexMapOfPrimitive.args = {
    ...DEFAULT_ARGS,
    item: getMockProperty({ type: 'Map', valueType: 'Primitive' })
} as IPropertyListItemProps;

export const ComplexMapOfObject = Template.bind({}) as PropertyListItemStory;
ComplexMapOfObject.args = {
    ...DEFAULT_ARGS,
    item: getMockProperty({ type: 'Map', valueType: 'Complex' })
} as IPropertyListItemProps;

export const ComplexArrayPrimitive = Template.bind({}) as PropertyListItemStory;
ComplexArrayPrimitive.args = {
    ...DEFAULT_ARGS,
    item: getMockProperty({ type: 'Array', itemSchema: 'double' })
} as IPropertyListItemProps;

export const ComplexArrayObjects = Template.bind({}) as PropertyListItemStory;
ComplexArrayObjects.args = {
    ...DEFAULT_ARGS,
    item: getMockProperty({
        type: 'Array',
        itemSchema: new DTDLObject('', [
            new DTDLObjectField('field 1', 'double'),
            new DTDLObjectField('field 2', 'date')
        ])
    })
} as IPropertyListItemProps;

export const ComplexArrayMaps = Template.bind({}) as PropertyListItemStory;
ComplexArrayMaps.args = {
    ...DEFAULT_ARGS,
    item: getMockProperty({
        type: 'Array',
        itemSchema: new DTDLMap(
            'child map 1',
            new DTDLMapKey('map key 1'),
            new DTDLMapValue('map value 1', 'string')
        )
    })
} as IPropertyListItemProps;

export const ComplexArrayEnum = Template.bind({}) as PropertyListItemStory;
ComplexArrayEnum.args = {
    ...DEFAULT_ARGS,
    item: getMockProperty({
        type: 'Array',
        itemSchema: new DTDLEnum(
            [
                {
                    '@id': 'test id 1',
                    name: 'test item 1',
                    enumValue: 'value 1'
                },
                {
                    '@id': 'test id 2',
                    name: 'test item 2',
                    enumValue: 'value 2'
                },
                {
                    '@id': 'test id 3',
                    name: 'test item 3',
                    enumValue: 'value 3'
                }
            ],
            'string'
        )
    })
} as IPropertyListItemProps;
