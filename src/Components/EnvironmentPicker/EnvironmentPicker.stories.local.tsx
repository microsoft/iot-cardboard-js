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
        <div style={{ width: 332 }}>
            <EnvironmentPicker
                theme={theme}
                locale={locale}
                adapter={
                    new ADTAdapter(
                        authenticationParameters.adt.hostUrl,
                        new MsalAuthService(
                            authenticationParameters.adt.aadParameters
                        ),
                        authenticationParameters.adt.aadParameters.tenantId,
                        authenticationParameters.adt.aadParameters.uniqueObjectId
                    )
                }
                isLocalStorageEnabled={true}
                localStorageKey="adtEnvironmentUrls"
                selectedItemLocalStorageKey="selectedAdtEnvironmentUrl"
                storage={{
                    isLocalStorageEnabled: true,
                    localStorageKey: 'storageContainerUrls',
                    selectedItemLocalStorageKey: 'selectedStorageContainerUrl'
                }}
                shouldPullFromSubscription={true}
            />
        </div>
    );
};
