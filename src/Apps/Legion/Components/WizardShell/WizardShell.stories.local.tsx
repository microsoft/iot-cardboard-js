import React from 'react';
import { ComponentStory } from '@storybook/react';
import WizardShell from './WizardShell';
import { IWizardShellProps } from './WizardShell.types';
import { getDefaultStoryDecorator } from '../../../../Models/Services/StoryUtilities';
import { IStepperWizardStep } from '../StepperWizard/StepperWizard.types';
import { WizardNavigationContextProvider } from '../../Models/Context/WizardNavigationContext/WizardNavigationContext';
import { WizardStepData } from '../../Models/Context/WizardNavigationContext/WizardNavigationContext.types';
import {
    mockModels,
    mockProperties,
    mockTwins
} from './Internal/TwinVerificationStep/TwinVerificationMockData';
import { ICookAssets } from '../../Models/Interfaces';
import LegionAdapter from '../../Adapters/Mixin/LegionAdapter';
import MsalAuthService from '../../../../Models/Services/MsalAuthService';
import useAuthParams from '../../../../../.storybook/useAuthParams';

const wrapperStyle = { width: '100%', height: '600px', padding: 8 };

export default {
    title: 'Components/Apps/Legion/WizardShell',
    component: WizardShell,
    decorators: [getDefaultStoryDecorator<IWizardShellProps>(wrapperStyle)]
};

type WizardShellStory = ComponentStory<typeof WizardShell>;

const Template: WizardShellStory = (args) => {
    const steps: IStepperWizardStep[] = [
        {
            label: 'Connect'
        },
        {
            label: 'Verify'
        },
        {
            label: 'Build'
        },
        {
            label: 'Finish'
        }
    ];

    // Mocked cooked data for step 2 demo
    const cookedData: ICookAssets = {
        models: mockModels,
        properties: mockProperties,
        twins: mockTwins
    };

    const stepData: WizardStepData = {
        connectStepData: {
            models: null,
            properties: null,
            twins: null
        },
        verificationStepData: {
            ...cookedData,
            modelSelectedProperties: {},
            twinSelectedProperties: {}
        },
        relationshipStepData: null,
        finishStepData: null
    };

    const authenticationParameters = useAuthParams();
    return !authenticationParameters ? (
        <div></div>
    ) : (
        <WizardNavigationContextProvider
            initialState={{
                adapter: new LegionAdapter(
                    new MsalAuthService(
                        authenticationParameters.adt.aadParameters
                    ),
                    authenticationParameters.adx.clusterUrl
                ),
                steps: steps,
                currentStep: 0,
                stepData: stepData
            }}
        >
            <WizardShell {...args} />
        </WizardNavigationContextProvider>
    );
};

export const ADX = Template.bind({}) as WizardShellStory;
ADX.args = {} as IWizardShellProps;
