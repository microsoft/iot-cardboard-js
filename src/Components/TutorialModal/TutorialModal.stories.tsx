import React, { useState } from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../Models/Services/StoryUtilities';
import TutorialModal from './TutorialModal';
import { ITutorialModalProps } from './TutorialModal.types';
import { PrimaryButton } from '@fluentui/react';

const wrapperStyle = { width: '100%', height: '600px', padding: 8 };

export default {
    title: 'Components/TutorialModal',
    component: TutorialModal,
    decorators: [getDefaultStoryDecorator<ITutorialModalProps>(wrapperStyle)]
};

type TutorialModalStory = ComponentStory<typeof TutorialModal>;

const Template: TutorialModalStory = (args) => {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <>
            <PrimaryButton onClick={() => setIsOpen(true)}>
                Open modal
            </PrimaryButton>
            <TutorialModal
                isOpen={isOpen}
                onDismiss={() => setIsOpen(false)}
                {...args}
            />
        </>
    );
};

export const Base = Template.bind({}) as TutorialModalStory;

Base.args = {} as ITutorialModalProps;
