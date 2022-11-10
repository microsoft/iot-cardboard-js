import React from 'react';
import MockAdapter from '../../Adapters/MockAdapter';
import KeyValuePairAdapterData from '../../Models/Classes/AdapterDataClasses/KeyValuePairAdapterData';
import AdapterMethodSandbox from '../../Models/Classes/AdapterMethodSandbox';
import { IKeyValuePairAdapter } from '../../Models/Constants/Interfaces';
import { KeyValuePairData } from '../../Models/Constants/Types';
import KeyValuePairCard from './KeyValuePairCard';
import { useStableGuidRng } from '../../Models/Context/StableGuidRngProvider';
import { ComponentErrorType } from '../../Models/Constants';

export default {
    title: 'Cards/KeyValuePairCard',
    component: KeyValuePairCard,
    parameters: {
        docs: {
            source: {
                type: 'code'
            }
        }
    }
};

const properties = ['foo'] as [string];

export const Mock = (
    _args,
    { globals: { theme }, parameters: { defaultCardWrapperStyle } }
) => (
    <div style={defaultCardWrapperStyle}>
        <KeyValuePairCard
            theme={theme}
            id="notRelevant"
            properties={properties}
            adapter={new MockAdapter()}
        />
    </div>
);

export const MockError = (
    _args,
    { globals: { theme }, parameters: { defaultCardWrapperStyle } }
) => (
    <div style={defaultCardWrapperStyle}>
        <KeyValuePairCard
            theme={theme}
            id="notRelevant"
            properties={properties}
            adapter={
                new MockAdapter({
                    mockError: { type: ComponentErrorType.TokenRetrievalFailed }
                })
            }
        />
    </div>
);

export const MockOverflow = (_args, { globals: { theme } }) => (
    <div style={{ height: '200px', width: '200px' }}>
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
    { globals: { theme, locale }, parameters: { defaultCardWrapperStyle } }
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
        <div style={defaultCardWrapperStyle}>
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
