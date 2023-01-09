import React from 'react';
import { ComponentStory } from '@storybook/react';
import TimeSeriesTable from './TimeSeriesTable';
import { ITimeSeriesTableProps } from './TimeSeriesTable.types';
import { getDefaultStoryDecorator } from '../../../../../../Models/Services/StoryUtilities';
import mockADXTimeSeriesData from '../../../../../../Adapters/__mockData__/MockAdapterData/MockADXTimeSeriesData.json';
import { transformADXTableRowToTimeSeriesData } from '../../../../../../Models/SharedUtils/DataHistoryUtils';

const wrapperStyle = { width: '100%', height: '600px', padding: 8 };

export default {
    title:
        'Components/DataHistoryExplorer/Internal/TimeSeriesViewer/Internal/TimeSeriesTable',
    component: TimeSeriesTable,
    decorators: [getDefaultStoryDecorator<ITimeSeriesTableProps>(wrapperStyle)]
};

type TableStory = ComponentStory<typeof TimeSeriesTable>;

const Template: TableStory = (args) => {
    return <TimeSeriesTable {...args} />;
};

export const Base = Template.bind({}) as TableStory;
Base.args = {
    adxTimeSeries: transformADXTableRowToTimeSeriesData(mockADXTimeSeriesData)
} as ITimeSeriesTableProps;
