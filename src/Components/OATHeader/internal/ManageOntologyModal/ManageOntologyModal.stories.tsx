import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../../../Models/Services/StoryUtilities';
import ManageOntologyModal from './ManageOntologyModal';
import { IManageOntologyModalProps } from './ManageOntologyModal.types';

const wrapperStyle = { width: '100%', height: '600px', padding: 8 };

export default {
    title: 'Components - OAT/ManageOntologyModal',
    component: ManageOntologyModal,
    decorators: [
        getDefaultStoryDecorator<IManageOntologyModalProps>(wrapperStyle)
    ]
};

type ManageOntologyModalStory = ComponentStory<typeof ManageOntologyModal>;

const Template: ManageOntologyModalStory = (args) => {
    return <ManageOntologyModal {...args} />;
};

export const Base = Template.bind({}) as ManageOntologyModalStory;
Base.args = {
    isOpen: true,
    ontologyId: 'test -id',
    onClose: () => alert('closed')
} as IManageOntologyModalProps;
