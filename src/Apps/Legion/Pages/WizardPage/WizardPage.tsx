import React from 'react';
import { getDebugLogger } from '../../../../Models/Services/Utils';
import { IWizardPageProps } from './WizardPage.types';
import WizardShell from '../../Components/WizardShell/WizardShell';
import {
    DEFAULT_MOCK_DATA_MANAGEMENT_STATE,
    WIZARD_NAVIGATION_MOCK_DATA
} from '../../Components/WizardShell/WizardShellMockData';
import { WizardDataManagementContextProvider } from '../../Contexts/WizardDataManagementContext/DataManagementContextontext';
import { WizardNavigationContextProvider } from '../../Contexts/WizardNavigationContext/WizardNavigationContext';

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
        <WizardDataManagementContextProvider
            initialState={{
                ...DEFAULT_MOCK_DATA_MANAGEMENT_STATE
            }}
        >
            <WizardNavigationContextProvider
                initialState={WIZARD_NAVIGATION_MOCK_DATA}
            >
                <WizardShell />
            </WizardNavigationContextProvider>
        </WizardDataManagementContextProvider>
    );
};

export default WizardPage;
