import React from 'react';
import useAuthParams from '../../../.storybook/useAuthParams';
import ADTAdapter from '../../Adapters/ADTAdapter';
import MsalAuthService from '../../Models/Services/MsalAuthService';
import ADTModelAuthoringPage from './ADTModelAuthoringPage';

export default {
    title: 'Pages/ADTModelAuthoringPage',
    component: ADTModelAuthoringPage,
    parameters: {
        noGlobalWrapper: true,
    },
};

const cardStyle = {
    height: '700px',
    width: '100%',
};

export const ADTModelListWithModelDetails = (
    _args,
    { globals: { theme, locale } },
) => {
    const authenticationParameters = useAuthParams();

    return !authenticationParameters ? (
        <div></div>
    ) : (
        <div style={cardStyle}>
            <ADTModelAuthoringPage
                theme={theme}
                locale={locale}
                adapter={
                    new ADTAdapter(
                        authenticationParameters.adt.hostUrl,
                        new MsalAuthService(
                            authenticationParameters.adt.aadParameters,
                        ),
                    )
                }
                onAuthoringOpen={() => console.log('Model authoring opened!')}
                onAuthoringClose={() => console.log('Model authoring closed!')}
            />
        </div>
    );
};
