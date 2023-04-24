import { useEffect, useCallback } from 'react';
import { useWizardNavigationContext } from '../Contexts/WizardNavigationContext/WizardNavigationContext';
import {
    IWizardAction,
    WizardNavigationContextActionType,
    WizardStepNumber
} from '../Contexts/WizardNavigationContext/WizardNavigationContext.types';

export const useDefaultNavigation = (
    currentStep: WizardStepNumber,
    isNextDisabled: boolean
): IWizardAction => {
    const { wizardNavigationContextDispatch } = useWizardNavigationContext();
    const handleNextClick = useCallback(() => {
        wizardNavigationContextDispatch({
            type: WizardNavigationContextActionType.NAVIGATE_TO,
            payload: { stepNumber: currentStep + 1 }
        });
    }, [currentStep, wizardNavigationContextDispatch]);

    useEffect(() => {
        wizardNavigationContextDispatch({
            type: WizardNavigationContextActionType.SET_PRIMARY_ACTION,
            payload: {
                buttonProps: {
                    onClick: handleNextClick,
                    disabled: isNextDisabled
                }
            }
        });
    }, [handleNextClick, isNextDisabled, wizardNavigationContextDispatch]);

    return { disabled: isNextDisabled, onClick: handleNextClick };
};
