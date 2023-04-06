import React from 'react';
import { ILegionAppProps } from './LegionApp.types';
import PageManager from '../../Components/PageManager/PageManager';
import { NavigationContextProvider } from '../../Contexts/NavigationContext/NavigationContext';

const LegionApp: React.FC<ILegionAppProps> = (_props) => {
    return (
        <NavigationContextProvider
            initialState={{ currentPage: 'StoreListPage' }}
        >
            <PageManager />
        </NavigationContextProvider>
    );
};

export default LegionApp;
