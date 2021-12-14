import React from 'react';
import useAuthParams from '../../../.storybook/useAuthParams';
import ADTAdapter from '../../Adapters/ADTAdapter';
import MsalAuthService from '../../Models/Services/MsalAuthService';
import ADT3DViewerCard from './ADT3DViewerCard';
import MockAdapter from '../../Adapters/MockAdapter';

export default {
    title: '3DV/ADT3DViewerCard'
};

export const Engine = () => {
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
                sceneConfig={null}
                pollingInterval={10000}
                sceneId="TankVisual"
                connectionLineColor="#000"
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
                sceneConfig={null}
                pollingInterval={10000}
                sceneId={'Scene ID'}
                connectionLineColor="#000"
            />
        </div>
    );
};
