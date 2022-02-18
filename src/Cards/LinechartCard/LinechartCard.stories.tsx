import React from 'react';
import LinechartCard from './LinechartCard';
import MockAdapter from '../../Adapters/MockAdapter';
import { Theme } from '../../Models/Constants/Enums';
import { ITsiClientChartDataAdapter } from '../../Models/Constants';
import {
    AdapterMethodSandbox,
    SearchSpan,
    TsiClientAdapterData
} from '../../Models/Classes';

export default {
    title: 'Cards/LinechartCard',
    parameters: {
        docs: {
            source: {
                type: 'code'
            }
        }
    },
    component: LinechartCard
};

const id = 'storyID';
const properties = ['storyProperty1', 'storyProperty2'];
const chartDataOptions = [{ includeDots: true }, { includeDots: false }];

export const MockData = (
    _args,
    {
        globals: { theme, locale },
        parameters: { mockedSearchSpan, defaultCardWrapperStyle }
    }
) => {
    return (
        <div style={defaultCardWrapperStyle}>
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
    {
        globals: { theme, locale },
        parameters: { mockedSearchSpan, defaultCardWrapperStyle }
    }
) => {
    // Create adapter object adhering to ITsiClientChartDataAdapter interface
    const customAdapterUsingInterface: ITsiClientChartDataAdapter = {
        getTsiclientChartDataShape: async (
            _id: string,
            searchSpan: SearchSpan,
            properties: readonly string[]
        ) => {
            // Construct AdapterMethodSandbox class to wrap custom logic in error handling sandbox
            const adapterMethodSandbox = new AdapterMethodSandbox();

            // Use the safelyFetchData method to make your adapter call.
            // if the adapter logic fails, this method will register the error and bubble
            // the error up to be shown in the card, rather than failing entirely
            return await adapterMethodSandbox.safelyFetchData(async () => {
                const mockAdapter = new MockAdapter();
                const mockData = mockAdapter.generateMockLineChartData(
                    searchSpan,
                    [...properties]
                );
                return new TsiClientAdapterData(mockData);
            });
        }
    };

    return (
        <div style={defaultCardWrapperStyle}>
            <LinechartCard
                title={'Custom TsiClientChartData Adapter'}
                theme={theme}
                locale={locale}
                id={id}
                searchSpan={mockedSearchSpan}
                properties={['Example data A', 'Example data B']}
                adapter={customAdapterUsingInterface}
            />
        </div>
    );
};

UsingCustomTsiClientAdapter.storyName = 'Using Custom TsiClient Adapter';

export const NoData = (
    _args,
    {
        globals: { theme, locale },
        parameters: { mockedSearchSpan, defaultCardWrapperStyle }
    }
) => (
    <div style={defaultCardWrapperStyle}>
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

export const TwoThemedCharts = (
    _args,
    {
        globals: { locale },
        parameters: { mockedSearchSpan, defaultCardWrapperStyle }
    }
) => (
    <div>
        <div style={defaultCardWrapperStyle}>
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
        <div style={defaultCardWrapperStyle}>
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
