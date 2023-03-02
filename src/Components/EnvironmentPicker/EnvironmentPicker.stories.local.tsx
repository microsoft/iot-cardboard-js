import React from 'react';
import EnvironmentPicker from './EnvironmentPicker';
import useAuthParams from '../../../.storybook/useAuthParams';
import MsalAuthService from '../../Models/Services/MsalAuthService';
import ADT3DSceneAdapter from '../../Adapters/ADT3DSceneAdapter';
import { EnvironmentPickerProps } from './EnvironmentPicker.types';
import { getDefaultStoryDecorator } from '../../Models/Services/StoryUtilities';

const wrapperStyle = { width: '336px' };

export default {
    title: 'Components/EnvironmentPicker',
    component: EnvironmentPicker,
    decorators: [getDefaultStoryDecorator<EnvironmentPickerProps>(wrapperStyle)]
};

export const ADTEnvironmentPicker = (_args) => {
    const authenticationParameters = useAuthParams();
    return !authenticationParameters ? (
        <div></div>
    ) : (
        <EnvironmentPicker
            adapter={
                new ADT3DSceneAdapter(
                    new MsalAuthService(
                        authenticationParameters.adt.aadParameters
                    ),
                    authenticationParameters.adt.hostUrl,
                    authenticationParameters.storage.blobContainerUrl
                )
            }
            isLocalStorageEnabled={true}
            localStorageKey={
                process.env.STORYBOOK_MOCK_ENVIRONMENTS_LOCAL_STORAGE_KEY
            }
            selectedItemLocalStorageKey={
                process.env
                    .STORYBOOK_MOCK_SELECTED_ENVIRONMENT_LOCAL_STORAGE_KEY
            }
            storage={{
                isLocalStorageEnabled: true,
                localStorageKey:
                    process.env.STORYBOOK_MOCK_CONTAINERS_LOCAL_STORAGE_KEY,
                selectedItemLocalStorageKey:
                    process.env
                        .STORYBOOK_MOCK_SELECTED_CONTAINER_LOCAL_STORAGE_KEY
            }}
        />
    );
};
