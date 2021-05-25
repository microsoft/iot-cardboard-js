import React from 'react';
import useAuthParams from '../../../../.storybook/useAuthParams';
import ADTAdapter from '../../../Adapters/ADTAdapter';
import MockAdapter from '../../../Adapters/MockAdapter';
import {
    IKeyValuePairAdapter,
    KeyValuePairData
} from '../../../Models/Constants';
import { CustomKeyValuePairAdapter } from '../../../Adapters';
import MsalAuthService from '../../../Models/Services/MsalAuthService';
import KeyValuePairCard from './KeyValuePairCard';
import { useStableGuidRng } from '../../../Models/Context/StableGuidRngProvider';
import {
    AdapterResult,
    KeyValuePairAdapterData
} from '../../../Models/Classes';

export default {
    title: 'KeyValuePairCard/Consume',
    parameters: {
        docs: {
            source: {
                type: 'code'
            }
        }
    }
};

const properties = ['foo'] as [string];
const wrapperStyle = { height: '400px', width: '400px' };
const smallWrapperStyle = { height: '200px', width: '200px' };

const digitalTwins = {
    id: 'PasteurizationMachine_A01',
    properties: ['Temperature'] as [string]
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

export const UsingCustomKVPAdapter = (
    _args,
    { globals: { theme, locale } }
) => {
    const seededRng = useStableGuidRng();

    // Option 1: Create custom data adapter using utility class -> CustomKeyValuePairAdapter
    const customAdapterUsingClass = new CustomKeyValuePairAdapter({
        // Function to fetch data from custom API
        dataFetcher: async (params) => {
            return await new Promise((res) => {
                res(
                    params.properties.map((prop) => ({
                        key: prop,
                        value: seededRng()
                    }))
                );
            });
        },
        // Do any necessary data transformations here, for example, add a timestamp
        dataTransformer: (data, _params) =>
            data.map((datum, idx) => ({
                ...datum,
                timestamp: new Date(
                    new Date('01/01/2021').getTime() + 1000 * idx
                )
            }))
    });

    // Option 2: Create adapter object adhering to IKeyValuePairAdapter interface
    const customAdapterUsingInterface: IKeyValuePairAdapter = {
        getKeyValuePairs: async (_id, properties, _additionalParameters?) => {
            const kvps = properties.map((prop, idx) => {
                const kvp: KeyValuePairData = {
                    key: prop,
                    value: seededRng(),
                    timestamp: new Date(
                        new Date('01/01/2021').getTime() + idx * 1000
                    )
                };
                return kvp;
            });

            return new AdapterResult<KeyValuePairAdapterData>({
                errorInfo: null,
                result: new KeyValuePairAdapterData(kvps)
            });
        }
    };

    return (
        <div style={wrapperStyle}>
            <KeyValuePairCard
                id="kvp-tester"
                theme={theme}
                properties={['Custom KeyValuePair Adapter example']}
                adapter={customAdapterUsingClass || customAdapterUsingInterface}
                locale={locale}
            />
        </div>
    );
};

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
