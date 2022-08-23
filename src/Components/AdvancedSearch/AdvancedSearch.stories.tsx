import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../Models/Services/StoryUtilities';
import AdvancedSearchModal from './AdvancedSearchModal';
import { IAdvancedSearchProps } from './AdvancedSearch.types';
import MockAdapter from '../../Adapters/MockAdapter';

const wrapperStyle = { width: '100%', height: '100vh', padding: 8 };

export default {
    title: 'Components/AdvancedSearch',
    component: AdvancedSearchModal,
    decorators: [getDefaultStoryDecorator<IAdvancedSearchProps>(wrapperStyle)]
};

type AdvancedSearchStory = ComponentStory<any>;

const Template: AdvancedSearchStory = (args: IAdvancedSearchProps) => {
    return <AdvancedSearchModal {...args} />;
};

export const Base = Template.bind({}) as AdvancedSearchStory;
Base.args = {
    isOpen: true,
    onDismiss: () => {
        return;
    },
    adapter: new MockAdapter(),
    allowedPropertyValueTypes: [
        'string',
        'boolean',
        'float',
        'integer',
        'double',
        'long'
    ]
} as IAdvancedSearchProps;
