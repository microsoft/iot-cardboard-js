import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../../../../../Models/Services/StoryUtilities';
import CameraControlsCalloutContent from './CameraControlsCalloutContent';
import { ICameraControlsCalloutContentProps } from './CameraControlsCalloutContent.types';

const wrapperStyle = { width: '100%', height: '600px' };

export default {
    title: 'Components/CameraControls/CalloutContent',
    component: CameraControlsCalloutContent,
    decorators: [
        getDefaultStoryDecorator<ICameraControlsCalloutContentProps>(
            wrapperStyle
        )
    ]
};

type CameraControlsCalloutContentStory = ComponentStory<
    typeof CameraControlsCalloutContent
>;

const Template: CameraControlsCalloutContentStory = (args) => {
    return <CameraControlsCalloutContent {...args} />;
};

export const Move = Template.bind({}) as CameraControlsCalloutContentStory;

Move.args = { type: 'Move' } as ICameraControlsCalloutContentProps;

export const Orbit = Template.bind({}) as CameraControlsCalloutContentStory;

Orbit.args = { type: 'Orbit' } as ICameraControlsCalloutContentProps;
