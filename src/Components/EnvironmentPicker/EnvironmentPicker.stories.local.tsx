import React from 'react';
import EnvironmentPicker from './EnvironmentPicker';
import useAuthParams from '../../../.storybook/useAuthParams';
import MsalAuthService from '../../Models/Services/MsalAuthService';
import AzureManagementAdapter from '../../Adapters/AzureManagementAdapter';

export default {
    title: 'Components/EnvironmentPicker',
    component: EnvironmentPicker
};

export const ADTEnvironmentPicker = (_args, { globals: { theme, locale } }) => {
    const authenticationParameters = useAuthParams();
    return !authenticationParameters ? (
        <div></div>
    ) : (
        <div style={{ width: 336 }}>
            <EnvironmentPicker
                theme={theme}
                locale={locale}
                adapter={
                    new AzureManagementAdapter(
                        new MsalAuthService(
                            authenticationParameters.adt.aadParameters
                        ),
                        authenticationParameters.adt.aadParameters.tenantId,
                        authenticationParameters.adt.aadParameters.uniqueObjectId
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
                shouldPullFromSubscription={true}
            />
        </div>
    );
};
