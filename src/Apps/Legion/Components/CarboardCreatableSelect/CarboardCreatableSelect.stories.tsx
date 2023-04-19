/* eslint-disable no-console */
import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../../../Models/Services/StoryUtilities';
import CardboardCreatableSelect from './CardboardCreatableSelect';
import { ICardboardCreatableSelectProps } from './CardboardCreatableSelect.types';
import { IReactSelectOption } from '../../Models';

const wrapperStyle = { width: '500px', height: '600px', padding: 8 };

export default {
    title: 'Apps/Legion/Components/CardboardCreatableSelect',
    component: CardboardCreatableSelect,
    decorators: [
        getDefaultStoryDecorator<ICardboardCreatableSelectProps<IListItem>>(
            wrapperStyle
        )
    ]
};

type IListItem = IReactSelectOption;

type CardboardCreatableSelectStory = ComponentStory<
    typeof CardboardCreatableSelect
>;

const Template: CardboardCreatableSelectStory = (args) => {
    return <CardboardCreatableSelect {...args} />;
};

const defaultProps: Partial<ICardboardCreatableSelectProps<IListItem>> = {
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

export const Base = Template.bind({}) as CardboardCreatableSelectStory;
Base.args = {
    ...defaultProps
} as ICardboardCreatableSelectProps<IListItem>;

export const WithSelection = Template.bind({}) as CardboardCreatableSelectStory;
WithSelection.args = {
    ...defaultProps,
    selectedItem: defaultProps.options[1]
} as ICardboardCreatableSelectProps<IListItem>;

export const WithTooltip = Template.bind({}) as CardboardCreatableSelectStory;
WithTooltip.args = {
    ...defaultProps,
    tooltip: {
        content: {
            calloutContent: 'message blurb goes here'
        }
    }
} as ICardboardCreatableSelectProps<IListItem>;

export const Description = Template.bind({}) as CardboardCreatableSelectStory;
Description.args = {
    ...defaultProps,
    description: 'Message here'
} as ICardboardCreatableSelectProps<IListItem>;

export const DescriptionError = Template.bind(
    {}
) as CardboardCreatableSelectStory;
DescriptionError.args = {
    ...defaultProps,
    description: 'Error message here',
    descriptionIsError: true
} as ICardboardCreatableSelectProps<IListItem>;
