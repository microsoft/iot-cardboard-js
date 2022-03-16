import React from 'react';
import SceneList from './SceneList';
import MsalAuthService from '../../Models/Services/MsalAuthService';
import useAuthParams from '../../../.storybook/useAuthParams';
import BlobAdapter from '../../Adapters/BlobAdapter';

export default {
    title: 'Components/SceneList',
    component: SceneList,
};

const SceneListStyle = {
    height: '100%',
};

export const ScenesCard = (_arg, { globals: { theme, locale } }) => {
    const authenticationParameters = useAuthParams();
    return !authenticationParameters ? (
        <div></div>
    ) : (
        <div style={SceneListStyle}>
            <SceneList
                title={'Scene List Card'}
                theme={theme}
                locale={locale}
                adapter={
                    new BlobAdapter(
                        authenticationParameters.storage.blobContainerUrl,
                        new MsalAuthService(
                            authenticationParameters.storage.aadParameters,
                        ),
                    )
                }
            />
        </div>
    );
};
