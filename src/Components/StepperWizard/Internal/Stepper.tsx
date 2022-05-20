import React, { useEffect, useMemo, useState } from 'react';
import { IStepperWizardStep, StepperWizardType } from '../StepperWizard.types';
import { IStep, Step } from './Step';
import { StepSeparator } from './StepSeparator';

interface IStepper {
    type: StepperWizardType;
    steps: Array<IStepperWizardStep>;
    currentStepIndex: number;
    isCurrentStepWithWarning: boolean;
    isNavigationDisabled: boolean;
    includeIcons: boolean;
    isAllCompletedSuccessfully: boolean;
}
export const Stepper: React.FC<IStepper> = ({
    type,
    steps,
    currentStepIndex,
    isCurrentStepWithWarning,
    isNavigationDisabled,
    includeIcons,
    isAllCompletedSuccessfully
}) => {
    const [internalCurrentStepIndex, setInternalCurrentStepIndex] = useState(
        currentStepIndex ?? 0
    );

    useEffect(() => {
        if (currentStepIndex !== undefined) {
            setInternalCurrentStepIndex(currentStepIndex);
        }
    }, [currentStepIndex]);

    const stepperMapProps = useMemo(
        () =>
            steps.map(
                (step, index) =>
                    ({
                        label: step.label,
                        onClick: () => {
                            setInternalCurrentStepIndex(index);
                            if (step.onClick) {
                                step.onClick();
                            }
                        }
                    } as IStep)
            ),
        [steps]
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
                            internalCurrentStepIndex > index ||
                            isAllCompletedSuccessfully
                        }
                        isSelected={internalCurrentStepIndex === index}
                        label={label}
                        onClick={onClick}
                        isNavigationDisabled={isNavigationDisabled}
                        includeIcons={includeIcons}
                        isAllCompletedSuccessfully={isAllCompletedSuccessfully}
                        hasWarning={
                            internalCurrentStepIndex === index &&
                            isCurrentStepWithWarning
                        }
                    />
                    {index !== steps.length - 1 && (
                        <StepSeparator
                            orientation={type}
                            isFinished={internalCurrentStepIndex > index}
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
