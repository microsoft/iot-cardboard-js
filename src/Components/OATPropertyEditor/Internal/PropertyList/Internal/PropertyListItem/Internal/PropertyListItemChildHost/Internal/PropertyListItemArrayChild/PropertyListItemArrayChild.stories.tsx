import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../../../../../../../../../Models/Services/StoryUtilities';
import PropertyListItemArrayChild from './PropertyListItemArrayChild';
import { IPropertyListItemArrayChildProps } from './PropertyListItemArrayChild.types';
import { OatPageContextProvider } from '../../../../../../../../../../Models/Context/OatPageContext/OatPageContext';
import { getMockFile } from '../../../../../../../../../../Models/Context/OatPageContext/OatPageContext.mock';

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

export const Base = Template.bind({}) as PropertyListItemArrayChildStory;
Base.args = {
    item: 'boolean'
} as IPropertyListItemArrayChildProps;
