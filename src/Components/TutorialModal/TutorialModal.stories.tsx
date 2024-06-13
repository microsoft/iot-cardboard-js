import React, { useState } from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../Models/Services/StoryUtilities';
import TutorialModal from './TutorialModal';
import { ITutorialModalProps, TutorialModalPage } from './TutorialModal.types';
import { PrimaryButton } from '@fluentui/react';

const wrapperStyle = { width: '100%', height: '100vh', padding: 8 };

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

export const FirstRunExperience = Template.bind({}) as TutorialModalStory;
FirstRunExperience.args = {} as ITutorialModalProps;
FirstRunExperience.storyName = 'First-run experience';

export const CustomPageEntry = Template.bind({}) as TutorialModalStory;
CustomPageEntry.args = {
    defaultPageKey: TutorialModalPage.CONCEPTS
} as ITutorialModalProps;
CustomPageEntry.storyName = 'Custom page entry';
