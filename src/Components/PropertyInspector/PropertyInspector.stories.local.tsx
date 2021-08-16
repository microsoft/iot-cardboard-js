import React from 'react';
import useAuthParams from '../../../.storybook/useAuthParams';
import ADTAdapter from '../../Adapters/ADTAdapter';
import MsalAuthService from '../../Models/Services/MsalAuthService';
import PropertyInspector from './PropertyInspector';

export default {
    title: 'Components/Property Inspector'
};

export const AdtTwin = () => {
    const authenticationParameters = useAuthParams();
    return !authenticationParameters ? (
        <div></div>
    ) : (
        <div style={{ maxWidth: '720px', width: '100%' }}>
            <PropertyInspector
                adapter={
                    new ADTAdapter(
                        authenticationParameters.adt.hostUrl,
                        new MsalAuthService(
                            authenticationParameters.adt.aadParameters
                        )
                    )
                }
                twinId={'LeoTheDog'}
            />
        </div>
    );
};

export const AdtRelationship = () => {
    const authenticationParameters = useAuthParams();
    return !authenticationParameters ? (
        <div></div>
    ) : (
        <div style={{ maxWidth: '720px', width: '100%' }}>
            <PropertyInspector
                adapter={
                    new ADTAdapter(
                        authenticationParameters.adt.hostUrl,
                        new MsalAuthService(
                            authenticationParameters.adt.aadParameters
                        )
                    )
                }
                relationshipId={'40a6d7b9-3399-41c4-97e4-0d07aa4ed530'}
            />
        </div>
    );
};
