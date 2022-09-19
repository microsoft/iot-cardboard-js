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
                    authenticationParameters.storage.blobContainerUrl,
                    authenticationParameters.adt.aadParameters.tenantId,
                    authenticationParameters.adt.aadParameters.uniqueObjectId
                )
            }
            isLocalStorageEnabled={true}
            storage={{
                isLocalStorageEnabled: true
            }}
        />
    );
};
