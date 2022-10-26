import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../Models/Services/StoryUtilities';
import OATLeftFloatingControls from './OATLeftFloatingControls';
import { IOATLeftFloatingControlsProps } from './OATLeftFloatingControls.types';

const wrapperStyle = { width: '100%', height: '600px', padding: 8 };

export default {
    title: 'Components - OAT/OATLeftFloatingControls',
    component: OATLeftFloatingControls,
    decorators: [
        getDefaultStoryDecorator<IOATLeftFloatingControlsProps>(wrapperStyle)
    ]
};

type OATLeftFloatingControlsStory = ComponentStory<
    typeof OATLeftFloatingControls
>;

const Template: OATLeftFloatingControlsStory = (args) => {
    return <OATLeftFloatingControls {...args} />;
};

export const Base = Template.bind({}) as OATLeftFloatingControlsStory;
Base.args = {} as IOATLeftFloatingControlsProps;
