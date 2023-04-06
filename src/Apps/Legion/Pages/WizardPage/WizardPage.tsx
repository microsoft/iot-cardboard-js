import React from 'react';
import { getDebugLogger } from '../../../../Models/Services/Utils';
import { IWizardPageProps } from './WizardPage.types';
import MockDataManagementAdapter from '../../Adapters/Standalone/DataManagement/MockDataManagementAdapter';
import WizardShell from '../../Components/WizardShell/WizardShell';
import {
    steps,
    stepData
} from '../../Components/WizardShell/WizardShellMockData';
import { WizardNavigationContextProvider } from '../../Models/Context/WizardNavigationContext/WizardNavigationContext';

const debugLogging = false;
const logDebugConsole = getDebugLogger('WizardPage', debugLogging);

const WizardPage: React.FC<IWizardPageProps> = () => {
    // contexts

    // state

    // hooks

    // callbacks

    // side effects

    // styles

    logDebugConsole('debug', 'Render');

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

export default WizardPage;
