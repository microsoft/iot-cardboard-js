import React from 'react';
import useAuthParams from '../../../.storybook/useAuthParams';
import ADTAdapter from '../../Adapters/ADTAdapter';
import MockAdapter from '../../Adapters/MockAdapter';
import MsalAuthService from '../../Models/Services/MsalAuthService';
import ADT3DViewerCard from './ADT3DViewerCard';
import { Vector3 } from 'babylonjs';

export default {
    title: '3DV/ADT3DViewerCard'
};

export const Truck = () => {
    const authenticationParameters = useAuthParams();
    return !authenticationParameters ? (
        <div></div>
    ) : (
        <div style={{ width: '100%', height: '600px' }}>
            <ADT3DViewerCard
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
                connectionLineColor="#000"
                cameraCenter={new Vector3(0, 100, 0)}
                cameraRadius={800}
            />
        </div>
    );
};

export const Mock = () => {
    return (
        <div style={{ width: '100%', height: '600px' }}>
            <ADT3DViewerCard
                title="3D Viewer (Mock Data)"
                adapter={new MockAdapter()}
                pollingInterval={10000}
                twinId="TwinID"
                connectionLineColor="#000"
                cameraRadius={100}
            />
        </div>
    );
};
