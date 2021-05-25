import React from 'react';
import LinechartCard from './LinechartCard';
import MockAdapter from '../../../Adapters/MockAdapter';
import TsiAdapter from '../../../Adapters/TsiAdapter';
import { SearchSpan } from '../../../Models/Classes/SearchSpan';
import MsalAuthService from '../../../Models/Services/MsalAuthService';
import { Theme } from '../../../Models/Constants/Enums';
import useAuthParams from '../../../../.storybook/useAuthParams';
import { CustomTsiClientChartDataAdapter } from '../../../Adapters';
import { ITsiClientChartDataAdapter } from '../../../Models/Constants';
import { AdapterResult, TsiClientAdapterData } from '../../../Models/Classes';

export default {
    title: 'Linechart/Consume',
    parameters: {
        docs: {
            source: {
                type: 'code'
            }
        }
    }
    // component: LinechartCard // enable this to be able to use all args in your component. See https://storybook.js.org/docs/react/essentials/controls and https://storybook.js.org/docs/react/writing-stories/args
};

const id = 'storyID';
const properties = ['storyProperty1', 'storyProperty2'];
const chartDataOptions = [{ includeDots: true }, { includeDots: false }];
const chartCardStyle = {
    height: '400px'
};

export const MockData = (
    _args,
    { globals: { theme, locale }, parameters: { mockedSearchSpan } }
) => {
    return (
        <div style={chartCardStyle}>
            <LinechartCard
                theme={theme}
                locale={locale}
                id={id}
                searchSpan={mockedSearchSpan}
                properties={properties}
                adapterAdditionalParameters={{ chartDataOptions }}
                chartDataOptions={chartDataOptions}
                adapter={new MockAdapter()}
            />
        </div>
    );
};

export const UsingCustomTsiClientAdapter = (
    _args,
    { globals: { theme, locale }, parameters: { mockedSearchSpan } }
) => {
    // Option 1: Create custom data adapter using utility class -> CustomTsiClientChartDataAdapter
    const customAdapterUsingClass = new CustomTsiClientChartDataAdapter({
        // Function to fetch data from custom API
        dataFetcher: async (params) => {
            return await new Promise((res) => {
                const mockAdapter = new MockAdapter();
                const mockData = mockAdapter.generateMockLineChartData(
                    params.searchSpan,
                    params.properties
                );
                res(mockData);
            });
        },
        // Do any necessary data transformations here
        // dataTransformer must return TsiClientData type
        dataTransformer: (data, _params) => data
    });

    // Option 2: Create adapter object adhering to ITsiClientChartDataAdapter interface
    const customAdapterUsingInterface: ITsiClientChartDataAdapter = {
        getTsiclientChartDataShape: async (
            id: string,
            searchSpan: SearchSpan,
            properties: readonly string[]
        ) => {
            const mockAdapter = new MockAdapter();
            const mockData = mockAdapter.generateMockLineChartData(searchSpan, [
                ...properties
            ]);
            return new AdapterResult<TsiClientAdapterData>({
                errorInfo: null,
                result: new TsiClientAdapterData(mockData)
            });
        }
    };

    return (
        <div style={chartCardStyle}>
            <LinechartCard
                title={'Custom TsiClientChartData Adapter'}
                theme={theme}
                locale={locale}
                id={id}
                searchSpan={mockedSearchSpan}
                properties={['Example data A', 'Example data B']}
                adapter={customAdapterUsingClass || customAdapterUsingInterface}
            />
        </div>
    );
};

UsingCustomTsiClientAdapter.storyName = 'Using Custom TsiClient Adapter';

export const NoData = (
    _args,
    { globals: { theme, locale }, parameters: { mockedSearchSpan } }
) => (
    <div style={chartCardStyle}>
        <LinechartCard
            theme={theme}
            locale={locale}
            id={id}
            searchSpan={mockedSearchSpan}
            properties={properties}
            adapter={new MockAdapter({ mockData: null })}
        />
    </div>
);

export const TsiData = (_args, { globals: { theme, locale } }) => {
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

export const TwoThemedCharts = (
    _args,
    { globals: { locale }, parameters: { mockedSearchSpan } }
) => (
    <div>
        <div style={chartCardStyle}>
            <LinechartCard
                title={'Linechart dark theme card'}
                theme={Theme.Dark}
                locale={locale}
                id={id}
                searchSpan={mockedSearchSpan}
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
                searchSpan={mockedSearchSpan}
                properties={properties}
                adapter={new MockAdapter()}
            />
        </div>
    </div>
);
