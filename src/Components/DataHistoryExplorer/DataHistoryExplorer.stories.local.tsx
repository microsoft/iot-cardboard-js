import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../Models/Services/StoryUtilities';
import DataHistoryExplorer from './DataHistoryExplorer';
import { IDataHistoryExplorerProps } from './DataHistoryExplorer.types';
import useAuthParams from '../../../.storybook/useAuthParams';
import MsalAuthService from '../../Models/Services/MsalAuthService';
import ADTDataHistoryAdapter from '../../Adapters/ADTDataHistoryAdapter';

const wrapperStyle = { width: '100%', height: '500px', padding: 8 };

export default {
    title: 'Components/DataHistoryExplorer',
    component: DataHistoryExplorer,
    decorators: [
        getDefaultStoryDecorator<IDataHistoryExplorerProps>(wrapperStyle)
    ]
};

type DataHistoryExplorerStory = ComponentStory<typeof DataHistoryExplorer>;

const Template: DataHistoryExplorerStory = (args) => {
    const authenticationParameters = useAuthParams();
    return !authenticationParameters ? (
        <div></div>
    ) : (
        <DataHistoryExplorer
            adapter={
                new ADTDataHistoryAdapter(
                    new MsalAuthService(
                        authenticationParameters.adt.aadParameters
                    ),
                    authenticationParameters.adt.hostUrl
                )
            }
            {...args}
        />
    );
};

export const ADTDataHistory = Template.bind({}) as DataHistoryExplorerStory;
ADTDataHistory.args = {} as IDataHistoryExplorerProps;
