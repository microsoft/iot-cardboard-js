import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../Models/Services/StoryUtilities';
import JobsPage from './JobsPage';
import { IJobsPageProps } from './JobsPage.types';
import JobAdapter from '../../Adapters/JobAdapter';
import useAuthParams from '../../../.storybook/useAuthParams';
import MsalAuthService from '../../Models/Services/MsalAuthService';

const wrapperStyle = { width: '100%', height: '600px', padding: 8 };

export default {
    title: 'Pages/JobsPage',
    component: JobsPage,
    decorators: [getDefaultStoryDecorator<IJobsPageProps>(wrapperStyle)]
};

type JobsPageStory = ComponentStory<typeof JobsPage>;

const Template: JobsPageStory = (args) => {
    const authenticationParameters = useAuthParams();

    return !authenticationParameters ? (
        <div></div>
    ) : (
        <JobsPage
            adapter={
                new JobAdapter(
                    authenticationParameters.adt.hostUrl,
                    new MsalAuthService(
                        authenticationParameters.adt.aadParameters
                    )
                )
            }
            {...args}
        />
    );
};

export const fullJobsPage = Template.bind({}) as JobsPageStory;
fullJobsPage.args = {
    adtInstanceUrl:
        'https://mockADTInstanceResourceName.api.wcus.digitaltwins.azure.net'
} as IJobsPageProps;
