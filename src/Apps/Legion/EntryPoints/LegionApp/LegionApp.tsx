import React, { useMemo } from 'react';
import { ILegionAppProps } from './LegionApp.types';
import {
    NavigationContextProvider,
    useNavigationContext
} from '../../Contexts/NavigationContext/NavigationContext';
import { AppDataContextProvider } from '../../Contexts/AppDataContext/AppDataContext';
import FlowPickerPage from '../../Pages/FlowPickerPage/FlowPickerPage';
import StoreListPage from '../../Pages/StoreListPage/StoreListPage';
import WizardPage from '../../Pages/WizardPage/WizardPage';

const PageManager: React.FC = () => {
    // contexts
    const { navigationState } = useNavigationContext();

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

    return page;
};

const LegionApp: React.FC<ILegionAppProps> = (_props) => {
    return (
        <AppDataContextProvider>
            <NavigationContextProvider>
                <PageManager />
            </NavigationContextProvider>
        </AppDataContextProvider>
    );
};

export default LegionApp;
