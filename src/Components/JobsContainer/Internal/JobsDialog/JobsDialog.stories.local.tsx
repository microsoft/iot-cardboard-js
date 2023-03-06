import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../../../Models/Services/StoryUtilities';
import JobsDialog from './JobsDialog';
import { IJobsDialogProps } from './JobsDialog.types';
import JobsAdapter from '../../../../Adapters/JobsAdapter';
import MsalAuthService from '../../../../Models/Services/MsalAuthService';
import useAuthParams from './../../../../../.storybook/useAuthParams';

const wrapperStyle = { width: '100%', height: '600px', padding: 8 };

export default {
    title: 'Components-Jobs/Jobs/JobsDialog',
    component: JobsDialog,
    decorators: [getDefaultStoryDecorator<IJobsDialogProps>(wrapperStyle)]
};

type JobsDialogStory = ComponentStory<typeof JobsDialog>;

const Template: JobsDialogStory = (args) => {
    const authenticationParameters = useAuthParams();

    return !authenticationParameters ? (
        <div></div>
    ) : (
        <JobsDialog
            {...args}
            adapter={
                new JobsAdapter(
                    authenticationParameters.adt.hostUrl,
                    new MsalAuthService(
                        authenticationParameters.adt.aadParameters
                    ),
                    authenticationParameters.adt.aadParameters.tenantId,
                    authenticationParameters.adt.aadParameters.uniqueObjectId
                )
            }
        />
    );
};

export const jobsDialog = Template.bind({}) as JobsDialogStory;
jobsDialog.args = {
    isOpen: true
} as IJobsDialogProps;
