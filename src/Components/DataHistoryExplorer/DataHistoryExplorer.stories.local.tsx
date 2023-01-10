import React from 'react';
import { getDefaultStoryDecorator } from '../../Models/Services/StoryUtilities';
import DataHistoryExplorer from './DataHistoryExplorer';
import { IDataHistoryExplorerProps } from './DataHistoryExplorer.types';
import useAuthParams from '../../../.storybook/useAuthParams';
import MsalAuthService from '../../Models/Services/MsalAuthService';
import ADTDataHistoryAdapter from '../../Adapters/ADTDataHistoryAdapter';

const wrapperStyle = { width: '100%', height: '500px' };

export default {
    title: 'Components/DataHistoryExplorer',
    component: DataHistoryExplorer,
    decorators: [
        getDefaultStoryDecorator<IDataHistoryExplorerProps>(wrapperStyle)
    ]
};

export const ADT = (args) => {
    const authenticationParameters = useAuthParams();
    return !authenticationParameters ? (
        <div></div>
    ) : (
        <DataHistoryExplorer
            {...args}
            adapter={
                new ADTDataHistoryAdapter(
                    new MsalAuthService(
                        authenticationParameters.adt.aadParameters
                    ),
                    authenticationParameters.adt.hostUrl
                )
            }
        />
    );
};
