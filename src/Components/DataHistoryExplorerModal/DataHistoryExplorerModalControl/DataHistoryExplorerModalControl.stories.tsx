import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../../Models/Services/StoryUtilities';
import DataHistoryExplorerModalControl from './DataHistoryExplorerModalControl';
import { IDataHistoryExplorerModalControlProps } from './DataHistoryExplorerModalControl.types';
import MockAdapter from '../../../Adapters/MockAdapter';

const wrapperStyle = { width: '100%', height: '600px', padding: 8 };

export default {
    title: 'Components/DataHistoryExplorer/Modal/ModalControl/Mock',
    component: DataHistoryExplorerModalControl,
    decorators: [
        getDefaultStoryDecorator<IDataHistoryExplorerModalControlProps>(
            wrapperStyle
        )
    ]
};

type DataHistoryExplorerModalControlStory = ComponentStory<
    typeof DataHistoryExplorerModalControl
>;

const Template: DataHistoryExplorerModalControlStory = (args) => {
    return <DataHistoryExplorerModalControl {...args} />;
};

export const Enabled = Template.bind(
    {}
) as DataHistoryExplorerModalControlStory;
Enabled.args = {
    adapter: new MockAdapter()
} as IDataHistoryExplorerModalControlProps;

export const Disabled = Template.bind(
    {}
) as DataHistoryExplorerModalControlStory;
Disabled.args = {
    adapter: new MockAdapter(),
    isEnabled: false
} as IDataHistoryExplorerModalControlProps;

export const WithInitialSeries = Template.bind(
    {}
) as DataHistoryExplorerModalControlStory;
WithInitialSeries.args = {
    adapter: new MockAdapter(),
    initialTwinId: 'SaltMachine_C0'
} as IDataHistoryExplorerModalControlProps;
