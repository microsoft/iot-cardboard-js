import React from 'react';
import EnvironmentPicker from './EnvironmentPicker';
import useAuthParams from '../../../.storybook/useAuthParams';
import ADTAdapter from '../../Adapters/ADTAdapter';
import MsalAuthService from '../../Models/Services/MsalAuthService';

export default {
    title: 'Components/EnvironmentPicker'
};

export const ADTEnvironmentPicker = (_args, { globals: { theme, locale } }) => {
    const authenticationParameters = useAuthParams();
    return !authenticationParameters ? (
        <div></div>
    ) : (
        <div style={{ width: 300, height: 400 }}>
            <EnvironmentPicker
                theme={theme}
                locale={locale}
                adapter={
                    new ADTAdapter(
                        authenticationParameters.adt.hostUrl,
                        new MsalAuthService(
                            authenticationParameters.adt.aadParameters
                        )
                    )
                }
                isLocalStorageEnabled={true}
                localStorageKey="adtEnvironments"
                selectedItemLocalStorageKey="selectedAdtEnvironment"
                storage={{
                    isLocalStorageEnabled: true,
                    localStorageKey: 'storageContainers',
                    selectedItemLocalStorageKey: 'selectedStorageContainer'
                }}
            />
        </div>
    );
};
