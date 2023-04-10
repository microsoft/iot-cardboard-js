/* eslint-disable no-console */
import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../../../Models/Services/StoryUtilities';
import StoreFormModal from './StoreFormModal';
import { IStoreFormModalProps } from './StoreFormModal.types';

const wrapperStyle = { width: '100%', height: '600px', padding: 8 };

export default {
    title: 'Components/StoreFormModal',
    component: StoreFormModal,
    decorators: [getDefaultStoryDecorator<IStoreFormModalProps>(wrapperStyle)]
};

type StoreFormModalStory = ComponentStory<typeof StoreFormModal>;

const Template: StoreFormModalStory = (args) => {
    return <StoreFormModal {...args} />;
};

export const Base = Template.bind({}) as StoreFormModalStory;
Base.args = {
    isOpen: true,
    onConfirm: (args) => {
        console.log('OnConfirm', args);
    },
    onDismiss: () => {
        console.log('OnDismiss');
    }
} as IStoreFormModalProps;
