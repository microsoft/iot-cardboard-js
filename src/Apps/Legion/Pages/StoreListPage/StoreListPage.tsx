import React from 'react';
import { IStoreListPageProps } from './StoreListPage.types';
import { getDebugLogger } from '../../../../Models/Services/Utils';
import StoreList from '../../Components/StoreList/StoreList';
import { Stack } from '@fluentui/react';

const debugLogging = false;
const logDebugConsole = getDebugLogger('StoreListPage', debugLogging);

const StoreListPage: React.FC<IStoreListPageProps> = () => {
    // contexts

    // state

    // hooks

    // callbacks

    // side effects

    // styles
    logDebugConsole('debug', 'Render');

    return (
        <Stack tokens={{ childrenGap: 8 }}>
            <h2>Welcome to the future</h2>
            <StoreList />
        </Stack>
    );
};

export default StoreListPage;
