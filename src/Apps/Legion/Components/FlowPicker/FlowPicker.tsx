import React, { useCallback } from 'react';
import {
    DefaultButton,
    PrimaryButton,
    Stack,
    classNamesFunction,
    styled
} from '@fluentui/react';
import { useExtendedTheme } from '../../../../Models/Hooks/useExtendedTheme';
import { getDebugLogger } from '../../../../Models/Services/Utils';
import {
    IFlowPickerProps,
    IFlowPickerStyleProps,
    IFlowPickerStyles
} from './FlowPicker.types';
import { getStyles } from './FlowPicker.styles';
import {
    AppNavigationContextActionType,
    AppPageName
} from '../../Contexts/NavigationContext/AppNavigationContext.types';
import { useAppNavigationContext } from '../../Contexts/NavigationContext/AppNavigationContext';
import { WizardStepNumber } from '../../Contexts/WizardNavigationContext/WizardNavigationContext.types';
import { useAppDataContext } from '../../Contexts/AppDataContext/AppDataContext';

const debugLogging = false;
const logDebugConsole = getDebugLogger('FlowPicker', debugLogging);

const getClassNames = classNamesFunction<
    IFlowPickerStyleProps,
    IFlowPickerStyles
>();

const FlowPicker: React.FC<IFlowPickerProps> = (props) => {
    const { styles } = props;

    // contexts
    const { appDataState } = useAppDataContext();
    const { appNavigationDispatch } = useAppNavigationContext();

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

    // styles
    const classNames = getClassNames(styles, {
        theme: useExtendedTheme()
    });

    logDebugConsole('debug', 'Render');

    return (
        <Stack className={classNames.root} tokens={{ childrenGap: 8 }}>
            Store: {appDataState.targetDatabase.databaseName}
            <Stack tokens={{ childrenGap: 8 }}>
                <PrimaryButton
                    text={'Discover'}
                    onClick={() => navigateToWizard(WizardStepNumber.AddSource)}
                />
                <PrimaryButton
                    text={'Modify'}
                    onClick={() => navigateToWizard(WizardStepNumber.Modify)}
                />
                <PrimaryButton
                    text={'View'}
                    onClick={() => navigateToWizard(WizardStepNumber.Save)}
                />
                <DefaultButton text={'Back'} onClick={startOver} />
            </Stack>
        </Stack>
    );
};

export default styled<
    IFlowPickerProps,
    IFlowPickerStyleProps,
    IFlowPickerStyles
>(FlowPicker, getStyles);
