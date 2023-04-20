/* eslint-disable no-console */
import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../../../Models/Services/StoryUtilities';
import CardboardComboBox from './CardboardComboBox';
import { ICardboardComboBoxProps } from './CardboardComboBox.types';
import { IReactSelectOption } from '../../Models';

const wrapperStyle = { width: '500px', height: '600px', padding: 8 };

export default {
    title: 'Apps/Legion/Components/CardboardComboBoxSelect',
    component: CardboardComboBox,
    decorators: [
        getDefaultStoryDecorator<ICardboardComboBoxProps<IListItem>>(
            wrapperStyle
        )
    ]
};

type IListItem = IReactSelectOption;

type CardboardComboBoxSelectStory = ComponentStory<typeof CardboardComboBox>;

const Template: CardboardComboBoxSelectStory = (args) => {
    return <CardboardComboBox {...args} />;
};

const defaultProps: Partial<ICardboardComboBoxProps<IListItem>> = {
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
} as ICardboardComboBoxProps<IListItem>;

export const WithSelection = Template.bind({}) as CardboardComboBoxSelectStory;
WithSelection.args = {
    ...defaultProps,
    selectedItem: defaultProps.options[1]
} as ICardboardComboBoxProps<IListItem>;

export const WithTooltip = Template.bind({}) as CardboardComboBoxSelectStory;
WithTooltip.args = {
    ...defaultProps,
    tooltip: {
        content: {
            calloutContent: 'message blurb goes here'
        }
    }
} as ICardboardComboBoxProps<IListItem>;

export const Description = Template.bind({}) as CardboardComboBoxSelectStory;
Description.args = {
    ...defaultProps,
    description: 'Message here'
} as ICardboardComboBoxProps<IListItem>;

export const DescriptionError = Template.bind(
    {}
) as CardboardComboBoxSelectStory;
DescriptionError.args = {
    ...defaultProps,
    description: 'Error message here',
    descriptionIsError: true
} as ICardboardComboBoxProps<IListItem>;

export const Dropdown = Template.bind({}) as CardboardComboBoxSelectStory;
Dropdown.args = {
    ...defaultProps,
    isCreatable: false
} as ICardboardComboBoxProps<IListItem>;

export const WithSpinner = Template.bind({}) as CardboardComboBoxSelectStory;
WithSpinner.args = {
    ...defaultProps,
    isSpinnerVisible: true,
    spinnerLabel: 'Something is in progress...'
} as ICardboardComboBoxProps<IListItem>;
