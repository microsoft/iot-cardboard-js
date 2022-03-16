import React from 'react';
export interface IStep {
    label: string;
    onClick?: (event?: React.MouseEvent<HTMLDivElement>) => void | undefined;
    isSelected?: boolean;
    isFinished?: boolean;
    isNavigationDisabled?: boolean;
}

export const Step: React.FC<IStep> = ({
    label,
    onClick,
    isSelected,
    isFinished,
    isNavigationDisabled,
}) => {
    return (
        <div
            className={`cb-stepper-wizard-step ${
                isSelected ? 'cb-step-is-selected' : ''
            } ${isNavigationDisabled ? 'cb-step-is-disabled' : ''}`}
            tabIndex={0}
            onClick={onClick}
            role={'button'}
        >
            <div
                className={`cb-stepper-wizard-step-circle ${
                    isSelected ? 'cb-step-is-selected' : ''
                } ${isFinished ? 'cb-step-is-finished' : ''}`}
            ></div>
            <div>{label}</div>
        </div>
    );
};
