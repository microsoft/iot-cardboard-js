import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../../../Models/Services/StoryUtilities';
import PropertyList from './PropertyList';
import { IPropertyListProps } from './PropertyList.types';
import { OatPageContextProvider } from '../../../../Models/Context/OatPageContext/OatPageContext';
import { getMockFile } from '../../../../Models/Context/OatPageContext/OatPageContext.mock';
import { getMockProperty } from '../../../../Models/Services/OatTestUtils';
import { DTDLEnum } from '../../../../Models/Classes/DTDL';

const wrapperStyle = { width: '100%', height: '900px', padding: 8 };

export default {
    title: 'Components - OAT/OATPropertyEditor/PropertyList',
    component: PropertyList,
    decorators: [getDefaultStoryDecorator<IPropertyListProps>(wrapperStyle)]
};

type PropertyListStory = ComponentStory<typeof PropertyList>;

const Template: PropertyListStory = (args) => {
    return (
        <OatPageContextProvider
            disableLocalStorage={true}
            initialState={{
                ontologyFiles: [getMockFile(0, '123', '234')]
            }}
        >
            <PropertyList {...args} />
        </OatPageContextProvider>
    );
};

export const Base = Template.bind({}) as PropertyListStory;
Base.args = {
    arePropertiesSupported: true,
    parentEntity: {},
    properties: [
        getMockProperty({ type: 'date' }),
        getMockProperty({ type: 'double' }),
        getMockProperty({ type: 'duration' }),
        getMockProperty({ type: 'Object' }),
        getMockProperty({ type: 'Object' }),
        getMockProperty({ type: 'Enum', enumType: 'integer' }),
        getMockProperty({ type: 'Map' }),
        getMockProperty({ type: 'Array', itemSchema: 'double' }),
        getMockProperty({
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
    ]
} as IPropertyListProps;
