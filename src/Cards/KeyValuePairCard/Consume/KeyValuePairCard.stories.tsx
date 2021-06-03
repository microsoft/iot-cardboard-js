import React from 'react';
import MockAdapter from '../../../Adapters/MockAdapter';
import KeyValuePairCard from './KeyValuePairCard';

export default {
    title: 'KeyValuePairCard/Consume'
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
