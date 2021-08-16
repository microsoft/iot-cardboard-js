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
                relationshipId={'4690c125-aac8-4456-9203-298c93f5fcf0'}
                twinId={'LeoTheDog'}
            />
        </div>
    );
};
