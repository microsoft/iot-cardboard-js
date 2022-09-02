import React from 'react';
import { ComponentStory } from '@storybook/react';
import {
    getDefaultStoryDecorator,
    selectReactSelectOption
} from '../../Models/Services/StoryUtilities';
import AdvancedSearch from './AdvancedSearch';
import { IAdvancedSearchProps } from './AdvancedSearch.types';
import MockAdapter from '../../Adapters/MockAdapter';

const wrapperStyle = { width: '100%', height: '100vh', padding: 8 };

export default {
    title: 'Components/AdvancedSearch',
    component: AdvancedSearch,
    decorators: [getDefaultStoryDecorator<IAdvancedSearchProps>(wrapperStyle)]
};

type AdvancedSearchStory = ComponentStory<typeof AdvancedSearch>;

const Template: AdvancedSearchStory = (args: IAdvancedSearchProps) => {
    return <AdvancedSearch {...args} />;
};

export const Base = Template.bind({});
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
    ],
    theme: null
} as IAdvancedSearchProps;

const sharedArgs = {
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
    ],
    theme: null
} as IAdvancedSearchProps;

export const NumericalDropdown = Template.bind({});
NumericalDropdown.args = sharedArgs;
NumericalDropdown.play = async () => {
    // CLick on a numerical option
    selectReactSelectOption('AdvancedSearch-propertySelectInput', 0);
};

export const BooleanDropdown = Template.bind({});
BooleanDropdown.args = sharedArgs;
BooleanDropdown.play = async () => {
    // CLick on a boolean typed option
    selectReactSelectOption('AdvancedSearch-propertySelectInput', 4);
};

export const StringDropdown = Template.bind({});
StringDropdown.args = sharedArgs;
StringDropdown.play = async () => {
    // Click on a string typed option
    selectReactSelectOption('AdvancedSearch-propertySelectInput', 9);
};
