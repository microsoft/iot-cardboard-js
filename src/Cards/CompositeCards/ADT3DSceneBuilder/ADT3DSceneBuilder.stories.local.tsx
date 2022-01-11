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
                        authenticationParameters.storage.accountHostUrl,
                        authenticationParameters.storage.blobPath,
                        new MsalAuthService(
                            authenticationParameters.adt.aadParameters
                        )
                    )
                }
                sceneId="58e02362287440d9a5bf3f8d6d6bfcf9"
            />
        </div>
    );
};
