import React from 'react';
import useAuthParams from '../../../.storybook/useAuthParams';
import ADTAdapter from '../../Adapters/ADTAdapter';
import MsalAuthService from '../../Models/Services/MsalAuthService';
import TwinSearchDropdown from './TwinSearchDropdown';

export default {
    title: 'Components/TwinSearchDropdown',
    component: TwinSearchDropdown
};

export const ADTTwinSearchDropdown = () => {
    const authenticationParameters = useAuthParams();

    const handleSelectTwinId = (twinId) => {
        console.log('Selected: ' + twinId);
    };

    return !authenticationParameters ? (
        <div></div>
    ) : (
        <div style={{ width: '400px' }}>
            <TwinSearchDropdown
                adapter={
                    new ADTAdapter(
                        authenticationParameters.adt.hostUrl,
                        new MsalAuthService(
                            authenticationParameters.adt.aadParameters
                        )
                    )
                }
                label="Twin ID"
                onTwinIdSelect={handleSelectTwinId}
            />
        </div>
    );
};
