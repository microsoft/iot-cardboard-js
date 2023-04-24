import React from 'react';
import { getDebugLogger } from '../../../../Models/Services/Utils';
import { IWizardPageProps } from './WizardPage.types';
import WizardShell from '../../Components/WizardShell/WizardShell';
import {
    DEFAULT_MOCK_DATA_MANAGEMENT_STATE,
    GET_DEFAULT_MOCK_WIZARD_DATA_CONTEXT,
    WIZARD_NAVIGATION_MOCK_DATA
} from '../../Components/WizardShell/WizardShellMockData';
import { WizardDataManagementContextProvider } from '../../Contexts/WizardDataManagementContext/WizardDataManagementContext';
import { WizardNavigationContextProvider } from '../../Contexts/WizardNavigationContext/WizardNavigationContext';
import { useAppNavigationContext } from '../../Contexts/NavigationContext/AppNavigationContext';
import { AppPageName } from '../../Contexts/NavigationContext/AppNavigationContext.types';
import { WizardDataContextProvider } from '../../Contexts/WizardDataContext/WizardDataContext';

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
            <WizardDataContextProvider
                initialState={GET_DEFAULT_MOCK_WIZARD_DATA_CONTEXT('Dairy')}
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
            </WizardDataContextProvider>
        </WizardDataManagementContextProvider>
    );
};

export default WizardPage;
