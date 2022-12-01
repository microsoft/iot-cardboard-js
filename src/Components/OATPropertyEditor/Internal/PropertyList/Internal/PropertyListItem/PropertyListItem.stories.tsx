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
    DTDLObject
} from '../../../../../../Models/Classes/DTDL';

const wrapperStyle = { width: '300px', height: '100px', padding: 8 };

export default {
    title: 'Components - OAT/OATPropertyEditor/PropertyList/PropertyListItem',
    component: PropertyListItem,
    decorators: [getDefaultStoryDecorator<IPropertyListItemProps>(wrapperStyle)]
};

type PropertyListItemStory = ComponentStory<typeof PropertyListItem>;

const DEFAULT_ARGS = {
    parentEntity: {},
    propertyIndex: 0
};
const Template: PropertyListItemStory = (args) => {
    return (
        <OatPageContextProvider
            disableLocalStorage={true}
            initialState={{
                ontologyFiles: [getMockFile(0, '123', '234')]
            }}
        >
            <PropertyListItem {...args} />
        </OatPageContextProvider>
    );
};

export const PrimitiveBoolean = Template.bind({}) as PropertyListItemStory;
PrimitiveBoolean.args = {
    ...DEFAULT_ARGS,
    propertyItem: getMockProperty({ type: 'boolean' })
} as IPropertyListItemProps;

export const PrimitiveDate = Template.bind({}) as PropertyListItemStory;
PrimitiveDate.args = {
    ...DEFAULT_ARGS,
    propertyItem: getMockProperty({ type: 'date' })
} as IPropertyListItemProps;

export const PrimitiveDouble = Template.bind({}) as PropertyListItemStory;
PrimitiveDouble.args = {
    ...DEFAULT_ARGS,
    propertyItem: getMockProperty({ type: 'double' })
} as IPropertyListItemProps;

export const PrimitiveDuration = Template.bind({}) as PropertyListItemStory;
PrimitiveDuration.args = {
    ...DEFAULT_ARGS,
    propertyItem: getMockProperty({ type: 'duration' })
} as IPropertyListItemProps;

export const PrimitiveFloat = Template.bind({}) as PropertyListItemStory;
PrimitiveFloat.args = {
    ...DEFAULT_ARGS,
    propertyItem: getMockProperty({ type: 'float' })
} as IPropertyListItemProps;

export const PrimitiveInteger = Template.bind({}) as PropertyListItemStory;
PrimitiveInteger.args = {
    ...DEFAULT_ARGS,
    propertyItem: getMockProperty({ type: 'integer' })
} as IPropertyListItemProps;

export const PrimitiveLong = Template.bind({}) as PropertyListItemStory;
PrimitiveLong.args = {
    ...DEFAULT_ARGS,
    propertyItem: getMockProperty({ type: 'long' })
} as IPropertyListItemProps;

export const PrimitiveString = Template.bind({}) as PropertyListItemStory;
PrimitiveString.args = {
    ...DEFAULT_ARGS,
    propertyItem: getMockProperty({ type: 'string' })
} as IPropertyListItemProps;

export const PrimitiveTime = Template.bind({}) as PropertyListItemStory;
PrimitiveTime.args = {
    ...DEFAULT_ARGS,
    propertyItem: getMockProperty({ type: 'time' })
} as IPropertyListItemProps;

export const ComplexObject = Template.bind({}) as PropertyListItemStory;
ComplexObject.args = {
    ...DEFAULT_ARGS,
    propertyItem: getMockProperty({ type: 'Object' })
} as IPropertyListItemProps;

export const ComplexEnumInteger = Template.bind({}) as PropertyListItemStory;
ComplexEnumInteger.args = {
    ...DEFAULT_ARGS,
    propertyItem: getMockProperty({ type: 'Enum', enumType: 'integer' })
} as IPropertyListItemProps;

export const ComplexEnumString = Template.bind({}) as PropertyListItemStory;
ComplexEnumString.args = {
    ...DEFAULT_ARGS,
    propertyItem: getMockProperty({ type: 'Enum', enumType: 'string' })
} as IPropertyListItemProps;

export const ComplexMap = Template.bind({}) as PropertyListItemStory;
ComplexMap.args = {
    ...DEFAULT_ARGS,
    propertyItem: getMockProperty({ type: 'Map' })
} as IPropertyListItemProps;

export const ComplexArrayPrimitive = Template.bind({}) as PropertyListItemStory;
ComplexArrayPrimitive.args = {
    ...DEFAULT_ARGS,
    propertyItem: getMockProperty({ type: 'Array', itemSchema: 'double' })
} as IPropertyListItemProps;

export const ComplexArrayObjects = Template.bind({}) as PropertyListItemStory;
ComplexArrayObjects.args = {
    ...DEFAULT_ARGS,
    propertyItem: getMockProperty({
        type: 'Array',
        itemSchema: new DTDLObject('child object 1', [
            // TODO: add fields
        ])
    })
} as IPropertyListItemProps;

export const ComplexArrayMaps = Template.bind({}) as PropertyListItemStory;
ComplexArrayMaps.args = {
    ...DEFAULT_ARGS,
    propertyItem: getMockProperty({
        type: 'Array',
        itemSchema: new DTDLMap('child map 1', {}, {})
    })
} as IPropertyListItemProps;

export const ComplexArrayEnum = Template.bind({}) as PropertyListItemStory;
ComplexArrayEnum.args = {
    ...DEFAULT_ARGS,
    propertyItem: getMockProperty({
        type: 'Array',
        itemSchema: new DTDLEnum(
            'child enum 1',
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
