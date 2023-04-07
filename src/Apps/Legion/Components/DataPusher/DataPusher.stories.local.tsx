import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../../../Models/Services/StoryUtilities';
import DataPusher from './DataPusher';
import { IDataPusherProps } from './DataPusher.types';
import useAuthParams from '../../../../../.storybook/useAuthParams';
import MsalAuthService from '../../../../Models/Services/MsalAuthService';
import LegionAdapter from '../../Adapters/Mixin/LegionAdapter';

const wrapperStyle = { width: '800px', height: '800px', padding: 8 };

export default {
    title: 'Apps/Legion/DataPusher',
    component: DataPusher,
    decorators: [getDefaultStoryDecorator<IDataPusherProps>(wrapperStyle)]
};

type DataPusherStory = ComponentStory<typeof DataPusher>;

const Template: DataPusherStory = (args) => {
    const authenticationParameters = useAuthParams();
    return !authenticationParameters ? (
        <div></div>
    ) : (
        <DataPusher
            adapter={
                new LegionAdapter(
                    new MsalAuthService(
                        authenticationParameters.adt.aadParameters
                    ),
                    authenticationParameters.adx.clusterUrl
                )
            }
            {...args}
        />
    );
};

export const ADX = Template.bind({}) as DataPusherStory;
ADX.args = {} as IDataPusherProps;
