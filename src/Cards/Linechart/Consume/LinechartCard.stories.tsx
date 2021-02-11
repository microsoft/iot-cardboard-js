import React from 'react';
import Linechart from './LinechartCard';
import MockAdapter from '../../../Adapters/MockAdapter';
import { SearchSpan } from '../../../Models/SearchSpan';

export default {
    title: 'Linechart/Consume'
    // component: Linechart // enable this to be able to use all args in your component. See https://storybook.js.org/docs/react/essentials/controls and https://storybook.js.org/docs/react/writing-stories/args
};

const emptyData = null;
const id = 'storyID';
const properties = ['storyProperty1', 'storyProperty2'];
const searchSpan = new SearchSpan(
    new Date(),
    new Date(new Date().valueOf() + 100000),
    '100ms'
);

export const MockData = (args, { globals: { theme } }) => (
    <div style={{ height: '400px', padding: '8px', border: '1px solid grey' }}>
        <Linechart
            theme={theme}
            id={id}
            searchSpan={searchSpan}
            properties={properties}
            adapter={new MockAdapter()}
        />
    </div>
);

export const NoData = (args, { globals: { theme } }) => (
    <div style={{ height: '400px', padding: '8px', border: '1px solid grey' }}>
        <Linechart
            theme={theme}
            id={id}
            searchSpan={searchSpan}
            properties={properties}
            adapter={new MockAdapter({ data: emptyData })}
        />
    </div>
);

export const TwoCharts = (args, { globals: { theme } }) => (
    <div>
        <div
            style={{
                height: '400px',
                padding: '8px',
                border: '1px solid grey'
            }}
        >
            <Linechart
                theme={theme}
                id={id}
                searchSpan={searchSpan}
                properties={properties}
                adapter={new MockAdapter()}
            />
        </div>
        <div
            style={{
                height: '400px',
                padding: '8px',
                border: '1px solid grey'
            }}
        >
            <Linechart
                theme={theme}
                id={id}
                searchSpan={searchSpan}
                properties={properties}
                adapter={new MockAdapter()}
            />
        </div>
    </div>
);
