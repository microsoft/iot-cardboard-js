import React from 'react';
import { getDefaultStoryDecorator } from '../../../../Models/Services/StoryUtilities';
import TimeSeriesBuilder from './TimeSeriesBuilder';
import { ITimeSeriesBuilderProps } from './TimeSeriesBuilder.types';
import useAuthParams from '../../../../../.storybook/useAuthParams';
import MsalAuthService from '../../../../Models/Services/MsalAuthService';
import ADTDataHistoryAdapter from '../../../../Adapters/ADTDataHistoryAdapter';
import { DataHistoryExplorerContext } from '../../DataHistoryExplorer';

const wrapperStyle = { width: '400px', height: '600px', padding: 8 };

export default {
    title: 'Components/DataHistoryExplorer/Internal/TimeSeriesBuilder',
    component: TimeSeriesBuilder,
    decorators: [
        getDefaultStoryDecorator<ITimeSeriesBuilderProps>(wrapperStyle)
    ]
};

export const ADT = () => {
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
            <TimeSeriesBuilder
                onTimeSeriesTwinListChange={(timeSeriesTwinList) => {
                    console.log(timeSeriesTwinList);
                }}
            />
        </DataHistoryExplorerContext.Provider>
    );
};
