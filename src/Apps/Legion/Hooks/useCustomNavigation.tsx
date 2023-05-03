import { useEffect } from 'react';
import { useWizardNavigationContext } from '../Contexts/WizardNavigationContext/WizardNavigationContext';
import {
    IWizardAction,
    WizardNavigationContextActionType,
    WizardStepNumber
} from '../Contexts/WizardNavigationContext/WizardNavigationContext.types';
import { useDefaultNavigation } from './useDefaultNavigation';

export const useCustomNavigation = (
    currentStep: WizardStepNumber,
    primaryAction?: IWizardAction,
    secondaryActions?: IWizardAction[]
) => {
    const { wizardNavigationContextDispatch } = useWizardNavigationContext();
    const { disabled, onClick } = useDefaultNavigation(
        currentStep,
        primaryAction ? primaryAction.disabled : false
    );

    useEffect(() => {
        wizardNavigationContextDispatch({
            type: WizardNavigationContextActionType.SET_PRIMARY_ACTION,
            payload: {
                buttonProps: primaryAction
                    ? primaryAction
                    : { onClick: onClick, disabled: disabled }
            }
        });
        // Stringify avoids infinite loop
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        disabled,
        onClick,
        // eslint-disable-next-line react-hooks/exhaustive-deps
        JSON.stringify(primaryAction),
        wizardNavigationContextDispatch
    ]);

    useEffect(() => {
        wizardNavigationContextDispatch({
            type: WizardNavigationContextActionType.SET_SECONDARY_ACTIONS,
            payload: {
                // Just doing a single action at the moment, will extend to many when needed
                buttonProps: secondaryActions
            }
        });
        // Stringify avoids infinite loop
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(secondaryActions), wizardNavigationContextDispatch]);
};
