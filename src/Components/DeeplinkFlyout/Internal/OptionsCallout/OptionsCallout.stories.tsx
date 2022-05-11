import React from 'react';
import { ComponentStory } from '@storybook/react';
import {
    findCalloutItemByTestId,
    getDefaultStoryDecorator
} from '../../../../Models/Services/StoryUtilities';
import OptionsCallout from './OptionsCallout';
import { IOptionsCalloutProps } from './OptionsCallout.types';
import { within, userEvent } from '@storybook/testing-library';
import { DeeplinkContextProvider } from '../../../../Models/Context';
import { GET_MOCK_DEEPLINK_STATE } from '../../../../Models/Context/DeeplinkContext/DeeplinkContext.mock';
import DeeplinkFlyout from '../../DeeplinkFlyout';
import { IDeeplinkFlyoutProps } from '../../DeeplinkFlyout.types';

const wrapperStyle = { width: '100%', height: '600px', padding: 16 };

export default {
    title: 'Components/DeeplinkFlyout/Options',
    component: OptionsCallout,
    decorators: [getDefaultStoryDecorator<IOptionsCalloutProps>(wrapperStyle)]
};

type DeeplinkFlyoutStory = ComponentStory<typeof DeeplinkFlyout>;

const Template: DeeplinkFlyoutStory = (args) => {
    return (
        <DeeplinkContextProvider initialState={GET_MOCK_DEEPLINK_STATE()}>
            <DeeplinkFlyout {...args} />
        </DeeplinkContextProvider>
    );
};

export const BaseOptions = Template.bind({}) as DeeplinkFlyoutStory;

BaseOptions.args = { mode: 'Options' } as IDeeplinkFlyoutProps;

export const OptionsFlyoutOpen = Template.bind({}) as DeeplinkFlyoutStory;

OptionsFlyoutOpen.args = { mode: 'Options' } as IDeeplinkFlyoutProps;
OptionsFlyoutOpen.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // open the menu
    const moreMenu = await canvas.findByTestId('deeplink-open-flyout');
    await userEvent.click(moreMenu);
};

export const OptionsCopyLink = Template.bind({}) as DeeplinkFlyoutStory;

OptionsCopyLink.args = { mode: 'Options' } as IDeeplinkFlyoutProps;
OptionsCopyLink.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // open the menu
    const button = await canvas.findByTestId('deeplink-open-flyout');
    await userEvent.click(button);

    // type in the search box
    const copyButton = await findCalloutItemByTestId('deeplink-copy-link');
    copyButton.click();
};
