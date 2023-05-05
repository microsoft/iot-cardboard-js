import React from 'react';
import { ComponentStory } from '@storybook/react';
import DataSourceStep from './DataSourceStep';
import { IDataSourceStepProps } from './DataSourceStep.types';
import { getDefaultStoryDecorator } from '../../../../../../Models/Services/StoryUtilities';
import useAuthParams from '../../../../../../../.storybook/useAuthParams';
import { WizardNavigationContextProvider } from '../../../../Contexts/WizardNavigationContext/WizardNavigationContext';
import { WIZARD_NAVIGATION_MOCK_DATA } from '../../WizardShellMockData';
import { WizardDataContextProvider } from '../../../../Contexts/WizardDataContext/WizardDataContext';
import { AppDataContextProvider } from '../../../../Contexts/AppDataContext/AppDataContext';
import LegionAdapter from '../../../../Adapters/Mixin/LegionAdapter';
import MsalAuthService from '../../../../../../Models/Services/MsalAuthService';

const wrapperStyle = { width: '100%', height: '600px', padding: 8 };

export default {
    title: 'Apps/Legion/WizardShell/DataSourceStep',
    component: DataSourceStep,
    decorators: [getDefaultStoryDecorator<IDataSourceStepProps>(wrapperStyle)]
};

type DataSourceStepStory = ComponentStory<typeof DataSourceStep>;

const Template: DataSourceStepStory = (args) => {
    const authenticationParameters = useAuthParams();
    return !authenticationParameters ? (
        <div></div>
    ) : (
        <AppDataContextProvider
            adapter={
                new LegionAdapter(
                    new MsalAuthService(
                        authenticationParameters.adt.aadParameters
                    ),
                    authenticationParameters.adx.clusterUrl
                )
            }
        >
            <WizardDataContextProvider>
                <WizardNavigationContextProvider
                    initialState={WIZARD_NAVIGATION_MOCK_DATA}
                >
                    <DataSourceStep {...args} />
                </WizardNavigationContextProvider>
            </WizardDataContextProvider>
        </AppDataContextProvider>
    );
};

export const ADX = Template.bind({}) as DataSourceStepStory;
ADX.args = {} as IDataSourceStepProps;
