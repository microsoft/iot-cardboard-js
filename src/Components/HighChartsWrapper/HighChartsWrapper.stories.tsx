import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../Models/Services/StoryUtilities';
import HighChartsWrapper from './HighChartsWrapper';
import {
    HighChartsMockData,
    IHighChartsWrapperProps
} from './HighChartsWrapper.types';

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
    const seriesData = HighChartsMockData;
    return (
        <HighChartsWrapper
            title={'Mock chart'}
            seriesData={seriesData}
            {...args}
        />
    );
};

export const SharedAxis = Template.bind({}) as HighChartsWrapperStory;
SharedAxis.args = {};

export const IndependentAxis = Template.bind({}) as HighChartsWrapperStory;
IndependentAxis.args = {
    chartOptions: { hasMultipleAxes: true }
} as IHighChartsWrapperProps;

export const WithTitleLink = Template.bind({}) as HighChartsWrapperStory;
WithTitleLink.args = {
    chartOptions: { titleTargetLink: 'https://storybook.example.com' }
} as IHighChartsWrapperProps;

export const VerticalLegend = Template.bind({}) as HighChartsWrapperStory;
VerticalLegend.args = {
    chartOptions: {
        legendLayout: 'vertical'
    }
} as IHighChartsWrapperProps;

export const TightLegend = Template.bind({}) as HighChartsWrapperStory;
TightLegend.args = {
    chartOptions: {
        legendPadding: 0
    }
} as IHighChartsWrapperProps;

export const NoData = Template.bind({}) as HighChartsWrapperStory;
NoData.args = {
    seriesData: []
} as IHighChartsWrapperProps;
