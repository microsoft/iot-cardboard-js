import { IStyle } from '@fluentui/react';
import { IExtendedTheme } from '../../../../../Theming/Theme.types';
import { StepperWizardType } from '../StepperWizard.types';

export interface IStepSeparatorProps {
    orientation: StepperWizardType;
    isFinished?: boolean;
    isAllCompletedSuccessfully: boolean;
}

export interface StepSeparatorStyleProps {
    theme: IExtendedTheme;
}
export interface StepSeparatorStyles {
    root: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: StepSeparatorSubComponentStyles;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface StepSeparatorSubComponentStyles {}
