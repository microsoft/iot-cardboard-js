import React, { useEffect, useMemo } from 'react';
import { IStepperWizardStep } from '../../../Models/Constants/Interfaces';
import { IStep, Step } from './Step';
import { StepSeparator } from './StepSeparator';

interface IStepper {
    steps: Array<IStepperWizardStep>;
    currentStepIndex: number;
    isNavigationDisabled: boolean;
}
export const Stepper: React.FC<IStepper> = ({
    steps,
    currentStepIndex,
    isNavigationDisabled
}) => {
    const [
        internalCurrentStepIndex,
        setInternalCurrentStepIndex
    ] = React.useState(currentStepIndex ?? 0);

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
        <nav>
            {stepperMapProps.map(({ label, onClick }, index) => (
                <div className={'cb-stepper-wizard-stepper'} key={index}>
                    <Step
                        isFinished={internalCurrentStepIndex > index}
                        isSelected={internalCurrentStepIndex === index}
                        label={label}
                        onClick={onClick}
                        isNavigationDisabled={isNavigationDisabled}
                    />
                    {index !== steps.length - 1 && (
                        <StepSeparator
                            isFinished={internalCurrentStepIndex > index}
                        />
                    )}
                </div>
            ))}
        </nav>
    );
};
