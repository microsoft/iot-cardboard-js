import React from 'react';
import Linechart from './LinechartCard';
import MockAdapter from '../../../Adapters/MockAdapter';
import TsiAdapter from '../../../Adapters/TsiAdapter';
import { SearchSpan } from '../../../Models/Classes/SearchSpan';
import { AuthenticationParameters } from '../../../../.storybook/parameters';
import MsalAuthService from '../../../Models/Services/MsalAuthService';

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
const chartCardStyle = {
    height: '400px',
    padding: '8px',
    border: '1px solid #ccc'
};

export const MockData = (args, { globals: { theme } }) => (
    <div style={chartCardStyle}>
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
    <div style={chartCardStyle}>
        <Linechart
            theme={theme}
            id={id}
            searchSpan={searchSpan}
            properties={properties}
            adapter={new MockAdapter({ data: emptyData })}
        />
    </div>
);

export const TsiData = (args, { globals: { theme } }) => {
    const tsiId = 'df4412c4-dba2-4a52-87af-780e78ff156b';
    const tsiProperties = ['value'];
    const tsiSearchSpan = new SearchSpan(
        new Date('2017-04-20T20:00:00Z'),
        new Date('2017-05-20T20:00:00Z'),
        '6h'
    );
    return (
        <div style={chartCardStyle}>
            <Linechart
                theme={theme}
                id={tsiId}
                searchSpan={tsiSearchSpan}
                properties={tsiProperties}
                adapter={
                    new TsiAdapter(
                        AuthenticationParameters.tsi.environmentFqdn,
                        new MsalAuthService(
                            AuthenticationParameters.tsi.aadParameters
                        )
                    )
                }
            />
        </div>
    );
};

export const TwoCharts = (args, { globals: { theme } }) => (
    <div>
        <div style={chartCardStyle}>
            <Linechart
                theme={theme}
                id={id}
                searchSpan={searchSpan}
                properties={properties}
                adapter={new MockAdapter()}
            />
        </div>
        <div style={chartCardStyle}>
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
