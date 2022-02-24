import React from 'react';
import useAuthParams from '../../../.storybook/useAuthParams';
import ADTandBlobAdapter from '../../Adapters/ADTandBlobAdapter';
import MsalAuthService from '../../Models/Services/MsalAuthService';
import ADT3DScenePage from './ADT3DScenePage';

export default {
    title: 'Pages/ADT3DScenePage',
    component: ADT3DScenePage
};

const cardStyle = {
    height: '600px',
    width: '100%'
};

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
                    new ADTandBlobAdapter(
                        authenticationParameters.adt.hostUrl,
                        authenticationParameters.storage.blobContainerUrl,
                        new MsalAuthService(
                            authenticationParameters.adt.aadParameters
                        )
                    )
                }
                environmentPickerOptions={{
                    environment: {
                        isLocalStorageEnabled: true,
                        onEnvironmentChange
                    },
                    storage: { isLocalStorageEnabled: true, onContainerChange }
                }}
            />
        </div>
    );
};
