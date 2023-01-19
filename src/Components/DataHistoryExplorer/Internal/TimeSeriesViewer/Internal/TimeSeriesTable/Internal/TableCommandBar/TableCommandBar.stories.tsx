import React from 'react';
import { ComponentStory } from '@storybook/react';
import TableCommandBar from './TableCommandBar';
import { ITableCommandBarProps } from './TableCommandBar.types';
import { getDefaultStoryDecorator } from '../../../../../../../../Models/Services/StoryUtilities';
import mockAdxTimeSeriesData from '../../../../../../../../Adapters/__mockData__/MockAdapterData/MockAdxTimeSeriesData.json';

const wrapperStyle = { width: '100%', height: '100px' };

export default {
    title:
        'Components/DataHistoryExplorer/Internal/TimeSeriesViewer/Internal/TimeSeriesChart/Internal/TableCommandBar',
    component: TableCommandBar,
    decorators: [getDefaultStoryDecorator<ITableCommandBarProps>(wrapperStyle)]
};

type TableCommandBarStory = ComponentStory<typeof TableCommandBar>;

const Template: TableCommandBarStory = (args) => {
    return <TableCommandBar {...args} />;
};

export const Base = Template.bind({}) as TableCommandBarStory;
Base.args = {
    data: mockAdxTimeSeriesData
} as ITableCommandBarProps;
