import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../../../../../../../Models/Services/StoryUtilities';
import PropertyListItemChildHost from './PropertyListItemChildHost';
import { IPropertyListItemChildHostProps } from './PropertyListItemChildHost.types';
import { getMockProperty } from '../../../../../../../../Models/Services/OatTestUtils';
import { OatPageContextProvider } from '../../../../../../../../Models/Context/OatPageContext/OatPageContext';
import { getMockFile } from '../../../../../../../../Models/Context/OatPageContext/OatPageContext.mock';

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
    return (
        <OatPageContextProvider
            disableLocalStorage={true}
            initialState={{
                ontologyFiles: [getMockFile(0, '123', '234')]
            }}
        >
            <PropertyListItemChildHost {...args} />
        </OatPageContextProvider>
    );
};

export const EnumProperty = Template.bind({}) as PropertyListItemChildHostStory;
EnumProperty.args = {
    indexKey: '0',
    level: 1,
    propertyItem: getMockProperty({ type: 'Enum', enumType: 'integer' }),
    onUpdateSchema: () => undefined
} as IPropertyListItemChildHostProps;

export const ArrayProperty = Template.bind(
    {}
) as PropertyListItemChildHostStory;
ArrayProperty.args = {
    indexKey: '0',
    level: 1,
    propertyItem: getMockProperty({
        type: 'Array',
        itemSchema: 'double'
    }),
    onUpdateSchema: () => undefined
} as IPropertyListItemChildHostProps;

export const ObjectProperty = Template.bind(
    {}
) as PropertyListItemChildHostStory;
ObjectProperty.args = {
    indexKey: '0',
    level: 1,
    propertyItem: getMockProperty({ type: 'Object', complexity: 'complex' }),
    onUpdateSchema: () => undefined
} as IPropertyListItemChildHostProps;

export const MapPropertyPrimitive = Template.bind(
    {}
) as PropertyListItemChildHostStory;
MapPropertyPrimitive.args = {
    indexKey: '0',
    level: 1,
    propertyItem: getMockProperty({ type: 'Map', valueType: 'Primitive' }),
    onUpdateSchema: () => undefined
} as IPropertyListItemChildHostProps;

export const MapPropertyComplex = Template.bind(
    {}
) as PropertyListItemChildHostStory;
MapPropertyComplex.args = {
    indexKey: '0',
    level: 1,
    propertyItem: getMockProperty({ type: 'Map', valueType: 'Complex' }),
    onUpdateSchema: () => undefined
} as IPropertyListItemChildHostProps;
