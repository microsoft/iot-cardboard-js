import React from 'react';
import { getDefaultStoryDecorator } from '../../../../Models/Services/StoryUtilities';
import TimeSeriesTwinCallout from './TimeSeriesTwinCallout';
import { ITimeSeriesTwinCalloutProps } from './TimeSeriesTwinCallout.types';
import { DefaultButton } from '@fluentui/react';
import useAuthParams from '../../../../../.storybook/useAuthParams';
import MsalAuthService from '../../../../Models/Services/MsalAuthService';
import ADTDataHistoryAdapter from '../../../../Adapters/ADTDataHistoryAdapter';

const wrapperStyle = { width: '100%', height: '600px', padding: 8 };

export default {
    title: 'Components/DataHistoryExplorer/Internal/TimeSeriesTwinCallout',
    component: TimeSeriesTwinCallout,
    decorators: [
        getDefaultStoryDecorator<ITimeSeriesTwinCalloutProps>(wrapperStyle)
    ]
};

export const ADT = (_args) => {
    const authenticationParameters = useAuthParams();
    return !authenticationParameters ? (
        <div></div>
    ) : (
        <>
            <DefaultButton
                text="Target button"
                id="mock-time-series-twin-callout-target"
            />
            <TimeSeriesTwinCallout
                adapter={
                    new ADTDataHistoryAdapter(
                        new MsalAuthService(
                            authenticationParameters.adt.aadParameters
                        ),
                        authenticationParameters.adt.hostUrl
                    )
                }
                target={'mock-time-series-twin-callout-target'}
                onPrimaryActionClick={(timeSeriesTwin) => {
                    console.log(timeSeriesTwin);
                }}
            />
        </>
    );
};
