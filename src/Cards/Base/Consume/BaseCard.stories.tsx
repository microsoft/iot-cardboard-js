import React from 'react';
import AdapterResult from '../../../Models/Classes/AdapterResult';
import { AdapterErrorType } from '../../../Models/Constants';
import MockAdapter from '../../../Adapters/MockAdapter';
import useAdapter from '../../../Models/Hooks/useAdapter';
import BaseCard from './BaseCard';

export default {
    title: 'BaseCard/Consume'
};

export const BasicCard = (args, { globals: { theme } }) => (
    <div
        style={{
            height: '400px',
            position: 'relative'
        }}
    >
        <BaseCard
            isLoading={false}
            theme={theme}
            adapterResult={
                new AdapterResult({
                    result: null,
                    errorInfo: null
                })
            }
        />
    </div>
);

const useMockError = (errorType: AdapterErrorType) => {
    const adapter = new MockAdapter(undefined, errorType);
    const id = 'errorTest';
    const properties = ['a', 'b', 'c'];
    const cardState = useAdapter({
        adapterMethod: () => adapter.getKeyValuePairs(id, properties),
        refetchDependencies: properties
    });
    return cardState;
};

export const TokenError = (args, { globals: { theme } }) => {
    const cardState = useMockError(AdapterErrorType.TokenRetrievalFailed);

    return (
        <div
            style={{
                height: '400px',
                position: 'relative'
            }}
        >
            <BaseCard
                isLoading={false}
                theme={theme}
                adapterResult={cardState.adapterResult}
            />
        </div>
    );
};

export const DataError = (args, { globals: { theme } }) => {
    const cardState = useMockError(AdapterErrorType.DataFetchFailed);
    return (
        <div
            style={{
                height: '400px',
                position: 'relative'
            }}
        >
            <BaseCard
                isLoading={false}
                theme={theme}
                adapterResult={cardState.adapterResult}
            />
        </div>
    );
};
