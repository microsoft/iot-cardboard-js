import React from 'react';
import { ComponentStory } from '@storybook/react';
import DataSourceStep from './DataSourceStep';
import { IDataSourceStepProps } from './DataSourceStep.types';
import { getDefaultStoryDecorator } from '../../../../../../Models/Services/StoryUtilities';
import LegionAdapter from '../../../../Adapters/Mixin/LegionAdapter';
import MsalAuthService from '../../../../../../Models/Services/MsalAuthService';
import useAuthParams from '../../../../../../../.storybook/useAuthParams';
import { WizardNavigationContextProvider } from '../../../../Contexts/WizardNavigationContext/WizardNavigationContext';
import {
    DEFAULT_MOCK_DATA_MANAGEMENT_STATE,
    WIZARD_NAVIGATION_MOCK_DATA
} from '../../WizardShellMockData';
import { WizardDataManagementContextProvider } from '../../../../Contexts/WizardDataManagementContext/WizardDataManagementContext';

const wrapperStyle = { width: '100%', height: '600px', padding: 8 };

export default {
    title: 'Components/Apps/Legion/WizardShell/DataSourceStep',
    component: DataSourceStep,
    decorators: [getDefaultStoryDecorator<IDataSourceStepProps>(wrapperStyle)]
};

type DataSourceStepStory = ComponentStory<typeof DataSourceStep>;

const Template: DataSourceStepStory = (args) => {
    const authenticationParameters = useAuthParams();
    return !authenticationParameters ? (
        <div></div>
    ) : (
        <WizardDataManagementContextProvider
            initialState={{
                ...DEFAULT_MOCK_DATA_MANAGEMENT_STATE
            }}
        >
            <WizardNavigationContextProvider
                initialState={WIZARD_NAVIGATION_MOCK_DATA}
            >
                <DataSourceStep
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
            </WizardNavigationContextProvider>
        </WizardDataManagementContextProvider>
    );
};

export const ADX = Template.bind({}) as DataSourceStepStory;
ADX.args = {} as IDataSourceStepProps;
