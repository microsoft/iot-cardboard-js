import React from 'react';
import Linechart from './LinechartCard';
import MockAdapter from '../../../Adapters/MockAdapter';
import IoTCentralAdapter from '../../../Adapters/IoTCentralAdapter';
import { SearchSpan } from '../../../Models/SearchSpan';
import TsiAdapter from '../../../Adapters/TsiAdapter';

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
                        '10000000-0000-0000-0000-100000000109.env.timeseries.azure.com'
                    )
                }
            />
        </div>
    );
};

export const IotcLKVData = (args, { globals: { theme } }) => {
    const iotcId = 'someGUID';
    const iotcProperties = ['batt', 'fuel'];
    const iotcSearchSpan = new SearchSpan(
        new Date('2017-04-20T20:00:00Z'),
        new Date('2017-05-20T20:00:00Z'),
        '6h'
    );
    return (
        <div style={chartCardStyle}>
            <Linechart
                theme={theme}
                id={iotcId}
                searchSpan={iotcSearchSpan}
                properties={iotcProperties}
                adapter={new IoTCentralAdapter('')}
                additionalProperties={{ isLkv: true }}
            />
        </div>
    );
};

export const IotcTSData = (args, { globals: { theme } }) => {
    const iotcId = 'someGUID';
    const iotcProperties = ['batt', 'fuel'];
    const iotcSearchSpan = new SearchSpan(
        new Date('2017-04-20T20:00:00Z'),
        new Date('2017-05-20T20:00:00Z'),
        '6h'
    );
    return (
        <div style={chartCardStyle}>
            <Linechart
                theme={theme}
                id={iotcId}
                searchSpan={iotcSearchSpan}
                properties={iotcProperties}
                adapter={new IoTCentralAdapter('')}
                additionalProperties={{ isLkv: false }}
            />
        </div>
    );
};
