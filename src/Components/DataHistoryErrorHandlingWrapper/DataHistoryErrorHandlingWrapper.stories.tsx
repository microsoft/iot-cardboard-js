import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../Models/Services/StoryUtilities';
import DataHistoryErrorHandlingWrapper from './DataHistoryErrorHandlingWrapper';
import {
    DataHistoryServiceErrorCodes,
    IDataHistoryErrorHandlingWrapperProps
} from './DataHistoryErrorHandlingWrapper.types';
import { ComponentErrorType } from '../../Models/Constants';
import { AxiosError } from 'axios';

const wrapperStyle = { width: '300px', height: '300px', padding: 8 };

export default {
    title: 'Components/DataHistoryErrorHandlingWrapper',
    component: DataHistoryErrorHandlingWrapper,
    decorators: [
        getDefaultStoryDecorator<IDataHistoryErrorHandlingWrapperProps>(
            wrapperStyle
        )
    ]
};

type DataHistoryErrorHandlingWrapperStory = ComponentStory<
    typeof DataHistoryErrorHandlingWrapper
>;

const Template: DataHistoryErrorHandlingWrapperStory = (args) => {
    return <DataHistoryErrorHandlingWrapper {...args} />;
};

export const ClusterUrlError = Template.bind(
    {}
) as DataHistoryErrorHandlingWrapperStory;
ClusterUrlError.args = {
    error: { type: ComponentErrorType.ConnectionError }
} as IDataHistoryErrorHandlingWrapperProps;

export const DatabaseError = Template.bind(
    {}
) as DataHistoryErrorHandlingWrapperStory;
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
} as IDataHistoryErrorHandlingWrapperProps;

export const TableOrQueryError = Template.bind(
    {}
) as DataHistoryErrorHandlingWrapperStory;
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
} as IDataHistoryErrorHandlingWrapperProps;

export const UnauthorizedAccessError = Template.bind(
    {}
) as DataHistoryErrorHandlingWrapperStory;
UnauthorizedAccessError.args = {
    error: { type: ComponentErrorType.UnauthorizedAccess }
} as IDataHistoryErrorHandlingWrapperProps;

export const GenericError = Template.bind(
    {}
) as DataHistoryErrorHandlingWrapperStory;
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
} as IDataHistoryErrorHandlingWrapperProps;
