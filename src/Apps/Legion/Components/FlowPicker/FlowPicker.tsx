import React, { useCallback } from 'react';
import {
    DefaultButton,
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

const debugLogging = false;
const logDebugConsole = getDebugLogger('FlowPicker', debugLogging);

const getClassNames = classNamesFunction<
    IFlowPickerStyleProps,
    IFlowPickerStyles
>();

const FlowPicker: React.FC<IFlowPickerProps> = (props) => {
    const { styles } = props;

    // contexts
    const { appNavigationDispatch } = useAppNavigationContext();

    // state

    // hooks

    // callbacks
    const navigate = useCallback(
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

    // side effects

    // styles
    const classNames = getClassNames(styles, {
        theme: useExtendedTheme()
    });

    logDebugConsole('debug', 'Render');

    return (
        <Stack className={classNames.root}>
            <DefaultButton
                text={'Discover'}
                onClick={() => navigate(WizardStepNumber.AddSource)}
            />
            <DefaultButton
                text={'Modify'}
                onClick={() => navigate(WizardStepNumber.Modify)}
            />
            <DefaultButton
                text={'View'}
                onClick={() => navigate(WizardStepNumber.Save)}
            />
        </Stack>
    );
};

export default styled<
    IFlowPickerProps,
    IFlowPickerStyleProps,
    IFlowPickerStyles
>(FlowPicker, getStyles);
