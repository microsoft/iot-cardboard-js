import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../../../../../../../../../Models/Services/StoryUtilities';
import PropertyListItemMapChild from './PropertyListItemMapChild';
import { IPropertyListItemMapChildProps } from './PropertyListItemMapChild.types';
import { OatPageContextProvider } from '../../../../../../../../../../Models/Context/OatPageContext/OatPageContext';
import { getMockFile } from '../../../../../../../../../../Models/Context/OatPageContext/OatPageContext.mock';
import {
    DTDLMap,
    DTDLMapKey,
    DTDLMapValue,
    DTDLObject,
    DTDLObjectField
} from '../../../../../../../../../../Models/Classes/DTDL';

const wrapperStyle = { width: '100%', height: '600px', padding: 8 };

export default {
    title:
        'Components - OAT/OATPropertyEditor/PropertyList/PropertyListItem/PropertyListItemChildHost/PropertyListItemMapChild',
    component: PropertyListItemMapChild,
    decorators: [
        getDefaultStoryDecorator<IPropertyListItemMapChildProps>(wrapperStyle)
    ]
};

type PropertyListItemMapChildStory = ComponentStory<
    typeof PropertyListItemMapChild
>;

const Template: PropertyListItemMapChildStory = (args) => {
    return (
        <OatPageContextProvider
            disableLocalStorage={true}
            initialState={{
                ontologyFiles: [getMockFile(0, '123', '234')]
            }}
        >
            <PropertyListItemMapChild {...args} />
        </OatPageContextProvider>
    );
};

export const Primitive = Template.bind({}) as PropertyListItemMapChildStory;
Primitive.args = {
    item: new DTDLMap(
        '',
        new DTDLMapKey('key name'),
        new DTDLMapValue('value 1', 'double')
    ),
    indexKey: '',
    level: 1
} as IPropertyListItemMapChildProps;

export const Complex = Template.bind({}) as PropertyListItemMapChildStory;
Complex.args = {
    level: 1,
    item: new DTDLMap(
        'test map 1',
        new DTDLMapKey('map key 1'),
        new DTDLMapValue(
            'value 1',
            new DTDLObject([
                new DTDLObjectField('prop 1', 'double'),
                new DTDLObjectField(
                    'prop 2',
                    new DTDLObject([new DTDLObjectField('my double', 'double')])
                ),
                new DTDLObjectField('prop 3', 'string')
            ])
        )
    )
} as IPropertyListItemMapChildProps;
