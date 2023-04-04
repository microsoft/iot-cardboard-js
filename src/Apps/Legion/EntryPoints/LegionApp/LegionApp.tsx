import React from 'react';
import { IStepperWizardStep } from '../../Components/StepperWizard/StepperWizard.types';
import WizardShell from '../../Components/WizardShell/WizardShell';
import { WizardNavigationContextProvider } from '../../Models/Context/WizardNavigationContext/WizardNavigationContext';
import { ILegionAppProps } from './LegionApp.types';

const LegionApp: React.FC<ILegionAppProps> = (_props) => {
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
    return (
        <WizardNavigationContextProvider
            initialState={{
                steps: steps,
                currentStep: 0
            }}
        >
            <WizardShell />
        </WizardNavigationContextProvider>
    );
};

export default LegionApp;
