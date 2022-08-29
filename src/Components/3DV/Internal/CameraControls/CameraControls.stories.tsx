import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../../../Models/Services/StoryUtilities';
import { CameraControlProps, CameraControls } from './CameraControls';
import { CameraInteraction } from '../../../../Models/Constants';

const wrapperStyle = { width: '100%', height: '600px', padding: 8 };

export default {
    title: 'Components/CameraControls',
    component: CameraControls,
    decorators: [getDefaultStoryDecorator<CameraControlProps>(wrapperStyle)]
};

type CameraControlsStory = ComponentStory<typeof CameraControls>;

const Template: CameraControlsStory = (args) => {
    return <CameraControls {...args} />;
};

export const Base = Template.bind({}) as CameraControlsStory;

Base.args = {
    cameraInteraction: CameraInteraction.Pan,
    onCameraInteractionChanged: () => undefined,
    onCameraZoom: () => undefined,
    onEnterVrMode: () => {
        alert('vr mode');
    }
} as CameraControlProps;
