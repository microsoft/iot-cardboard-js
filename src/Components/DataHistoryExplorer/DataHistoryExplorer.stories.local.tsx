import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../Models/Services/StoryUtilities';
import DataHistoryExplorer from './DataHistoryExplorer';
import { IDataHistoryExplorerProps } from './DataHistoryExplorer.types';
import { ADT3DSceneAdapter } from '../../Adapters';
import useAuthParams from '../../../.storybook/useAuthParams';
import MsalAuthService from '../../Models/Services/MsalAuthService';

const wrapperStyle = { width: '100%', height: '300px', padding: 8 };

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
                new ADT3DSceneAdapter(
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
ADTDataHistory.args = { isOpen: true } as IDataHistoryExplorerProps;
