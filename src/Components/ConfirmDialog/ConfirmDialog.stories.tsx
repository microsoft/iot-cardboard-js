import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../Models/Services/StoryUtilities';
import ConfirmDialog from './ConfirmDialog';
import { IConfirmDialogProps } from './ConfirmDialog.types';

const wrapperStyle = { width: '100%', height: '600px', padding: 8 };

export default {
    title: 'Components/ConfirmDialog',
    component: ConfirmDialog,
    decorators: [getDefaultStoryDecorator<IConfirmDialogProps>(wrapperStyle)]
};

type ConfirmDialogStory = ComponentStory<typeof ConfirmDialog>;

const Template: ConfirmDialogStory = (args) => {
    return (
        <ConfirmDialog
            isOpen={true}
            onClose={() => {
                console.log('close clicked');
            }}
            onConfirm={() => {
                console.log('confirm clicked');
            }}
            title={'title goes here'}
            message={'test message'}
            {...args}
        />
    );
};

export const Base = Template.bind({}) as ConfirmDialogStory;

export const CustomButtons = Template.bind({}) as ConfirmDialogStory;
CustomButtons.args = {
    primaryButtonProps: {
        text: 'custom submit'
    },
    cancelButtonProps: {
        text: 'custom cancel',
        disabled: true
    }
} as IConfirmDialogProps;
