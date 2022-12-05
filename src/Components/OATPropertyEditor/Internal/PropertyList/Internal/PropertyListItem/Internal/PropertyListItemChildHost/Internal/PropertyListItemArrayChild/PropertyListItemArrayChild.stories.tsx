import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../../../../../../../../../Models/Services/StoryUtilities';
import PropertyListItemArrayChild from './PropertyListItemArrayChild';
import { IPropertyListItemArrayChildProps } from './PropertyListItemArrayChild.types';
import { OatPageContextProvider } from '../../../../../../../../../../Models/Context/OatPageContext/OatPageContext';
import { getMockFile } from '../../../../../../../../../../Models/Context/OatPageContext/OatPageContext.mock';
import {
    DTDLArray,
    DTDLObject,
    DTDLObjectField
} from '../../../../../../../../../../Models/Classes/DTDL';

const wrapperStyle = { width: '100%', height: '600px', padding: 8 };

export default {
    title:
        'Components - OAT/OATPropertyEditor/PropertyList/PropertyListItem/PropertyListItemChildHost/PropertyListItemArrayChild',
    component: PropertyListItemArrayChild,
    decorators: [
        getDefaultStoryDecorator<IPropertyListItemArrayChildProps>(wrapperStyle)
    ]
};

type PropertyListItemArrayChildStory = ComponentStory<
    typeof PropertyListItemArrayChild
>;

const Template: PropertyListItemArrayChildStory = (args) => {
    return (
        <OatPageContextProvider
            disableLocalStorage={true}
            initialState={{
                ontologyFiles: [getMockFile(0, '123', '234')]
            }}
        >
            <PropertyListItemArrayChild {...args} />
        </OatPageContextProvider>
    );
};

export const Primitive = Template.bind({}) as PropertyListItemArrayChildStory;
Primitive.args = {
    level: 1,
    item: 'boolean'
} as IPropertyListItemArrayChildProps;

export const Complex = Template.bind({}) as PropertyListItemArrayChildStory;
Complex.args = {
    level: 1,
    item: new DTDLArray(
        '',
        new DTDLObject('', [
            new DTDLObjectField('property 1', 'boolean'),
            new DTDLObjectField('property 2', 'string')
        ])
    )
} as IPropertyListItemArrayChildProps;
