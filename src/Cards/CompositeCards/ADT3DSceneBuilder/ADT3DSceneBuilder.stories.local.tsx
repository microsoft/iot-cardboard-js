import React from 'react';
import useAuthParams from '../../../../.storybook/useAuthParams';
import ADTandBlobAdapter from '../../../Adapters/ADTandBlobAdapter';
import MsalAuthService from '../../../Models/Services/MsalAuthService';
import ADT3DSceneBuilder from './ADT3DSceneBuilder';

export default {
    title: 'CompositeCards/ADT3DSceneBuilder'
};

const cardStyle = {
    height: '600px',
    width: '100%'
};

export const ADT3DBuilder = (_args, { globals: { theme, locale } }) => {
    const authenticationParameters = useAuthParams();

    return !authenticationParameters ? (
        <div></div>
    ) : (
        <div style={cardStyle}>
            <ADT3DSceneBuilder
                title={'3D Scene Builder'}
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
                sceneId="46743de47dfb6cf24365f57c7f69d3ba"
            />
        </div>
    );
};
