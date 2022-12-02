import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../../../../../../../Models/Services/StoryUtilities';
import PropertyListItemChildHost from './PropertyListItemChildHost';
import { IPropertyListItemChildHostProps } from './PropertyListItemChildHost.types';
import { getMockProperty } from '../../../../../../../../Models/Services/OatTestUtils';
import { DTDLArray } from '../../../../../../../../Models/Classes/DTDL';

const wrapperStyle = { width: '100%', height: '600px', padding: 8 };

export default {
    title:
        'Components - OAT/OATPropertyEditor/PropertyList/PropertyListItem/PropertyListItemChildHost',
    component: PropertyListItemChildHost,
    decorators: [
        getDefaultStoryDecorator<IPropertyListItemChildHostProps>(wrapperStyle)
    ]
};

type PropertyListItemChildHostStory = ComponentStory<
    typeof PropertyListItemChildHost
>;

const Template: PropertyListItemChildHostStory = (args) => {
    return <PropertyListItemChildHost {...args} />;
};

export const EnumProperty = Template.bind({}) as PropertyListItemChildHostStory;
EnumProperty.args = {
    propertyItem: getMockProperty({ type: 'Enum', enumType: 'integer' })
} as IPropertyListItemChildHostProps;

export const ArrayPropertyComplex = Template.bind(
    {}
) as PropertyListItemChildHostStory;
ArrayPropertyComplex.args = {
    propertyItem: getMockProperty({
        type: 'Array',
        itemSchema: new DTDLArray('', new DTDLArray('', 'double'))
    })
} as IPropertyListItemChildHostProps;

export const ArrayPropertyPrimitive = Template.bind(
    {}
) as PropertyListItemChildHostStory;
ArrayPropertyPrimitive.args = {
    propertyItem: getMockProperty({
        type: 'Array',
        itemSchema: 'double'
    })
} as IPropertyListItemChildHostProps;

export const ObjectProperty = Template.bind(
    {}
) as PropertyListItemChildHostStory;
ObjectProperty.args = {
    propertyItem: getMockProperty({ type: 'Object' })
} as IPropertyListItemChildHostProps;

export const MapProperty = Template.bind({}) as PropertyListItemChildHostStory;
MapProperty.args = {
    propertyItem: getMockProperty({ type: 'Map' })
} as IPropertyListItemChildHostProps;
