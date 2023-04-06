import React from 'react';
import { ILegionAppProps } from './LegionApp.types';
import PageManager from '../../Components/PageManager/PageManager';
import { NavigationContextProvider } from '../../Contexts/NavigationContext/NavigationContext';
import { AppDataContextProvider } from '../../Contexts/AppDataContext/AppDataContext';

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
