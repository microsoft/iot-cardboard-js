import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../Models/Services/StoryUtilities';
import AdvancedSearchModal from './AdvancedSearchModal';
import { IAdvancedSearchProps } from './AdvancedSearch.types';

const wrapperStyle = { width: '100%', height: '100vh', padding: 8 };

export default {
    title: 'Components/AdvancedSearch',
    component: AdvancedSearchModal,
    decorators: [getDefaultStoryDecorator<IAdvancedSearchProps>(wrapperStyle)]
};

type AdvancedSearchStory = ComponentStory<typeof AdvancedSearchModal>;

const Template: AdvancedSearchStory = (args) => {
    return <AdvancedSearchModal {...args} />;
};

export const Base = Template.bind({}) as AdvancedSearchStory;
Base.args = {
    isOpen: true
} as IAdvancedSearchProps;
