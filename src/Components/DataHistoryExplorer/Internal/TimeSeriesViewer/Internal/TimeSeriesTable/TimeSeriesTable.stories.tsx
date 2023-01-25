import React from 'react';
import { ComponentStory } from '@storybook/react';
import TimeSeriesTable from './TimeSeriesTable';
import { ITimeSeriesTableProps } from './TimeSeriesTable.types';
import { getDefaultStoryDecorator } from '../../../../../../Models/Services/StoryUtilities';
import { DataHistoryExplorerContext } from '../../../../DataHistoryExplorer';
import { TimeSeriesViewerContext } from '../../TimeSeriesViewer';
import MockAdapter from '../../../../../../Adapters/MockAdapter';
import { QuickTimeSpans } from '../../../../../../Models/Constants/Constants';
import { QuickTimeSpanKey } from '../../../../../../Models/Constants/Enums';

const wrapperStyle = { width: '800px', height: '600px', padding: 8 };

export default {
    title:
        'Components/DataHistoryExplorer/Internal/TimeSeriesViewer/Internal/TimeSeriesTable',
    component: TimeSeriesTable,
    decorators: [getDefaultStoryDecorator<ITimeSeriesTableProps>(wrapperStyle)]
};

type TableStory = ComponentStory<typeof TimeSeriesTable>;

const Template: TableStory = (args) => {
    return (
        <DataHistoryExplorerContext.Provider
            value={{ adapter: new MockAdapter() }}
        >
            <TimeSeriesViewerContext.Provider
                value={{
                    timeSeriesTwinList: [
                        {
                            seriesId: '',
                            twinId: 'PasteurizationMachine_A01',
                            twinPropertyName: 'Inflow',
                            twinPropertyType: 'double',
                            label: 'PasteurizationMachine_A01 Inflow'
                        }
                    ]
                }}
            >
                <TimeSeriesTable {...args} />
            </TimeSeriesViewerContext.Provider>
        </DataHistoryExplorerContext.Provider>
    );
};

export const Base = Template.bind({}) as TableStory;
Base.args = {
    quickTimeSpanInMillis: QuickTimeSpans[QuickTimeSpanKey.Last15Mins]
} as ITimeSeriesTableProps;
