import React from 'react';
import { ComponentStory } from '@storybook/react';
import TimeSeriesTable from './TimeSeriesTable';
import { ITimeSeriesTableProps } from './TimeSeriesTable.types';
import { getDefaultStoryDecorator } from '../../../../../../Models/Services/StoryUtilities';
import { TimeSeriesViewerContext } from '../../TimeSeriesViewer';
import { getHighChartColorByIdx } from '../../../../../../Models/SharedUtils/DataHistoryUtils';
import { createGUID } from '../../../../../../Models/Services/Utils';

const wrapperStyle = { width: '800px', height: '600px', padding: 8 };

export default {
    title:
        'Components/DataHistoryExplorer/Internal/TimeSeriesViewer/Internal/TimeSeriesTable',
    component: TimeSeriesTable,
    decorators: [getDefaultStoryDecorator<ITimeSeriesTableProps>(wrapperStyle)]
};

type TableStory = ComponentStory<typeof TimeSeriesTable>;

const seriesId = createGUID();
const Template: TableStory = (args) => {
    return (
        <TimeSeriesViewerContext.Provider
            value={{
                timeSeriesTwins: [
                    {
                        seriesId: seriesId,
                        twinId: 'PasteurizationMachine_A01',
                        twinPropertyName: 'Inflow',
                        twinPropertyType: 'double',
                        label: 'PasteurizationMachine_A01 (Inflow)',
                        chartProps: {
                            color: getHighChartColorByIdx(0)
                        }
                    }
                ]
            }}
        >
            <TimeSeriesTable {...args} />
        </TimeSeriesViewerContext.Provider>
    );
};

export const Base = Template.bind({}) as TableStory;
Base.args = {
    data: [
        {
            seriesId: seriesId,
            property: 'InFlow',
            timestamp: '2023-01-09T18:02:49.712Z',
            id: 'PasteurizationMachine_A01',
            key: 'InFlow',
            value: 115
        },
        {
            seriesId: seriesId,
            property: 'InFlow',
            timestamp: '2023-01-09T18:03:09.216Z',
            id: 'PasteurizationMachine_A01',
            key: 'InFlow',
            value: 23
        },
        {
            seriesId: seriesId,
            property: 'InFlow',
            timestamp: '2023-01-09T18:04:16.698Z',
            id: 'PasteurizationMachine_A01',
            key: 'InFlow',
            value: 188
        }
    ]
} as ITimeSeriesTableProps;
