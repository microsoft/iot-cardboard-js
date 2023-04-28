import React, { useMemo } from 'react';
import { ILegionAppProps } from './LegionApp.types';
import {
    AppNavigationContextProvider,
    useAppNavigationContext
} from '../../Contexts/NavigationContext/AppNavigationContext';
import { AppDataContextProvider } from '../../Contexts/AppDataContext/AppDataContext';
import FlowPickerPage from '../../Pages/FlowPickerPage/FlowPickerPage';
import StoreListPage from '../../Pages/StoreListPage/StoreListPage';
import WizardPage from '../../Pages/WizardPage/WizardPage';
import { AppPageName } from '../../Contexts/NavigationContext/AppNavigationContext.types';

const PageManager: React.FC = () => {
    // contexts
    const { appNavigationState } = useAppNavigationContext();

    // data
    const page = useMemo(() => {
        switch (appNavigationState.currentPage.pageName) {
            case AppPageName.FlowPicker:
                return <FlowPickerPage />;
            case AppPageName.StoreList:
                return <StoreListPage />;
            case AppPageName.Wizard:
                return <WizardPage />;
        }
    }, [appNavigationState.currentPage]);

    return page;
};

const LegionApp: React.FC<ILegionAppProps> = (props) => {
    return (
        <AppDataContextProvider extensionClient={props?.extensionClient}>
            <AppNavigationContextProvider>
                <PageManager />
            </AppNavigationContextProvider>
        </AppDataContextProvider>
    );
};

export default LegionApp;
