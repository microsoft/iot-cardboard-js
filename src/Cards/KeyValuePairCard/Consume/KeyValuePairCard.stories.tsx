import React from 'react';
import useAuthParams from '../../../../.storybook/useAuthParams';
import ADTAdapter from '../../../Adapters/ADTAdapter';
import MockAdapter from '../../../Adapters/MockAdapter';
import {
    IKeyValuePairAdapter,
    KeyValuePairData
} from '../../../Models/Constants';
import MsalAuthService from '../../../Models/Services/MsalAuthService';
import KeyValuePairCard from './KeyValuePairCard';
import { useStableGuidRng } from '../../../Models/Context/StableGuidRngProvider';
import {
    AdapterMethodSandbox,
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

    // Create adapter object adhering to IKeyValuePairAdapter interface
    const customAdapterUsingInterface: IKeyValuePairAdapter = {
        getKeyValuePairs: async (_id, properties, _additionalParameters?) => {
            // Construct AdapterMethodSandbox class to wrap custom logic in error handling sandbox
            const adapterMethodSandbox = new AdapterMethodSandbox();

            // Use the safelyFetchData method to make your adapter call.
            // if the adapter logic fails, this method will register the error and bubble
            // the error up to be shown in the card, rather than failing entirely
            return await adapterMethodSandbox.safelyFetchData(async () => {
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

                return new KeyValuePairAdapterData(kvps);
            });
        }
    };

    return (
        <div style={wrapperStyle}>
            <KeyValuePairCard
                id="kvp-tester"
                theme={theme}
                properties={['Custom KeyValuePair Adapter example']}
                adapter={customAdapterUsingInterface}
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
