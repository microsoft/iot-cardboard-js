import { StepperWizardType } from '../StepperWizard.types';
import { IExtendedTheme } from '../../../../../Theming/Theme.types';
import { IStyle } from '@fluentui/react';

export interface IStepProps {
    type: StepperWizardType;
    label: string;
    onClick?: (event?: React.MouseEvent<HTMLDivElement>) => void | undefined;
    isSelected: boolean;
    isFinished: boolean;
    isNavigationDisabled: boolean;
    includeIcons: boolean;
    isAllCompletedSuccessfully: boolean;
    hasWarning: boolean;
}

export interface StepStyleProps {
    theme: IExtendedTheme;
}
export interface StepStyles {
    root: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: StepSubComponentStyles;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface StepSubComponentStyles {}
