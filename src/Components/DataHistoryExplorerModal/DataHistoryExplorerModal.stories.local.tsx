import React from 'react';
import { getDefaultStoryDecorator } from '../../Models/Services/StoryUtilities';
import useAuthParams from '../../../.storybook/useAuthParams';
import MsalAuthService from '../../Models/Services/MsalAuthService';
import ADTDataHistoryAdapter from '../../Adapters/ADTDataHistoryAdapter';
import { IDataHistoryExplorerModalProps } from './DataHistoryExplorerModal.types';
import DataHistoryExplorerModal from './DataHistoryExplorerModal';

const wrapperStyle = { width: '100%', height: '300px', padding: 8 };

export default {
    title: 'Components/DataHistoryExplorer/Modal',
    component: DataHistoryExplorerModal,
    decorators: [
        getDefaultStoryDecorator<IDataHistoryExplorerModalProps>(wrapperStyle)
    ]
};

export const ADT = (args) => {
    const authenticationParameters = useAuthParams();
    return !authenticationParameters ? (
        <div></div>
    ) : (
        <DataHistoryExplorerModal
            {...args}
            adapter={
                new ADTDataHistoryAdapter(
                    new MsalAuthService(
                        authenticationParameters.adt.aadParameters
                    ),
                    authenticationParameters.adt.hostUrl
                )
            }
            isOpen={true}
        />
    );
};
