import React from 'react';
import WizardShell from '../../Components/WizardShell/WizardShell';
import { WizardNavigationContextProvider } from '../../Contexts/WizardNavigationContext/WizardNavigationContext';
import { ILegionAppProps } from './LegionApp.types';
import MockDataManagementAdapter from '../../Adapters/Standalone/DataManagement/MockDataManagementAdapter';
import {
    wizardData,
    steps
} from '../../Components/WizardShell/WizardShellMockData';
import { DataManagementContextProvider } from '../../Contexts/DataManagementContext/DataManagementContext';

const LegionApp: React.FC<ILegionAppProps> = (_props) => {
    return (
        <DataManagementContextProvider
            initialState={{
                ...wizardData
            }}
        >
            <WizardNavigationContextProvider
                initialState={{
                    adapter: new MockDataManagementAdapter(),
                    steps: steps,
                    currentStep: 0
                }}
            >
                <WizardShell />
            </WizardNavigationContextProvider>
        </DataManagementContextProvider>
    );
};

export default LegionApp;
