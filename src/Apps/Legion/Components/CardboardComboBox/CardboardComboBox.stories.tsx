/* eslint-disable no-console */
import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../../../Models/Services/StoryUtilities';
import CardboardComboBoxSelect from './CardboardComboBox';
import { ICardboardComboBoxSelectProps } from './CardboardComboBox.types';
import { IReactSelectOption } from '../../Models';

const wrapperStyle = { width: '500px', height: '600px', padding: 8 };

export default {
    title: 'Apps/Legion/Components/CardboardComboBoxSelect',
    component: CardboardComboBoxSelect,
    decorators: [
        getDefaultStoryDecorator<ICardboardComboBoxSelectProps<IListItem>>(
            wrapperStyle
        )
    ]
};

type IListItem = IReactSelectOption;

type CardboardComboBoxSelectStory = ComponentStory<
    typeof CardboardComboBoxSelect
>;

const Template: CardboardComboBoxSelectStory = (args) => {
    return <CardboardComboBoxSelect {...args} />;
};

const defaultProps: Partial<ICardboardComboBoxSelectProps<IListItem>> = {
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

export const Base = Template.bind({}) as CardboardComboBoxSelectStory;
Base.args = {
    ...defaultProps
} as ICardboardComboBoxSelectProps<IListItem>;

export const WithSelection = Template.bind({}) as CardboardComboBoxSelectStory;
WithSelection.args = {
    ...defaultProps,
    selectedItem: defaultProps.options[1]
} as ICardboardComboBoxSelectProps<IListItem>;

export const WithTooltip = Template.bind({}) as CardboardComboBoxSelectStory;
WithTooltip.args = {
    ...defaultProps,
    tooltip: {
        content: {
            calloutContent: 'message blurb goes here'
        }
    }
} as ICardboardComboBoxSelectProps<IListItem>;

export const Description = Template.bind({}) as CardboardComboBoxSelectStory;
Description.args = {
    ...defaultProps,
    description: 'Message here'
} as ICardboardComboBoxSelectProps<IListItem>;

export const DescriptionError = Template.bind(
    {}
) as CardboardComboBoxSelectStory;
DescriptionError.args = {
    ...defaultProps,
    description: 'Error message here',
    descriptionIsError: true
} as ICardboardComboBoxSelectProps<IListItem>;
