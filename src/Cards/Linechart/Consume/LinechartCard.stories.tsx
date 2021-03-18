import React from 'react';
import LinechartCard from './LinechartCard';
import MockAdapter from '../../../Adapters/MockAdapter';
import TsiAdapter from '../../../Adapters/TsiAdapter';
import { SearchSpan } from '../../../Models/Classes/SearchSpan';
import MsalAuthService from '../../../Models/Services/MsalAuthService';
import { Theme } from '../../../Models/Constants/Enums';
import useAuthParams from '../../../../.storybook/useAuthParams';

export default {
    title: 'Linechart/Consume'
    // component: Linechart // enable this to be able to use all args in your component. See https://storybook.js.org/docs/react/essentials/controls and https://storybook.js.org/docs/react/writing-stories/args
};

const id = 'storyID';
const properties = ['storyProperty1', 'storyProperty2'];
const chartDataOptions = [{ includeDots: true }, { includeDots: false }];
const searchSpan = new SearchSpan(
    new Date(),
    new Date(new Date().valueOf() + 100000),
    '100ms'
);
const chartCardStyle = {
    height: '400px'
};

export const MockData = (args, { globals: { theme, locale } }) => (
    <div style={chartCardStyle}>
        <LinechartCard
            theme={theme}
            locale={locale}
            id={id}
            searchSpan={searchSpan}
            properties={properties}
            additionalParameters={{ chartDataOptions }}
            chartDataOptions={chartDataOptions}
            adapter={new MockAdapter()}
        />
    </div>
);

export const NoData = (args, { globals: { theme, locale } }) => (
    <div style={chartCardStyle}>
        <LinechartCard
            theme={theme}
            locale={locale}
            id={id}
            searchSpan={searchSpan}
            properties={properties}
            adapter={new MockAdapter(null)}
        />
    </div>
);

export const TsiData = (args, { globals: { theme, locale } }) => {
    const authenticationParameters = useAuthParams();
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
            <LinechartCard
                theme={theme}
                locale={locale}
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

export const TwoThemedCharts = (args, { globals: { locale } }) => (
    <div>
        <div style={chartCardStyle}>
            <LinechartCard
                title={'Linechart dark theme card'}
                theme={Theme.Dark}
                locale={locale}
                id={id}
                searchSpan={searchSpan}
                properties={properties}
                adapter={new MockAdapter()}
            />
        </div>
        <div style={chartCardStyle}>
            <LinechartCard
                title={'Linechart light theme card'}
                theme={Theme.Light}
                locale={locale}
                id={id}
                searchSpan={searchSpan}
                properties={properties}
                adapter={new MockAdapter()}
            />
        </div>
    </div>
);
