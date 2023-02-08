import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../../../Models/Services/StoryUtilities';
import TimeSeriesViewer from './TimeSeriesViewer';
import { ITimeSeriesViewerProps } from './TimeSeriesViewer.types';
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

const Template: TimeSeriesViewerStory = (args) => {
    return <TimeSeriesViewer {...args} />;
};

export const ClusterUrlError = Template.bind({}) as TimeSeriesViewerStory;
ClusterUrlError.args = {
    error: { type: ComponentErrorType.ConnectionError }
};

export const DatabaseError = Template.bind({}) as TimeSeriesViewerStory;
DatabaseError.args = {
    error: {
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
};

export const TableOrQueryError = Template.bind({}) as TimeSeriesViewerStory;
TableOrQueryError.args = {
    error: {
        type: ComponentErrorType.BadRequestException,
        rawError: {
            response: {
                data: {
                    error: {
                        code: DataHistoryServiceErrorCodes.General_BadRequest,
                        innererror: {
                            message:
                                "'where' operator: Failed to resolve table or column expression named 'mockKustoTableName'"
                        }
                    }
                }
            }
        } as AxiosError
    }
};

export const UnauthorizedAccessError = Template.bind(
    {}
) as TimeSeriesViewerStory;
UnauthorizedAccessError.args = {
    error: { type: ComponentErrorType.UnauthorizedAccess }
};

export const GenericError = Template.bind({}) as TimeSeriesViewerStory;
GenericError.args = {
    error: {
        type: ComponentErrorType.DataFetchFailed,
        rawError: {
            response: {
                data: {
                    error: {
                        code: DataHistoryServiceErrorCodes.General_BadRequest,
                        innererror: {
                            message: 'Generic error message details'
                        }
                    }
                }
            }
        } as AxiosError
    }
};
