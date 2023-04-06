import React from 'react';
import WizardShell from '../../Components/WizardShell/WizardShell';
import { WizardNavigationContextProvider } from '../../Contexts/WizardNavigationContext/WizardNavigationContext';
import { ILegionAppProps } from './LegionApp.types';
import {
    DEFAULT_MOCK_DATA_MANAGEMENT_STATE,
    WIZARD_NAVIGATION_MOCK_DATA
} from '../../Components/WizardShell/WizardShellMockData';
import { DataManagementContextProvider } from '../../Contexts/DataManagementContext/DataManagementContext';

const LegionApp: React.FC<ILegionAppProps> = (_props) => {
    return (
        <DataManagementContextProvider
            initialState={{
                ...DEFAULT_MOCK_DATA_MANAGEMENT_STATE
            }}
        >
            <WizardNavigationContextProvider
                initialState={WIZARD_NAVIGATION_MOCK_DATA}
            >
                <WizardShell />
            </WizardNavigationContextProvider>
        </DataManagementContextProvider>
    );
};

export default LegionApp;
