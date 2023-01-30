import React from 'react';
import { ComponentStory } from '@storybook/react';
import TimeSeriesChart from './TimeSeriesChart';
import { ITimeSeriesChartProps } from './TimeSeriesChart.types';
import { getDefaultStoryDecorator } from '../../../../../../Models/Services/StoryUtilities';
import { DataHistoryExplorerContext } from '../../../../DataHistoryExplorer';
import MockAdapter from '../../../../../../Adapters/MockAdapter';
import { TimeSeriesViewerContext } from '../../TimeSeriesViewer';
import { createGUID } from '../../../../../../Models/Services/Utils';

const wrapperStyle = { width: '100%', height: '400px' };

export default {
    title:
        'Components/DataHistoryExplorer/Internal/TimeSeriesViewer/Internal/TimeSeriesChart',
    component: TimeSeriesChart,
    decorators: [getDefaultStoryDecorator<ITimeSeriesChartProps>(wrapperStyle)]
};

type TimeSeriesChartStory = ComponentStory<typeof TimeSeriesChart>;

const Template: TimeSeriesChartStory = (args) => {
    return (
        <DataHistoryExplorerContext.Provider
            value={{ adapter: new MockAdapter() }}
        >
            <TimeSeriesViewerContext.Provider
                value={{
                    timeSeriesTwinList: [
                        {
                            seriesId: createGUID(),
                            twinId: 'PasteurizationMachine_A01',
                            twinPropertyName: 'Inflow',
                            twinPropertyType: 'double',
                            label: 'PasteurizationMachine_A01 Inflow'
                        }
                    ]
                }}
            >
                <TimeSeriesChart {...args} />
            </TimeSeriesViewerContext.Provider>
        </DataHistoryExplorerContext.Provider>
    );
};

export const Mock = Template.bind({}) as TimeSeriesChartStory;
Mock.args = {} as ITimeSeriesChartProps;
