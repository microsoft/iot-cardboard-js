import React, { useMemo } from 'react';
import { IPageManagerProps } from './PageManager.types';
import MockDataManagementAdapter from '../../Adapters/Standalone/DataManagement/MockDataManagementAdapter';
import { WizardNavigationContextProvider } from '../../Models/Context/WizardNavigationContext/WizardNavigationContext';
import { steps, stepData } from '../WizardShell/WizardShellMockData';
import WizardShell from '../WizardShell/WizardShell';
import { useNavigationContext } from '../../Contexts/NavigationContext/NavigationContext';
import { getDebugLogger } from '../../../../Models/Services/Utils';
import StoreListPage from '../../Pages/StoreListPage/StoreListPage';
import FlowPickerPage from '../../Pages/FlowPickerPage/FlowPickerPage';

const debugLogging = false;
const logDebugConsole = getDebugLogger('PageManager', debugLogging);

const PageManager: React.FC<IPageManagerProps> = () => {
    // contexts
    const { navigationState } = useNavigationContext();

    // state

    // hooks

    // callbacks

    // side effects

    // styles

    // data
    const page = useMemo(() => {
        switch (navigationState.currentPage) {
            case 'Home':
                return <div>Home</div>;
            case 'ActionPicker':
                return <FlowPickerPage />;
            case 'StoreListPage':
                return <StoreListPage />;
            case 'Wizard':
                return <WizardPage />;
        }
    }, [navigationState.currentPage]);

    logDebugConsole('debug', 'Render');

    return page;
};

export default PageManager;
