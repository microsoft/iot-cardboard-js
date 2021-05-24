import React from 'react';
import useAuthParams from '../../../../.storybook/useAuthParams';
import ADTAdapter from '../../../Adapters/ADTAdapter';
import MockAdapter from '../../../Adapters/MockAdapter';
import { KeyValuePairData } from '../../../Models/Constants';
import { CustomKeyValuePairAdapter } from '../../../Adapters';
import MsalAuthService from '../../../Models/Services/MsalAuthService';
import KeyValuePairCard from './KeyValuePairCard';

export default {
    title: 'KeyValuePairCard/Consume'
};

const properties = ['foo'] as [string];
const wrapperStyle = { height: '400px', width: '400px' };
const smallWrapperStyle = { height: '200px', width: '200px' };

const digitalTwins = {
    id: 'PasteurizationMachine_A01',
    properties: ['Temperature'] as [string]
};

export const CustomAdapter = (_args, { globals: { theme } }) => {
    const adapter = new CustomKeyValuePairAdapter({
        // Function to fetch data from custom API
        dataFetcher: async (_params) => {
            return await new Promise((res) => res(10.213));
        },
        // Do any necessary data transformations here
        dataTransformer: (data, _params) => {
            const transformedData: [KeyValuePairData] = [
                {
                    key: 'TestValue',
                    value: data,
                    timestamp: new Date('01/01/2021')
                }
            ];
            return transformedData;
        }
    });
    return (
        <div style={wrapperStyle}>
            <KeyValuePairCard
                id="kvp-tester"
                theme={theme}
                properties={['Example: custom adapter for external API']}
                adapter={adapter}
            />
        </div>
    );
};

export const Mock = (_args, { globals: { theme } }) => (
    <div style={wrapperStyle}>
        <KeyValuePairCard
            theme={theme}
            id="notRelevant"
            properties={properties}
            adapter={new MockAdapter()}
        />
    </div>
);

export const MockOverflow = (_args, { globals: { theme } }) => (
    <div style={smallWrapperStyle}>
        <KeyValuePairCard
            theme={theme}
            id="notRelevant"
            properties={properties}
            adapter={new MockAdapter()}
        />
    </div>
);

export const ADT = (_args, { globals: { theme } }) => {
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
