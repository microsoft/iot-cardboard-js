import React from 'react';
import useAuthParams from '../../../.storybook/useAuthParams';
import ADT3DSceneAdapter from '../../Adapters/ADT3DSceneAdapter';
import MsalAuthService from '../../Models/Services/MsalAuthService';
import ADT3DScenePage from './ADT3DScenePage';

export default {
    title: 'Pages/ADT3DScenePage',
    component: ADT3DScenePage
};

const cardStyle = {
    height: '100%',
    width: '100%',
    position: 'absolute'
} as React.CSSProperties;

export const ADT3DScenePageCard = (_args, { globals: { theme, locale } }) => {
    const authenticationParameters = useAuthParams();
    const onEnvironmentChange = (envUrl, envUrls) => {
        console.log(envUrl);
        console.log(envUrls);
    };
    const onContainerChange = (containerUrl, containerUrls) => {
        console.log(containerUrl);
        console.log(containerUrls);
    };

    return !authenticationParameters ? (
        <div></div>
    ) : (
        <div style={cardStyle}>
            <ADT3DScenePage
                theme={theme}
                locale={locale}
                adapter={
                    new ADT3DSceneAdapter(
                        new MsalAuthService(
                            authenticationParameters.adt.aadParameters
                        ),
                        authenticationParameters.adt.hostUrl,
                        authenticationParameters.storage.blobContainerUrl,
                        authenticationParameters.adt.aadParameters.tenantId,
                        authenticationParameters.adt.aadParameters.uniqueObjectId
                    )
                }
                environmentPickerOptions={{
                    environment: {
                        shouldPullFromSubscription: true,
                        isLocalStorageEnabled: true,
                        onEnvironmentChange
                    },
                    storage: { isLocalStorageEnabled: true, onContainerChange }
                }}
                enableTwinPropertyInspectorPatchMode
            />
        </div>
    );
};

ADT3DScenePageCard.storyName = 'ADT 3D Scene Page';
