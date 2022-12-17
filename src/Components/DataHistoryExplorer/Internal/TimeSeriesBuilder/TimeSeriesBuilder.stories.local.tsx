import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../../../Models/Services/StoryUtilities';
import TimeSeriesBuilder from './TimeSeriesBuilder';
import { ITimeSeriesBuilderProps } from './TimeSeriesBuilder.types';
import useAuthParams from '../../../../../.storybook/useAuthParams';
import MsalAuthService from '../../../../Models/Services/MsalAuthService';
import ADTDataHistoryAdapter from '../../../../Adapters/ADTDataHistoryAdapter';
import { DataHistoryExplorerContext } from '../../DataHistoryExplorer';

const wrapperStyle = { width: '400px', height: '600px', padding: 8 };

export default {
    title: 'Components/TimeSeriesBuilder',
    component: TimeSeriesBuilder,
    decorators: [
        getDefaultStoryDecorator<ITimeSeriesBuilderProps>(wrapperStyle)
    ]
};

type TimeSeriesBuilderStory = ComponentStory<typeof TimeSeriesBuilder>;

const Template: TimeSeriesBuilderStory = (args) => {
    const authenticationParameters = useAuthParams();
    return !authenticationParameters ? (
        <div></div>
    ) : (
        <DataHistoryExplorerContext.Provider
            value={{
                adapter: new ADTDataHistoryAdapter(
                    new MsalAuthService(
                        authenticationParameters.adt.aadParameters
                    ),
                    authenticationParameters.adt.hostUrl
                )
            }}
        >
            <TimeSeriesBuilder {...args} />
        </DataHistoryExplorerContext.Provider>
    );
};

export const ADT = Template.bind({}) as TimeSeriesBuilderStory;
ADT.args = {
    onTimeSeriesTwinListChange(timeSeriesTwinList) {
        console.log(timeSeriesTwinList);
    }
} as ITimeSeriesBuilderProps;
