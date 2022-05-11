import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../../../../../Models/Services/StoryUtilities';
import CameraControlsCalloutContent from './CameraControlsCalloutContent';
import { ICameraControlsCalloutContentProps } from './CameraControlsCalloutContent.types';
import { Stack } from '@fluentui/react';

const wrapperStyle = { width: '100%', height: '600px', padding: 8 };

export default {
    title: 'Components/CameraControls',
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

const Template: CameraControlsCalloutContentStory = (_args) => {
    return (
        <Stack tokens={{ childrenGap: 8 }}>
            Move
            <CameraControlsCalloutContent type={'Move'} />
            Orbit
            <CameraControlsCalloutContent type={'Orbit'} />
        </Stack>
    );
};

export const CalloutContent = Template.bind(
    {}
) as CameraControlsCalloutContentStory;
