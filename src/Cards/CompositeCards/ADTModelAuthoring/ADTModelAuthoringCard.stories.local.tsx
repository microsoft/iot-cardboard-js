import React from 'react';
import useAuthParams from '../../../../.storybook/useAuthParams';
import ADTAdapter from '../../../Adapters/ADTAdapter';
import MsalAuthService from '../../../Models/Services/MsalAuthService';
import ADTModelAuthoringCard from './ADTModelAuthoringCard';

export default {
    title: 'CompositeCards/ADTAuthoringCard'
};

const cardStyle = {
    height: '700px',
    width: '100%'
};

export const ADTAuthoring = (_args, { globals: { theme, locale } }) => {
    const authenticationParameters = useAuthParams();

    return !authenticationParameters ? (
        <div></div>
    ) : (
        <div style={cardStyle}>
            <ADTModelAuthoringCard
                theme={theme}
                locale={locale}
                adapter={
                    new ADTAdapter(
                        authenticationParameters.adt.hostUrl,
                        new MsalAuthService(
                            authenticationParameters.adt.aadParameters
                        )
                    )
                }
                onCancel={() => console.log('Closed!')}
            />
        </div>
    );
};
