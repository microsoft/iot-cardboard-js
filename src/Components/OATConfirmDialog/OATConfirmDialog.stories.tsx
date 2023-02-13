import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../Models/Services/StoryUtilities';
import OATConfirmDialog from './OATConfirmDialog';
import { OatPageContextProvider } from '../../Models/Context/OatPageContext/OatPageContext';

const wrapperStyle = { width: '100%', height: '600px', padding: 8 };

export default {
    title: 'Components - OAT/OATConfirmDialog',
    component: OATConfirmDialog,
    decorators: [getDefaultStoryDecorator(wrapperStyle)]
};

type OATConfirmDialogStory = ComponentStory<typeof OATConfirmDialog>;

const Template: OATConfirmDialogStory = (args) => {
    return (
        <OatPageContextProvider
            initialState={{
                confirmDialog: {
                    open: true,
                    callback: () => console.log('confirm clicked'),
                    message:
                        'Custom message goes here and tells them not to do anything bad',
                    title: 'Are you sure?'
                }
            }}
        >
            <OATConfirmDialog {...args} />
        </OatPageContextProvider>
    );
};

export const Base = Template.bind({}) as OATConfirmDialogStory;
