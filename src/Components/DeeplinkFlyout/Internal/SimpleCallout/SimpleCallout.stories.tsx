import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../../../Models/Services/StoryUtilities';
import SimpleCallout from './SimpleCallout';
import { ISimpleCalloutProps } from './SimpleCallout.types';
import { within, userEvent } from '@storybook/testing-library';
import { DeeplinkContextProvider } from '../../../../Models/Context';
import { GET_MOCK_DEEPLINK_STATE } from '../../../../Models/Context/DeeplinkContext/DeeplinkContext.mock';
import DeeplinkFlyout from '../../DeeplinkFlyout';
import { IDeeplinkFlyoutProps } from '../../DeeplinkFlyout.types';

const wrapperStyle = { width: '100%', height: '600px', padding: 16 };

export default {
    title: 'Components/DeeplinkFLyout/Simple',
    component: SimpleCallout,
    decorators: [getDefaultStoryDecorator<ISimpleCalloutProps>(wrapperStyle)]
};

type DeeplinkFlyoutStory = ComponentStory<typeof DeeplinkFlyout>;

const Template: DeeplinkFlyoutStory = (args) => {
    return (
        <DeeplinkContextProvider initialState={GET_MOCK_DEEPLINK_STATE()}>
            <DeeplinkFlyout {...args} />
        </DeeplinkContextProvider>
    );
};

export const BaseSimple = Template.bind({}) as DeeplinkFlyoutStory;

BaseSimple.args = { mode: 'Simple' } as IDeeplinkFlyoutProps;

export const BaseClicked = Template.bind({}) as DeeplinkFlyoutStory;

BaseClicked.args = { mode: 'Simple' } as IDeeplinkFlyoutProps;

BaseClicked.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // open the menu
    const moreMenu = await canvas.findByTestId('deeplink-open-flyout');
    await userEvent.click(moreMenu);
};
