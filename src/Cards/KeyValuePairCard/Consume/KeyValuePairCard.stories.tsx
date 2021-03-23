import React from 'react';
import useAuthParams from '../../../../.storybook/useAuthParams';
import ADTAdapter from '../../../Adapters/ADTAdapter';
import MockAdapter from '../../../Adapters/MockAdapter';
import MsalAuthService from '../../../Models/Services/MsalAuthService';
import KeyValuePairCard from './KeyValuePairCard';

export default {
    title: 'KeyValuePairCard/Consume'
};

const properties = ['foo'] as [string];
const wrapperStyle = { height: '400px', width: '400px' };
const smallWrapperStyle = { height: '200px', width: '200px' };

const digitalTwins = {
    id: 'CarTwin',
    properties: ['OutdoorTemperature'] as [string]
};

export const Mock = (args, { globals: { theme } }) => (
    <div style={wrapperStyle}>
        <KeyValuePairCard
            theme={theme}
            id="notRelevant"
            properties={properties}
            adapter={new MockAdapter()}
        />
    </div>
);

export const MockOverflow = (args, { globals: { theme } }) => (
    <div style={smallWrapperStyle}>
        <KeyValuePairCard
            theme={theme}
            id="notRelevant"
            properties={properties}
            adapter={new MockAdapter()}
        />
    </div>
);

export const ADT = (args, { globals: { theme } }) => {
    const authenticationParameters = useAuthParams();
    return !authenticationParameters ? (
        <div></div>
    ) : (
        <div style={wrapperStyle}>
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
