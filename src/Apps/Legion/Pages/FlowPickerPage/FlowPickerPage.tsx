import React, { useCallback } from 'react';
import { getDebugLogger } from '../../../../Models/Services/Utils';
import { IFlowPickerPageProps } from './FlowPickerPage.types';
import { Stack } from '@fluentui/react';
import FlowPicker from '../../Components/FlowPicker/FlowPicker';
import { useAppDataContext } from '../../Contexts/AppDataContext/AppDataContext';
import { useAppNavigationContext } from '../../Contexts/NavigationContext/AppNavigationContext';
import {
    AppNavigationContextActionType,
    AppPageName
} from '../../Contexts/NavigationContext/AppNavigationContext.types';
import { WizardStepNumber } from '../../Contexts/WizardNavigationContext/WizardNavigationContext.types';

const debugLogging = false;
const logDebugConsole = getDebugLogger('FlowPickerPage', debugLogging);

const FlowPickerPage: React.FC<IFlowPickerPageProps> = () => {
    // contexts
    const { appDataState } = useAppDataContext();
    const { appNavigationDispatch } = useAppNavigationContext();

    // state

    // hooks

    // callbacks
    const navigateToWizard = useCallback(
        (step: WizardStepNumber) => {
            appNavigationDispatch({
                type: AppNavigationContextActionType.NAVIGATE_TO,
                payload: {
                    pageName: AppPageName.Wizard,
                    step: step
                }
            });
        },
        [appNavigationDispatch]
    );
    const startOver = useCallback(() => {
        appNavigationDispatch({
            type: AppNavigationContextActionType.NAVIGATE_TO,
            payload: {
                pageName: AppPageName.StoreList
            }
        });
    }, [appNavigationDispatch]);

    // side effects

    // styles

    logDebugConsole('debug', 'Render');

    return (
        <Stack tokens={{ childrenGap: 8 }}>
            <h2>Pick a flow</h2>
            Store: {appDataState.targetDatabase.databaseName}
            <FlowPicker
                onNavigateBack={startOver}
                onNavigateNext={navigateToWizard}
            />
        </Stack>
    );
};

export default FlowPickerPage;
