import React from 'react';
import { ComponentStory } from '@storybook/react';
import SaveStep from './SaveStep';
import { ISaveStepProps } from './SaveStep.types';
import { getDefaultStoryDecorator } from '../../../../../../Models/Services/StoryUtilities';

const wrapperStyle = { width: '100%', height: '600px', padding: 8 };

export default {
    title: 'Apps/Legion/WizardShell/SaveStep',
    component: SaveStep,
    decorators: [getDefaultStoryDecorator<ISaveStepProps>(wrapperStyle)]
};

type SaveStepStory = ComponentStory<typeof SaveStep>;

const Template: SaveStepStory = (args) => {
    return <SaveStep {...args} />;
};

export const Base = Template.bind({}) as SaveStepStory;
Base.args = {} as ISaveStepProps;
