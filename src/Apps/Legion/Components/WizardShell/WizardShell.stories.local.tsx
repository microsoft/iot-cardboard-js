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
import { WizardDataManagementContextProvider } from '../../Contexts/WizardDataManagementContext/WizardDataManagementContext';

const wrapperStyle = { width: '100%', height: '600px', padding: 8 };

export default {
    title: 'Components/Apps/Legion/WizardShell',
    component: WizardShell,
    decorators: [getDefaultStoryDecorator<IWizardShellProps>(wrapperStyle)]
};

type WizardShellStory = ComponentStory<typeof WizardShell>;

const Template: WizardShellStory = (args) => {
    const authenticationParameters = useAuthParams();
    return !authenticationParameters ? (
        <div></div>
    ) : (
        <WizardDataManagementContextProvider>
            <WizardNavigationContextProvider
                initialState={{
                    ...WIZARD_NAVIGATION_MOCK_DATA,
                    adapter: new LegionAdapter(
                        new MsalAuthService(
                            authenticationParameters.adt.aadParameters
                        ),
                        authenticationParameters.adx.clusterUrl
                    )
                }}
            >
                <WizardShell {...args} />
            </WizardNavigationContextProvider>
        </WizardDataManagementContextProvider>
    );
};

export const ADX = Template.bind({}) as WizardShellStory;
ADX.args = {} as IWizardShellProps;
