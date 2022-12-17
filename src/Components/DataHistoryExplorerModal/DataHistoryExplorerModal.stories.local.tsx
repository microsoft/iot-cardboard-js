import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../Models/Services/StoryUtilities';
import useAuthParams from '../../../.storybook/useAuthParams';
import MsalAuthService from '../../Models/Services/MsalAuthService';
import ADTDataHistoryAdapter from '../../Adapters/ADTDataHistoryAdapter';
import { IDataHistoryExplorerModalProps } from './DataHistoryExplorerModal.types';
import DataHistoryExplorerModal from './DataHistoryExplorerModal';

const wrapperStyle = { width: '100%', height: '300px', padding: 8 };

export default {
    title: 'Components/DataHistoryExplorerModal',
    component: DataHistoryExplorerModal,
    decorators: [
        getDefaultStoryDecorator<IDataHistoryExplorerModalProps>(wrapperStyle)
    ]
};

type DataHistoryExplorerModalStory = ComponentStory<
    typeof DataHistoryExplorerModal
>;

const Template: DataHistoryExplorerModalStory = (args) => {
    const authenticationParameters = useAuthParams();
    return !authenticationParameters ? (
        <div></div>
    ) : (
        <DataHistoryExplorerModal
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

export const ADT = Template.bind({}) as DataHistoryExplorerModalStory;
ADT.args = { isOpen: true } as IDataHistoryExplorerModalProps;
