import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../../../Models/Services/StoryUtilities';
import TimeSeriesTwinCallout from './TimeSeriesTwinCallout';
import { ITimeSeriesTwinCalloutProps } from './TimeSeriesTwinCallout.types';
import { DefaultButton } from '@fluentui/react';
import useAuthParams from '../../../../../.storybook/useAuthParams';
import MsalAuthService from '../../../../Models/Services/MsalAuthService';
import ADT3DSceneAdapter from '../../../../Adapters/ADT3DSceneAdapter';

const wrapperStyle = { width: '100%', height: '600px', padding: 8 };

export default {
    title: 'Components/TimeSeriesTwinCallout',
    component: TimeSeriesTwinCallout,
    decorators: [
        getDefaultStoryDecorator<ITimeSeriesTwinCalloutProps>(wrapperStyle)
    ]
};

type TimeSeriesTwinCalloutStory = ComponentStory<typeof TimeSeriesTwinCallout>;

const Template: TimeSeriesTwinCalloutStory = (args) => {
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
                    new ADT3DSceneAdapter(
                        new MsalAuthService(
                            authenticationParameters.adt.aadParameters
                        ),
                        authenticationParameters.adt.hostUrl
                    )
                }
                {...args}
            />
        </>
    );
};

export const Mock = Template.bind({}) as TimeSeriesTwinCalloutStory;
Mock.args = {
    target: 'mock-time-series-twin-callout-target',
    onPrimaryActionClick(timeSeriesTwin) {
        console.log(timeSeriesTwin);
    }
} as ITimeSeriesTwinCalloutProps;
