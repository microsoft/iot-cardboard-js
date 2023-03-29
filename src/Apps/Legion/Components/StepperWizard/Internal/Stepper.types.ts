import { IStepperWizardStep, StepperWizardType } from '../StepperWizard.types';
import { IExtendedTheme } from '../../../../../Theming/Theme.types';
import { IStyle } from '@fluentui/react';

export interface IStepperProps {
    type: StepperWizardType;
    steps: Array<IStepperWizardStep>;
    isCurrentStepWithWarning: boolean;
    isNavigationDisabled: boolean;
    includeIcons: boolean;
    isAllCompletedSuccessfully: boolean;
}

export interface StepperStyleProps {
    theme: IExtendedTheme;
}
export interface StepperStyles {
    root: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: StepperSubComponentStyles;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface StepperSubComponentStyles {}
