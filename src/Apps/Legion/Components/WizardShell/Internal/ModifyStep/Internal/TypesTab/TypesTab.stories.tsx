import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../../../../../../../Models/Services/StoryUtilities';
import TypesTab from './TypesTab';
import { ITypesTabProps } from './TypesTab.types';

const wrapperStyle = { width: '100%', height: '600px', padding: 8 };

export default {
    title: 'Apps/Legion/TypesTab',
    component: TypesTab,
    decorators: [getDefaultStoryDecorator<ITypesTabProps>(wrapperStyle)]
};

type TypesTabStory = ComponentStory<typeof TypesTab>;

const Template: TypesTabStory = (args) => {
    return <TypesTab {...args} />;
};

export const Base = Template.bind({}) as TypesTabStory;
Base.args = {} as ITypesTabProps;
