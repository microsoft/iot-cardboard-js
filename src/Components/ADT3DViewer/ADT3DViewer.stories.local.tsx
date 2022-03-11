import React, { useState } from 'react';
import useAuthParams from '../../../.storybook/useAuthParams';
import ADTAdapter from '../../Adapters/ADTAdapter';
import MsalAuthService from '../../Models/Services/MsalAuthService';
import ADT3DViewer from './ADT3DViewer';
import MockAdapter from '../../Adapters/MockAdapter';
import mockVConfig from '../../Adapters/__mockData__/3DScenesConfiguration.json';
import { ADT3DAddInEventData, IADT3DAddInProps } from '../../Models/Constants';
import { I3DScenesConfig } from '../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';

export default {
    title: '3DV/ADT3DViewer',
    component: ADT3DViewer
};

export const Engine = () => {
    const authenticationParameters = useAuthParams();
    const scenesConfig = mockVConfig as I3DScenesConfig;

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

export const EngineWithHover = () => {
    const authenticationParameters = useAuthParams();
    const scenesConfig = mockVConfig as I3DScenesConfig;

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
                showMeshesOnHover={true}
                pollingInterval={10000}
                sceneId="58e02362287440d9a5bf3f8d6d6bfcf9"
                connectionLineColor="#000"
            />
        </div>
    );
};

export const EngineWithShaders = () => {
    const authenticationParameters = useAuthParams();
    const scenesConfig = mockVConfig as I3DScenesConfig;

    return !authenticationParameters ? (
        <div></div>
    ) : (
        <div style={{ width: '100%', height: '100%', background: '#2A3A44' }}>
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

const addInDivStyle: React.CSSProperties = {
    width: 300,
    height: '100%',
    position: 'absolute',
    right: 0,
    top: 0,
    background: 'white',
    border: '1px solid black',
    fontFamily: 'Segoe UI',
    display: 'flex',
    flexDirection: 'column'
};

export const AddIn = () => {
    const authenticationParameters = useAuthParams();
    const scenesConfig = mockVConfig as I3DScenesConfig;
    const [data, setData] = useState<ADT3DAddInEventData>(null);
    const [twinIds, setTwinIds] = useState<string[]>([]);

    const processEvent = (data: ADT3DAddInEventData) => {
        const sceneVisuals = data.sceneVisuals;
        const mesh = data.mesh;
        const sceneVisual = sceneVisuals?.find((sceneVisual) =>
            sceneVisual.meshIds.find((id) => id === mesh?.id)
        );

        const twins: string[] = [];
        if (sceneVisual) {
            for (const twinId in sceneVisual.twins) {
                const twin = sceneVisual.twins[twinId];
                twins.push(twin.$dtId);
            }
        }

        setTwinIds(twins);
        setData(data);
        return false;
    };

    const onSceneLoaded = (data: ADT3DAddInEventData) => {
        return processEvent(data);
    };

    const onMeshHover = (data: ADT3DAddInEventData) => {
        if (!data.mesh) {
            setData(null);
            return false;
        }

        return processEvent(data);
    };

    const onMeshClick = (data: ADT3DAddInEventData) => {
        return processEvent(data);
    };

    const addInProps: IADT3DAddInProps = {
        onSceneLoaded,
        onMeshHover,
        onMeshClick
    };

    return !authenticationParameters ? (
        <div></div>
    ) : (
        <div style={{ width: '100%', height: '600px', position: 'relative' }}>
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
                addInProps={addInProps}
            />
            {data && (
                <div style={addInDivStyle}>
                    <div>Event type: {data.eventType}</div>
                    <div>Twins:</div>
                    {twinIds.map((id, index) => (
                        <div key={index}>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{id}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export const Mock = () => {
    const scenesConfig = mockVConfig as I3DScenesConfig;

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

export const MockWithHover = () => {
    const scenesConfig = mockVConfig as I3DScenesConfig;

    return (
        <div style={{ width: '100%', height: '600px' }}>
            <ADT3DViewer
                title="3D Viewer (Mock Data)"
                adapter={new MockAdapter()}
                sceneConfig={scenesConfig}
                pollingInterval={10000}
                sceneId={'58e02362287440d9a5bf3f8d6d6bfcf9'}
                showMeshesOnHover={true}
                connectionLineColor="#000"
            />
        </div>
    );
};

export const MockWithSelection = () => {
    const scenesConfig = mockVConfig as I3DScenesConfig;

    return (
        <div style={{ width: '100%', height: '600px' }}>
            <ADT3DViewer
                title="3D Viewer (Mock Data)"
                adapter={new MockAdapter()}
                sceneConfig={scenesConfig}
                pollingInterval={10000}
                sceneId={'58e02362287440d9a5bf3f8d6d6bfcf9'}
                enableMeshSelection={true}
                showHoverOnSelected={true}
                showMeshesOnHover={true}
                connectionLineColor="#000"
            />
        </div>
    );
};
