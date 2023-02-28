import React from 'react';
import { ComponentStory } from '@storybook/react';
import TimeSeriesTable from './TimeSeriesTable';
import { ITimeSeriesTableProps } from './TimeSeriesTable.types';
import { getDefaultStoryDecorator } from '../../../../../../Models/Services/StoryUtilities';
import { TimeSeriesViewerContext } from '../../TimeSeriesViewer';
import DataHistoryExplorerMockSeriesData from '../../../../__mockData__/DataHistoryExplorerMockSeriesData.json';
import MockADXTimeSeriesData from '../../../../../../Adapters/__mockData__/MockAdapterData/MockADXTimeSeriesData.json';
import { IDataHistoryTimeSeriesTwin } from '../../../../../../Models/Constants';
import { transformADXTimeSeriesToTimeSeriesTableData } from '../../../../../../Models/SharedUtils/DataHistoryUtils';

const wrapperStyle = { width: '800px', height: '600px', padding: 8 };

export default {
    title:
        'Components/DataHistoryExplorer/Internal/TimeSeriesViewer/Internal/TimeSeriesTable',
    component: TimeSeriesTable,
    decorators: [getDefaultStoryDecorator<ITimeSeriesTableProps>(wrapperStyle)]
};

type TableStory = ComponentStory<typeof TimeSeriesTable>;

const series = DataHistoryExplorerMockSeriesData[0] as IDataHistoryTimeSeriesTwin;
const Template: TableStory = (args) => {
    return (
        <TimeSeriesViewerContext.Provider
            value={{
                timeSeriesTwins: [series]
            }}
        >
            <TimeSeriesTable {...args} />
        </TimeSeriesViewerContext.Provider>
    );
};

export const Mock = Template.bind({}) as TableStory;
Mock.args = {
    data: transformADXTimeSeriesToTimeSeriesTableData(
        MockADXTimeSeriesData.filter((d) => d.seriesId === series.seriesId)
    )
} as ITimeSeriesTableProps;
