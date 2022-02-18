import React from 'react';
import useAuthParams from '../../../.storybook/useAuthParams';
import ADTAdapter from '../../Adapters/ADTAdapter';
import MsalAuthService from '../../Models/Services/MsalAuthService';
import ADT3DViewer from './ADT3DViewer';
import MockAdapter from '../../Adapters/MockAdapter';
import { IScenesConfig } from '../../Models/Classes/3DVConfig';
import mockVConfig from '../../Adapters/__mockData__/vconfigDecFinal.json';

export default {
    title: '3DV/ADT3DViewer'
};

export const Engine = () => {
    const authenticationParameters = useAuthParams();
    const scenesConfig = mockVConfig as IScenesConfig;

    return !authenticationParameters ? (
        <div></div>
    ) : (
        <div style={{ width: '100%', height: '600px' }}>
            <ADT3DViewer
                title="3D Viewer"
                adapter={
                    new ADTAdapter(
                        authenticationParameters.adt.hostUrl,
                        new MsalAuthService(
                            authenticationParameters.adt.aadParameters
                        )
                    )
                }
                sceneConfig={scenesConfig}
                pollingInterval={10000}
                sceneId="58e02362287440d9a5bf3f8d6d6bfcf9"
                connectionLineColor="#000"
            />
        </div>
    );
};

export const EngineWithMeshSelection = () => {
    const authenticationParameters = useAuthParams();
    const scenesConfig = mockVConfig as IScenesConfig;

    return !authenticationParameters ? (
        <div></div>
    ) : (
        <div style={{ width: '100%', height: '600px' }}>
            <ADT3DViewer
                title="3D Viewer"
                adapter={
                    new ADTAdapter(
                        authenticationParameters.adt.hostUrl,
                        new MsalAuthService(
                            authenticationParameters.adt.aadParameters
                        )
                    )
                }
                sceneConfig={scenesConfig}
                pollingInterval={10000}
                sceneId="58e02362287440d9a5bf3f8d6d6bfcf9"
                connectionLineColor="#000"
                enableMeshSelection={true}
            />
        </div>
    );
};

export const Mock = () => {
    const scenesConfig = mockVConfig as IScenesConfig;

    return (
        <div style={{ width: '100%', height: '600px' }}>
            <ADT3DViewer
                title="3D Viewer (Mock Data)"
                adapter={new MockAdapter()}
                sceneConfig={scenesConfig}
                pollingInterval={10000}
                sceneId={'58e02362287440d9a5bf3f8d6d6bfcf9'}
                connectionLineColor="#000"
            />
        </div>
    );
};
