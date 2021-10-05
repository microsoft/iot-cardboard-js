import React from 'react';
import useAuthParams from '../../../.storybook/useAuthParams';
import ADTAdapter from '../../Adapters/ADTAdapter';
import MsalAuthService from '../../Models/Services/MsalAuthService';
import { ADT3DVCard } from './ADT3DVCard';

export default {
    title: '3DV/ADT3DVCard'
};

export const Truck = () => {
    const authenticationParameters = useAuthParams();
    return !authenticationParameters ? (
        <div></div>
    ) : (
        <div style={{ width: '600px', height: '400px' }}>
            <ADT3DVCard
                title="3D Viewer"
                adapter={
                    new ADTAdapter(
                        authenticationParameters.adt.hostUrl,
                        new MsalAuthService(
                            authenticationParameters.adt.aadParameters
                        )
                    )
                }
                pollingInterval={10000}
                twinId="TankVisual"
            />
        </div>
    );
};
