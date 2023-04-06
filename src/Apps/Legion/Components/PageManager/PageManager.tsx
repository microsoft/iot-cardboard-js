import React, { useMemo } from 'react';
import { IPageManagerProps } from './PageManager.types';
import { useNavigationContext } from '../../Contexts/NavigationContext/NavigationContext';
import { getDebugLogger } from '../../../../Models/Services/Utils';
import StoreListPage from '../../Pages/StoreListPage/StoreListPage';
import FlowPickerPage from '../../Pages/FlowPickerPage/FlowPickerPage';
import WizardPage from '../../Pages/WizardPage/WizardPage';

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
