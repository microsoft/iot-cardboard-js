import React, { useMemo } from 'react';
import { useWizardNavigationContext } from '../../../Contexts/WizardNavigationContext/WizardNavigationContext';
import { WizardNavigationContextActionType } from '../../../Contexts/WizardNavigationContext/WizardNavigationContext.types';
import { Step } from './Step';
import { IStepProps } from './Step.types';
import { IStepperProps } from './Stepper.types';
import { StepSeparator } from './StepSeparator';

export const Stepper: React.FC<IStepperProps> = ({
    type,
    steps,
    isCurrentStepWithWarning,
    isNavigationDisabled,
    includeIcons,
    isAllCompletedSuccessfully
}) => {
    // Context
    const {
        wizardNavigationContextState,
        wizardNavigationContextDispatch
    } = useWizardNavigationContext();

    const stepperMapProps = useMemo(
        () =>
            steps.map(
                (step, index) =>
                    ({
                        label: step.label,
                        onClick: () => {
                            wizardNavigationContextDispatch({
                                type:
                                    WizardNavigationContextActionType.NAVIGATE_TO,
                                payload: { stepNumber: index }
                            });
                            if (step.onClick) {
                                step.onClick();
                            }
                        }
                    } as IStepProps)
            ),
        [steps, wizardNavigationContextDispatch]
    );

    return (
        <>
            {stepperMapProps.map(({ label, onClick }, index) => (
                <div
                    className={`cb-stepper-wizard-stepper cb-stepper-${type}`}
                    key={index}
                >
                    <Step
                        type={type}
                        isFinished={
                            wizardNavigationContextState.currentStep > index ||
                            isAllCompletedSuccessfully
                        }
                        isSelected={
                            wizardNavigationContextState.currentStep === index
                        }
                        label={label}
                        onClick={onClick}
                        isNavigationDisabled={isNavigationDisabled}
                        includeIcons={includeIcons}
                        isAllCompletedSuccessfully={isAllCompletedSuccessfully}
                        hasWarning={
                            wizardNavigationContextState.currentStep ===
                                index && isCurrentStepWithWarning
                        }
                    />
                    {index !== steps.length - 1 && (
                        <StepSeparator
                            orientation={type}
                            isFinished={
                                wizardNavigationContextState.currentStep > index
                            }
                            isAllCompletedSuccessfully={
                                isAllCompletedSuccessfully
                            }
                        />
                    )}
                </div>
            ))}
        </>
    );
};
