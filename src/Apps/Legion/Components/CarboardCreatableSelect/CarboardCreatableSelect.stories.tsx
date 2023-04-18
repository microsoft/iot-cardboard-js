/* eslint-disable no-console */
import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../../../Models/Services/StoryUtilities';
import CarboardCreatableSelect from './CarboardCreatableSelect';
import { ICarboardCreatableSelectProps } from './CarboardCreatableSelect.types';
import { IReactSelectOption } from '../../Models';

const wrapperStyle = { width: '500px', height: '600px', padding: 8 };

export default {
    title: 'Apps/Legion/Components/CarboardCreatableSelect',
    component: CarboardCreatableSelect,
    decorators: [
        getDefaultStoryDecorator<ICarboardCreatableSelectProps<IListItem>>(
            wrapperStyle
        )
    ]
};

type IListItem = IReactSelectOption;

type CarboardCreatableSelectStory = ComponentStory<
    typeof CarboardCreatableSelect
>;

const Template: CarboardCreatableSelectStory = (args) => {
    return <CarboardCreatableSelect {...args} />;
};

const defaultProps: Partial<ICarboardCreatableSelectProps<IListItem>> = {
    label: 'My picker',
    onSelectionChange: (item, isNew) => {
        console.log('Selection made. {item, isNew}', item, isNew);
    },
    options: [
        {
            label: 'option 1',
            value: '1',
            __isNew__: false
        },
        {
            label: 'option 2',
            value: '2',
            __isNew__: false
        },
        {
            label: 'option 3',
            value: '3',
            __isNew__: false
        }
    ],
    placeholder: 'Select a value',
    selectedItem: undefined,
    required: true
};

export const Base = Template.bind({}) as CarboardCreatableSelectStory;
Base.args = {
    ...defaultProps
} as ICarboardCreatableSelectProps<IListItem>;

export const WithSelection = Template.bind({}) as CarboardCreatableSelectStory;
WithSelection.args = {
    ...defaultProps,
    selectedItem: defaultProps.options[1]
} as ICarboardCreatableSelectProps<IListItem>;

export const WithTooltip = Template.bind({}) as CarboardCreatableSelectStory;
WithTooltip.args = {
    ...defaultProps,
    tooltip: {
        content: {
            calloutContent: 'message blurb goes here'
        }
    }
} as ICarboardCreatableSelectProps<IListItem>;

export const Description = Template.bind({}) as CarboardCreatableSelectStory;
Description.args = {
    ...defaultProps,
    description: 'Message here'
} as ICarboardCreatableSelectProps<IListItem>;

export const DescriptionError = Template.bind(
    {}
) as CarboardCreatableSelectStory;
DescriptionError.args = {
    ...defaultProps,
    description: 'Error message here',
    descriptionIsError: true
} as ICarboardCreatableSelectProps<IListItem>;
