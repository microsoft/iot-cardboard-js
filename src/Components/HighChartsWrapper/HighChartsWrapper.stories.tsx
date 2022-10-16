import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../Models/Services/StoryUtilities';
import HighChartsWrapper from './HighChartsWrapper';
import {
    IHighChartSeriesData,
    IHighChartsWrapperProps
} from './HighChartsWrapper.types';

const wrapperStyle = { width: '500px', height: '300px', padding: 8 };
const mockSeriesData: Array<IHighChartSeriesData> = [
    {
        name: 'Mock series-1',
        data: [
            { timestamp: 1340323200000, value: 115 },
            { timestamp: 1340339499317, value: 23 },
            { timestamp: 1340368246728, value: 188 },
            { timestamp: 1340390085747, value: 213 },
            { timestamp: 1340403271088, value: 245 }
        ],
        tooltipSuffix: '°F'
    },
    {
        name: 'Mock series-2',
        data: [
            { timestamp: 1340329513434, value: 272 },
            { timestamp: 1340339253976, value: 169 },
            { timestamp: 1340341675699, value: 238 },
            { timestamp: 1340385501865, value: 395 },
            { timestamp: 1340390604011, value: 109 }
        ],
        tooltipSuffix: 'cpf'
    },
    {
        name: 'Mock series-3',
        data: [
            { timestamp: 1340323200000, value: 279 },
            { timestamp: 1340332010046, value: 154 },
            { timestamp: 1340356361575, value: 157 },
            { timestamp: 1340395911660, value: 227 },
            { timestamp: 1340401653986, value: 107 }
        ],
        tooltipSuffix: 'm'
    }
];

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

const BaseArgs = {
    title: 'Mock chart',
    seriesData: mockSeriesData
} as IHighChartsWrapperProps;

export const SharedAxis = Template.bind({}) as HighChartsWrapperStory;
SharedAxis.args = BaseArgs;

export const IndependentAxis = Template.bind({}) as HighChartsWrapperStory;
IndependentAxis.args = {
    ...BaseArgs,
    hasMultipleAxes: true
} as IHighChartsWrapperProps;

export const WithTitleLink = Template.bind({}) as HighChartsWrapperStory;
WithTitleLink.args = {
    ...BaseArgs,
    titleTargetLink: 'https://storybook.example.com'
} as IHighChartsWrapperProps;

export const VerticalLegend = Template.bind({}) as HighChartsWrapperStory;
VerticalLegend.args = {
    ...BaseArgs,
    legendLayout: 'vertical'
} as IHighChartsWrapperProps;

export const TightLegend = Template.bind({}) as HighChartsWrapperStory;
TightLegend.args = {
    ...BaseArgs,
    legendPadding: 0
} as IHighChartsWrapperProps;
