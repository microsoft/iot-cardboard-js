import React from 'react';
import { ComponentStory } from '@storybook/react';
import {
    getDefaultStoryDecorator,
    sleep
} from '../../Models/Services/StoryUtilities';
import TooltipCallout from './TooltipCallout';
import { ITooltipCalloutProps } from './TooltipCallout.types';
import { DirectionalHint, Icon } from '@fluentui/react';
import { within, userEvent } from '@storybook/testing-library';

const wrapperStyle = { width: '100%', height: '600px', padding: 16 };

export default {
    title: 'Components/TooltipCallout',
    component: TooltipCallout,
    decorators: [getDefaultStoryDecorator<ITooltipCalloutProps>(wrapperStyle)]
};

type TooltipCalloutStory = ComponentStory<typeof TooltipCallout>;

const Template: TooltipCalloutStory = (args) => {
    return <TooltipCallout {...args} />;
};

export const Base = Template.bind({}) as TooltipCalloutStory;
Base.args = {
    content: {
        calloutContent: 'My message here',
        buttonAriaLabel: 'Label'
    },
    dataTestId: 'Callout-Id'
} as ITooltipCalloutProps;
Base.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // type in the search box
    const moreMenu = await canvas.findByTestId('Callout-Id');
    await userEvent.click(moreMenu);
    await sleep(1);
};

export const Overrides = Template.bind({}) as TooltipCalloutStory;
Overrides.args = {
    content: {
        calloutContent: (
            <div>
                <Icon iconName="Info" /> My text
            </div>
        ),
        iconName: 'Color',
        link: {
            text: 'My link here',
            url: 'https://www.bing.com'
        }
    },
    calloutProps: {
        directionalHint: DirectionalHint.bottomCenter
    },
    dataTestId: 'Callout-Id'
} as ITooltipCalloutProps;
Overrides.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // type in the search box
    const moreMenu = await canvas.findByTestId('Callout-Id');
    await userEvent.click(moreMenu);
    await sleep(1);
};
