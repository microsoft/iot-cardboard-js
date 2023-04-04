import React from 'react';
import WizardShell from '../../Components/WizardShell/WizardShell';
import { WizardNavigationContextProvider } from '../../Models/Context/WizardNavigationContext/WizardNavigationContext';
import { ILegionAppProps } from './LegionApp.types';
import MockDataManagementAdapter from '../../Adapters/Standalone/DataManagement/MockDataManagementAdapter';
import {
    stepData,
    steps
} from '../../Components/WizardShell/WizardShellMockData';

const LegionApp: React.FC<ILegionAppProps> = (_props) => {
    return (
        <WizardNavigationContextProvider
            initialState={{
                adapter: new MockDataManagementAdapter(),
                steps: steps,
                currentStep: 0,
                stepData: stepData
            }}
        >
            <WizardShell />
        </WizardNavigationContextProvider>
    );
};

export default LegionApp;
