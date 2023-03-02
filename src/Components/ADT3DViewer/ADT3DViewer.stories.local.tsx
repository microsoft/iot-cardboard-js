import React, { useEffect, useState } from 'react';
import useAuthParams from '../../../.storybook/useAuthParams';
import ADT3DSceneAdapter from '../../Adapters/ADT3DSceneAdapter';
import MsalAuthService from '../../Models/Services/MsalAuthService';
import ADT3DViewer from './ADT3DViewer';

export default {
    title: '3DV/ADT3DViewer',
    component: ADT3DViewer
};

// Wrapper style for div containing scene viewer component
const cardStyle = {
    height: '800px'
} as React.CSSProperties;

export const ADT3DViewerCard = (_args, { globals: { theme, locale } }) => {
    // See an example of parameters in .storybook/secrets.placeholder, use your own values in your application
    const authenticationParameters = useAuthParams();

    // START: Set up adapter and use it to get the scenes config
    const [adapter, setAdapter] = useState(null);
    const [scenesConfig, setScenesConfig] = useState(null);
    useEffect(() => {
        // Since useAuthParams is async, this needs to be in a useEffect
        // In general, your authParams will be constant so you can directly create the adapter instead of using a state variable
        if (authenticationParameters)
            setAdapter(
                new ADT3DSceneAdapter(
                    new MsalAuthService(
                        authenticationParameters.adt.aadParameters
                    ),
                    authenticationParameters.adt.hostUrl,
                    authenticationParameters.storage.blobContainerUrl
                )
            );
    }, [authenticationParameters]);
    // Note: It is probably best if ADT3DViewer gets the scenesConfig for you, but right now it doesn't.
    // We are working on it, stay tuned
    useEffect(() => {
        if (adapter) {
            adapter.getScenesConfig().then(({ result }) => {
                setScenesConfig(result.data);
            });
        }
    }, [adapter]);
    // END: Adapter set up and config fetching

    // The actual 3D Viewer component
    return !scenesConfig ? (
        <div></div>
    ) : (
        <div style={cardStyle}>
            <ADT3DViewer
                theme={theme}
                locale={locale}
                sceneId={'03b0a95fe77907a3a618c3fd8b5bdfc6'}
                scenesConfig={scenesConfig}
                adapter={adapter}
            />
        </div>
    );
};

ADT3DViewerCard.storyName = 'ADT 3D Viewer';
