import React from 'react';
import { FontIcon } from '@fluentui/react';
import { IStepProps } from './Step.types';

export const Step: React.FC<IStepProps> = ({
    type,
    label,
    onClick,
    isSelected,
    isFinished,
    isNavigationDisabled,
    includeIcons,
    isAllCompletedSuccessfully,
    hasWarning
}) => {
    return (
        <div
            className={`cb-stepper-wizard-step ${
                isSelected ? 'cb-step-is-selected' : ''
            } ${
                isNavigationDisabled ? 'cb-step-is-disabled' : ''
            } cb-stepper-${type}`}
            tabIndex={0}
            onClick={onClick}
            role="button"
        >
            <div
                className={`cb-stepper-wizard-step-circle ${
                    isSelected ? 'cb-step-is-selected' : ''
                } ${isFinished ? 'cb-step-is-finished' : ''} ${
                    isAllCompletedSuccessfully ? 'cb-green-line' : ''
                }`}
            >
                {includeIcons && (
                    <>
                        {isFinished && (
                            <FontIcon
                                iconName={'CheckMark'}
                                className={'cb-stepper-wizard-step-circle-icon'}
                            />
                        )}
                        {hasWarning && (
                            <FontIcon
                                iconName={'Warning'}
                                className={'cb-stepper-wizard-step-circle-icon'}
                            />
                        )}
                    </>
                )}
            </div>
            <span className={'cb-stepper-wizard-step-label'}>{label}</span>
        </div>
    );
};
