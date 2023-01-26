import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../../../Models/Services/StoryUtilities';
import TimeSeriesViewer from './TimeSeriesViewer';
import { ITimeSeriesViewerProps } from './TimeSeriesViewer.types';
import MockAdapter from '../../../../Adapters/MockAdapter';
import { DataHistoryExplorerContext } from '../../DataHistoryExplorer';
import { createGUID } from '../../../../Models/Services/Utils';
import { ComponentErrorType } from '../../../../Models/Constants/Enums';
import { DataHistoryServiceErrorCodes } from '../../../DataHistoryErrorHandlingWrapper/DataHistoryErrorHandlingWrapper.types';
import { AxiosError } from 'axios';

const wrapperStyle = { width: '600px', height: '400px' };

export default {
    title: 'Components/DataHistoryExplorer/Internal/TimeSeriesViewer/Errors',
    component: TimeSeriesViewer,
    decorators: [getDefaultStoryDecorator<ITimeSeriesViewerProps>(wrapperStyle)]
};

type TimeSeriesViewerStory = ComponentStory<typeof TimeSeriesViewer>;

const Template: TimeSeriesViewerStory = (args, { parameters: { adapter } }) => {
    return (
        <DataHistoryExplorerContext.Provider value={{ adapter }}>
            <TimeSeriesViewer
                {...args}
                timeSeriesTwinList={[
                    {
                        seriesId: createGUID(),
                        twinId: 'PasteurizationMachine_A01',
                        twinPropertyName: 'Inflow',
                        twinPropertyType: 'double',
                        label: 'PasteurizationMachine_A01 Inflow'
                    },
                    {
                        seriesId: createGUID(),
                        twinId: 'PasteurizationMachine_A02',
                        twinPropertyName: 'Inflow',
                        twinPropertyType: 'double'
                    }
                ]}
            />
        </DataHistoryExplorerContext.Provider>
    );
};

export const ClusterUrlError = Template.bind({}) as TimeSeriesViewerStory;
ClusterUrlError.parameters = {
    adapter: new MockAdapter({
        mockError: { type: ComponentErrorType.ConnectionError }
    })
};

export const DatabaseError = Template.bind({}) as TimeSeriesViewerStory;
DatabaseError.parameters = {
    adapter: new MockAdapter({
        mockError: {
            type: ComponentErrorType.BadRequestException,
            rawError: {
                response: {
                    data: {
                        error: {
                            code:
                                DataHistoryServiceErrorCodes.BadRequest_EntityNotFound
                        }
                    }
                }
            } as AxiosError
        }
    })
};

export const TableOrQueryError = Template.bind({}) as TimeSeriesViewerStory;
TableOrQueryError.parameters = {
    adapter: new MockAdapter({
        mockError: {
            type: ComponentErrorType.BadRequestException,
            rawError: {
                response: {
                    data: {
                        error: {
                            code:
                                DataHistoryServiceErrorCodes.General_BadRequest,
                            innererror: {
                                message:
                                    "'where' operator: Failed to resolve table or column expression named 'mockKustoTableName'"
                            }
                        }
                    }
                }
            } as AxiosError
        }
    })
};

export const UnauthorizedAccessError = Template.bind(
    {}
) as TimeSeriesViewerStory;
UnauthorizedAccessError.parameters = {
    adapter: new MockAdapter({
        mockError: { type: ComponentErrorType.UnauthorizedAccess }
    })
};

export const GenericError = Template.bind({}) as TimeSeriesViewerStory;
GenericError.parameters = {
    adapter: new MockAdapter({
        mockError: {
            type: ComponentErrorType.DataFetchFailed,
            rawError: {
                response: {
                    data: {
                        error: {
                            code:
                                DataHistoryServiceErrorCodes.General_BadRequest,
                            innererror: {
                                message: 'Generic error message details'
                            }
                        }
                    }
                }
            } as AxiosError
        }
    })
};
