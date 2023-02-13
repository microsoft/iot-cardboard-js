import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../../../Models/Services/StoryUtilities';
import ManageOntologyModal from './ManageOntologyModal';
import { IManageOntologyModalProps } from './ManageOntologyModal.types';
import { OatPageContextProvider } from '../../../../Models/Context/OatPageContext/OatPageContext';

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
    return (
        <OatPageContextProvider
            initialState={{
                currentOntologyDefaultPath: 'testNamespace',
                currentOntologyProjectName: 'my test project'
            }}
        >
            <ManageOntologyModal {...args} />
        </OatPageContextProvider>
    );
};

export const Create = Template.bind({}) as ManageOntologyModalStory;
Create.args = {
    isOpen: true,
    ontologyId: '',
    onClose: () => alert('closed')
} as IManageOntologyModalProps;

export const Edit = Template.bind({}) as ManageOntologyModalStory;
Edit.args = {
    isOpen: true,
    ontologyId: 'test -id',
    onClose: () => alert('closed')
} as IManageOntologyModalProps;
