import React, { useEffect, useMemo } from 'react';
import { IStepperWizardStep } from '../StepperWizard';
import { IStep, Step } from './Step';
import { StepSeparator } from './StepSeparator';

interface IStepper {
    steps: Array<IStepperWizardStep>;
    currentStepIndex: number;
}
export const Stepper: React.FC<IStepper> = (props) => {
    const [currentStepIndex, setCurrentStepIndex] = React.useState(
        props.currentStepIndex ?? 0
    );
    const [steps, setSteps] = React.useState(props.steps);

    useEffect(() => {
        setSteps(props.steps);
    }, [props.steps]);

    useEffect(() => {
        if (props.currentStepIndex !== undefined) {
            setCurrentStepIndex(props.currentStepIndex);
        }
    }, [props.currentStepIndex]);

    const stepperMapProps = useMemo(
        () =>
            steps.map(
                (step, index) =>
                    ({
                        label: step.label,
                        onClick: () => {
                            setCurrentStepIndex(index);
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
                        isFinished={currentStepIndex > index}
                        isSelected={currentStepIndex === index}
                        label={label}
                        onClick={onClick}
                    />
                    {index !== steps.length - 1 && (
                        <StepSeparator isFinished={currentStepIndex > index} />
                    )}
                </div>
            ))}
        </nav>
    );
};
