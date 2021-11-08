import React from 'react';
import SceneListCard from './SceneListCard';
import ADTAdapter from '../../../Adapters/ADTAdapter';
import MsalAuthService from '../../../Models/Services/MsalAuthService';
import useAuthParams from '../../../../.storybook/useAuthParams';

export default {
    title: 'SceneListCard/Consume'
};

export const Foo = (args, { globals: { theme } }) => {
    const authenticationParameters = useAuthParams();
    return !authenticationParameters ? (
        <div></div>
    ) : (
        <div style={{ height: '400px' }}>
            <SceneListCard
                theme={theme}
                title={'SceneListCard card'}
                adapter={
                    new ADTAdapter(
                        authenticationParameters.adt.hostUrl,
                        new MsalAuthService(
                            authenticationParameters.adt.aadParameters
                        )
                    )
                }
                id={''}
                properties={[]}
            />
        </div>
    );
};
