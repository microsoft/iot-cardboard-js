import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../Models/Services/StoryUtilities';
import HighChartsWrapper from './HighChartsWrapper';
import { IHighChartsWrapperProps } from './HighChartsWrapper.types';
import {
    HighChartsMockData,
    HighChartsMockLargeData
} from './HighChartsWrapper.mock';

const wrapperStyle = { width: '500px', height: '300px', padding: 8 };

export default {
    title: 'Components/HighChartsWrapper',
    component: HighChartsWrapper,
    decorators: [
        getDefaultStoryDecorator<IHighChartsWrapperProps>(wrapperStyle)
    ]
};

type HighChartsWrapperStory = ComponentStory<typeof HighChartsWrapper>; // TODO: fix re-rendering issue in Storybook

const Template: HighChartsWrapperStory = (args) => {
    return <HighChartsWrapper {...args} />;
};

const commonArgs = { title: 'Mock chart', seriesData: HighChartsMockData };

export const SharedAxis = Template.bind({}) as HighChartsWrapperStory;
SharedAxis.args = { ...commonArgs } as IHighChartsWrapperProps;

export const IndependentAxis = Template.bind({}) as HighChartsWrapperStory;
IndependentAxis.args = {
    ...commonArgs,
    chartOptions: { hasMultipleAxes: true }
} as IHighChartsWrapperProps;

export const VerticalLegend = Template.bind({}) as HighChartsWrapperStory;
VerticalLegend.args = {
    ...commonArgs,
    chartOptions: {
        legendLayout: 'vertical'
    }
} as IHighChartsWrapperProps;

export const NoData = Template.bind({}) as HighChartsWrapperStory;
NoData.args = {
    ...commonArgs,
    seriesData: []
} as IHighChartsWrapperProps;

export const FixedTimeRange = Template.bind({}) as HighChartsWrapperStory;
FixedTimeRange.args = {
    ...commonArgs,
    chartOptions: {
        xMinInMillis: Date.UTC(2012, 5, 16).valueOf(),
        xMaxInMillis: Date.UTC(2012, 5, 26).valueOf()
    }
} as IHighChartsWrapperProps;

export const LargeDataSet = Template.bind({}) as HighChartsWrapperStory;
LargeDataSet.args = {
    ...commonArgs,
    seriesData: HighChartsMockLargeData
} as IHighChartsWrapperProps;
