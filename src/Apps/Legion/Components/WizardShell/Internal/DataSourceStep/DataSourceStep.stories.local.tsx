import React from 'react';
import { ComponentStory } from '@storybook/react';
import DataSourceStep from './DataSourceStep';
import { IDataSourceStepProps } from './DataSourceStep.types';
import { getDefaultStoryDecorator } from '../../../../../../Models/Services/StoryUtilities';
import LegionAdapter from '../../../../Adapters/Mixin/LegionAdapter';
import MsalAuthService from '../../../../../../Models/Services/MsalAuthService';
import useAuthParams from '../../../../../../../.storybook/useAuthParams';
import { WizardNavigationContextProvider } from '../../../../Contexts/WizardNavigationContext/WizardNavigationContext';
import { wizardData, steps } from '../../WizardShellMockData';
import { DataManagementContextProvider } from '../../../../Contexts/DataManagementContext/DataManagementContext';

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
        <DataManagementContextProvider
            initialState={{
                ...wizardData
            }}
        >
            <WizardNavigationContextProvider
                initialState={{
                    steps: steps,
                    currentStep: 0
                }}
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
        </DataManagementContextProvider>
    );
};

export const ADX = Template.bind({}) as DataSourceStepStory;
ADX.args = {} as IDataSourceStepProps;
