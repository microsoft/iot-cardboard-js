import React from 'react';
import { ComponentStory } from '@storybook/react';
import {
    getDefaultStoryDecorator,
    sleep
} from '../../Models/Services/StoryUtilities';
import HeaderControlButtonWithCallout from './HeaderControlButtonWithCallout';
import { IHeaderControlButtonWithCalloutProps } from './HeaderControlButtonWithCallout.types';
import { userEvent, within } from '@storybook/testing-library';

const wrapperStyle = { width: '100%', height: '600px', padding: 8 };

export default {
    title: 'Components/HeaderControlButtonWithCallout',
    component: HeaderControlButtonWithCallout,
    decorators: [
        getDefaultStoryDecorator<IHeaderControlButtonWithCalloutProps>(
            wrapperStyle
        )
    ]
};

type HeaderControlButtonWithCalloutStory = ComponentStory<
    typeof HeaderControlButtonWithCallout
>;

const Template: HeaderControlButtonWithCalloutStory = (args) => {
    return (
        <HeaderControlButtonWithCallout {...args}>
            Content to show in the callout
        </HeaderControlButtonWithCallout>
    );
};

export const Base = Template.bind({}) as HeaderControlButtonWithCalloutStory;
Base.args = {
    buttonProps: {
        iconName: 'Color',
        testId: 'TestButtonId',
        title: 'Button title'
    },
    calloutProps: {
        iconName: 'Color',
        title: 'Callout title'
    }
} as IHeaderControlButtonWithCalloutProps;

export const Clicked = Template.bind({}) as HeaderControlButtonWithCalloutStory;
Clicked.args = Base.args;
Clicked.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Finds the tabs and clicks the second one
    const button = await canvas.findByTestId('TestButtonId');
    await userEvent.click(button);
    await sleep(5);
};
