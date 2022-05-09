import React from 'react';
import { ComponentStory } from '@storybook/react';
import {
    findCalloutItemByTestId,
    getDefaultStoryDecorator
} from '../../Models/Services/StoryUtilities';
import DeeplinkFlyout from './DeeplinkFlyout';
import { IDeeplinkFlyoutProps } from './DeeplinkFlyout.types';
import { userEvent, within } from '@storybook/testing-library';
import { DeeplinkContextProvider } from '../../Models/Context/DeeplinkContext';
import { GET_MOCK_DEEPLINK_STATE } from '../../Models/Context/DeeplinkContext.mock';

const wrapperStyle = { width: '100%', height: '600px', padding: 16 };

export default {
    title: 'Components/DeeplinkFlyout',
    component: DeeplinkFlyout,
    decorators: [getDefaultStoryDecorator<IDeeplinkFlyoutProps>(wrapperStyle)]
};

type DeeplinkFlyoutStory = ComponentStory<typeof DeeplinkFlyout>;

const Template: DeeplinkFlyoutStory = (args) => {
    return (
        <DeeplinkContextProvider initialState={GET_MOCK_DEEPLINK_STATE()}>
            <DeeplinkFlyout {...args} />
        </DeeplinkContextProvider>
    );
};

export const Base = Template.bind({}) as DeeplinkFlyoutStory;

Base.args = {};

export const FlyoutOpen = Template.bind({}) as DeeplinkFlyoutStory;

FlyoutOpen.args = {};
FlyoutOpen.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // open the menu
    const moreMenu = await canvas.findByTestId('deeplink-open-flyout');
    await userEvent.click(moreMenu);
};

export const CopyLink = Template.bind({}) as DeeplinkFlyoutStory;

CopyLink.args = {};
CopyLink.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // open the menu
    const button = await canvas.findByTestId('deeplink-open-flyout');
    await userEvent.click(button);

    // type in the search box
    const copyButton = await findCalloutItemByTestId('deeplink-copy-link');
    copyButton.click();
};
