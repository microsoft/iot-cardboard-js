import React from 'react';
import { ComponentStory } from '@storybook/react';
import TwinVerificationStep from './TwinVerificationStep';
import { ITwinVerificationStepProps } from './TwinVerificationStep.types';
import { getDefaultStoryDecorator } from '../../../../../../Models/Services/StoryUtilities';

const wrapperStyle = { width: '100%', height: '600px', padding: 8 };

export default {
    title: 'Components/Apps/Legion/TwinVerificationStep',
    component: TwinVerificationStep,
    decorators: [
        getDefaultStoryDecorator<ITwinVerificationStepProps>(wrapperStyle)
    ]
};

type TwinVerificationStepStory = ComponentStory<typeof TwinVerificationStep>;

const Template: TwinVerificationStepStory = (args) => {
    return <TwinVerificationStep {...args} />;
};

export const Base = Template.bind({}) as TwinVerificationStepStory;
Base.args = {} as ITwinVerificationStepProps;
