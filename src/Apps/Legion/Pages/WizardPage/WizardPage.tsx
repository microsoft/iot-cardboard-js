import React from 'react';
import { getDebugLogger } from '../../../../Models/Services/Utils';
import { IWizardPageProps } from './WizardPage.types';
import WizardShell from '../../Components/WizardShell/WizardShell';
import {
    DEFAULT_MOCK_DATA_MANAGEMENT_STATE,
    WIZARD_NAVIGATION_MOCK_DATA
} from '../../Components/WizardShell/WizardShellMockData';
import { WizardDataManagementContextProvider } from '../../Contexts/WizardDataManagementContext/WizardDataManagementContext';
import { WizardNavigationContextProvider } from '../../Contexts/WizardNavigationContext/WizardNavigationContext';
import { useAppNavigationContext } from '../../Contexts/NavigationContext/AppNavigationContext';
import { AppPageName } from '../../Contexts/NavigationContext/AppNavigationContext.types';

const debugLogging = false;
const logDebugConsole = getDebugLogger('WizardPage', debugLogging);

const WizardPage: React.FC<IWizardPageProps> = () => {
    // contexts
    const { appNavigationState } = useAppNavigationContext();

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
                initialState={{
                    ...WIZARD_NAVIGATION_MOCK_DATA,
                    currentStep:
                        appNavigationState.currentPage.pageName ===
                        AppPageName.Wizard
                            ? appNavigationState.currentPage.step
                            : WIZARD_NAVIGATION_MOCK_DATA.currentStep
                }}
            >
                <WizardShell />
            </WizardNavigationContextProvider>
        </WizardDataManagementContextProvider>
    );
};

export default WizardPage;
