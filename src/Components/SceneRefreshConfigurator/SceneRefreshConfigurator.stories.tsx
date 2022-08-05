import React from 'react';
import { ComponentStory } from '@storybook/react';
import {
    getDefaultStoryDecorator,
    sleep
} from '../../Models/Services/StoryUtilities';
import SceneRefreshConfigurator from './SceneRefreshConfigurator';
import { ISceneRefreshConfiguratorProps } from './SceneRefreshConfigurator.types';
import { within, userEvent } from '@storybook/testing-library';
import {
    I3DScenesConfig,
    IPollingConfiguration,
    IScene
} from '../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';

const wrapperStyle = { width: '100%', height: '600px', padding: 8 };

export default {
    title: 'Components/SceneRefreshConfigurator',
    component: SceneRefreshConfigurator,
    decorators: [
        getDefaultStoryDecorator<ISceneRefreshConfiguratorProps>(wrapperStyle)
    ]
};

type SceneRefreshConfiguratorStory = ComponentStory<
    typeof SceneRefreshConfigurator
>;

const SCENE_ID = 'mock_scene_id';
const GET_SCENE_CONFIG = (
    pollingConfiguration: IPollingConfiguration
): I3DScenesConfig => ({
    $schema: {} as any,
    configuration: {
        scenes: [
            {
                id: SCENE_ID,
                pollingConfiguration: pollingConfiguration,
                ...({} as IScene)
            } as IScene
        ],
        behaviors: [],
        layers: []
    }
});

const Template: SceneRefreshConfiguratorStory = (args) => {
    return <SceneRefreshConfigurator {...args} />;
};

export const Base = Template.bind({}) as SceneRefreshConfiguratorStory;
Base.args = {
    config: GET_SCENE_CONFIG({
        pollingStrategy: 'Realtime'
    }),
    sceneId: SCENE_ID
} as ISceneRefreshConfiguratorProps;

export const OpenRealtime = Template.bind({}) as SceneRefreshConfiguratorStory;
OpenRealtime.args = Base.args;
OpenRealtime.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Finds the tabs and clicks the second one
    const button = await canvas.findByTestId('scene-configure-scene-button');
    await userEvent.click(button);
    await sleep(5);
};

export const OpenLimited = Template.bind({}) as SceneRefreshConfiguratorStory;
OpenLimited.args = {
    ...Base.args,
    config: GET_SCENE_CONFIG({
        pollingStrategy: 'Limited',
        minimumPollingFrequency: 60 * 1000
    })
};
OpenLimited.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Finds the tabs and clicks the second one
    const button = await canvas.findByTestId('scene-configure-scene-button');
    await userEvent.click(button);
    await sleep(5);
};
