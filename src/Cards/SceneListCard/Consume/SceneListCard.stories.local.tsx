import React from 'react';
import SceneListCard from './SceneListCard';
import MsalAuthService from '../../../Models/Services/MsalAuthService';
import useAuthParams from '../../../../.storybook/useAuthParams';
import BlobAdapter from '../../../Adapters/BlobAdapter';

export default {
    title: 'SceneListCard/Consume'
};

const sceneListCardStyle = {
    height: '100%'
};

export const ScenesCard = (_args, { globals: { theme, locale } }) => {
    const authenticationParameters = useAuthParams();
    return !authenticationParameters ? (
        <div></div>
    ) : (
        <div style={sceneListCardStyle}>
            <SceneListCard
                title={'Scene List Card'}
                theme={theme}
                locale={locale}
                adapter={
                    new BlobAdapter(
                        authenticationParameters.storage.accountHostUrl,
                        authenticationParameters.storage.blobPath,
                        new MsalAuthService(
                            authenticationParameters.storage.aadParameters
                        )
                    )
                }
            />
        </div>
    );
};
