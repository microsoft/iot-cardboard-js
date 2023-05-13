import React from 'react';
import { ComponentStory } from '@storybook/react';
import WizardShell from './WizardShell';
import { IWizardShellProps } from './WizardShell.types';
import { getDefaultStoryDecorator } from '../../../../Models/Services/StoryUtilities';
import { WizardNavigationContextProvider } from '../../Contexts/WizardNavigationContext/WizardNavigationContext';
import LegionAdapter from '../../Adapters/Mixin/LegionAdapter';
import MsalAuthService from '../../../../Models/Services/MsalAuthService';
import useAuthParams from '../../../../../.storybook/useAuthParams';
import { WIZARD_NAVIGATION_MOCK_DATA } from './WizardShellMockData';
import { AppDataContextProvider } from '../../Contexts/AppDataContext/AppDataContext';
import { WizardDataContextProvider } from '../../Contexts/WizardDataContext/WizardDataContext';

const wrapperStyle = { width: '100%', height: '800px' };

export default {
    title: 'Apps/Legion/WizardShell',
    component: WizardShell,
    decorators: [getDefaultStoryDecorator<IWizardShellProps>(wrapperStyle)]
};

type WizardShellStory = ComponentStory<typeof WizardShell>;

const Template: WizardShellStory = (args) => {
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
            initialState={{
                targetDatabase: {
                    clusterUrl: authenticationParameters.adx.clusterUrl,
                    databaseName: 'Target database'
                }
            }}
        >
            <WizardDataContextProvider>
                <WizardNavigationContextProvider
                    initialState={{
                        ...WIZARD_NAVIGATION_MOCK_DATA
                    }}
                >
                    <WizardShell {...args} />
                </WizardNavigationContextProvider>
            </WizardDataContextProvider>
        </AppDataContextProvider>
    );
};

export const ADX = Template.bind({}) as WizardShellStory;
ADX.args = {} as IWizardShellProps;
