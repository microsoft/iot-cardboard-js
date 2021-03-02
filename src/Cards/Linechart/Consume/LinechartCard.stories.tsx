import React, { useState } from 'react';
import Linechart from './LinechartCard';
import MockAdapter from '../../../Adapters/MockAdapter';
import TsiAdapter from '../../../Adapters/TsiAdapter';
import { SearchSpan } from '../../../Models/Classes/SearchSpan';
import { getAuthenticationParameters } from '../../../../.storybook/secrets';
import MsalAuthService from '../../../Models/Services/MsalAuthService';
import { Theme } from '../../../Models/Constants/Enums';

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
    height: '400px'
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
    const [authenticationParameters, setAuthenticationParameters] = useState(
        false as any
    );
    getAuthenticationParameters().then((ap) => {
        setAuthenticationParameters(ap);
    });
    const tsiId = 'df4412c4-dba2-4a52-87af-780e78ff156b';
    const tsiProperties = ['value'];
    const tsiSearchSpan = new SearchSpan(
        new Date('2017-04-20T20:00:00Z'),
        new Date('2017-05-20T20:00:00Z'),
        '6h'
    );
    return !authenticationParameters ? (
        <div></div>
    ) : (
        <div style={chartCardStyle}>
            <Linechart
                theme={theme}
                id={tsiId}
                searchSpan={tsiSearchSpan}
                properties={tsiProperties}
                adapter={
                    new TsiAdapter(
                        authenticationParameters.tsi.environmentFqdn,
                        new MsalAuthService(
                            authenticationParameters.tsi.aadParameters
                        )
                    )
                }
            />
        </div>
    );
};

export const TwoThemedCharts = () => (
    <div>
        <div style={chartCardStyle}>
            <Linechart
                title={'Linechart dark theme card'}
                theme={Theme.Dark}
                id={id}
                searchSpan={searchSpan}
                properties={properties}
                adapter={new MockAdapter()}
            />
        </div>
        <div style={chartCardStyle}>
            <Linechart
                title={'Linechart light theme card'}
                theme={Theme.Light}
                id={id}
                searchSpan={searchSpan}
                properties={properties}
                adapter={new MockAdapter()}
            />
        </div>
    </div>
);
