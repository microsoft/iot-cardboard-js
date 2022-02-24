import React from 'react';
import useAuthParams from '../../../.storybook/useAuthParams';
import ADTAdapter from '../../Adapters/ADTAdapter';
import MsalAuthService from '../../Models/Services/MsalAuthService';
import KeyValuePairCard from './KeyValuePairCard';

export default {
    title: 'Cards/KeyValuePairCard',
    component: KeyValuePairCard
};

const digitalTwins = {
    id: 'PasteurizationMachine_A01',
    properties: ['Temperature'] as [string]
};

export const ADT = (
    _args,
    { globals: { theme }, parameters: { defaultCardWrapperStyle } }
) => {
    const authenticationParameters = useAuthParams();
    return !authenticationParameters ? (
        <div></div>
    ) : (
        <div style={defaultCardWrapperStyle}>
            <KeyValuePairCard
                id={digitalTwins.id}
                properties={digitalTwins.properties}
                theme={theme}
                pollingIntervalMillis={2000}
                adapter={
                    new ADTAdapter(
                        authenticationParameters.adt.hostUrl,
                        new MsalAuthService(
                            authenticationParameters.adt.aadParameters
                        )
                    )
                }
            />
        </div>
    );
};
