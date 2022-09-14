import React from 'react';
import { ComponentStory } from '@storybook/react';
import {
    getDefaultStoryDecorator,
    selectReactSelectOption
} from '../../Models/Services/StoryUtilities';
import AdvancedSearch from './AdvancedSearch';
import { IAdvancedSearchProps } from './AdvancedSearch.types';
import MockAdapter from '../../Adapters/MockAdapter';
import { queryAllowedPropertyValueTypes } from './Internal/QueryBuilder/QueryBuilder.types';

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
    onTwinIdSelect: (selectedTwin: string) => {
        alert(`Selected twin: ${selectedTwin}`);
    },
    adapter: new MockAdapter(),
    allowedPropertyValueTypes: queryAllowedPropertyValueTypes,
    theme: null
} as IAdvancedSearchProps;
Base.storyName = 'Mock Base';

const sharedArgs = {
    isOpen: true,
    onDismiss: () => {
        return;
    },
    onTwinIdSelect: (selectedTwin: string) => {
        alert(`Selected twin: ${selectedTwin}`);
    },
    adapter: new MockAdapter(),
    allowedPropertyValueTypes: queryAllowedPropertyValueTypes,
    theme: null
} as IAdvancedSearchProps;

export const NumericalDropdown = Template.bind({});
NumericalDropdown.args = sharedArgs;
NumericalDropdown.play = async () => {
    // Click on a numerical option
    await selectReactSelectOption('AdvancedSearch-propertySelectInput', 0);
};
NumericalDropdown.storyName = 'Mock Numerical dropdown';

export const BooleanDropdown = Template.bind({});
BooleanDropdown.args = sharedArgs;
BooleanDropdown.play = async () => {
    // Click on a boolean typed option
    await selectReactSelectOption('AdvancedSearch-propertySelectInput', 4);
};
BooleanDropdown.storyName = 'Mock Boolean dropdown';

export const StringDropdown = Template.bind({});
StringDropdown.args = sharedArgs;
StringDropdown.play = async () => {
    // Click on a string typed option
    await selectReactSelectOption('AdvancedSearch-propertySelectInput', 9);
};
StringDropdown.storyName = 'Mock String dropdown';
