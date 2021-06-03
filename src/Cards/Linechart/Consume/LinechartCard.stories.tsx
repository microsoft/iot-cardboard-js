import React from 'react';
import LinechartCard from './LinechartCard';
import MockAdapter from '../../../Adapters/MockAdapter';
import { Theme } from '../../../Models/Constants/Enums';

export default {
    title: 'Linechart/Consume',
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
