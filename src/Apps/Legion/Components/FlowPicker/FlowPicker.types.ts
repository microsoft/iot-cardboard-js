import { IStyle, IStyleFunctionOrObject } from '@fluentui/react';
import { IExtendedTheme } from '../../../../Theming/Theme.types';
import { WizardStepNumber } from '../../Contexts/WizardNavigationContext/WizardNavigationContext.types';

export interface IFlowPickerProps {
    onNavigateNext: (step: WizardStepNumber) => void;
    onNavigateBack: () => void;
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<IFlowPickerStyleProps, IFlowPickerStyles>;
}

export interface IFlowPickerStyleProps {
    theme: IExtendedTheme;
}
export interface IFlowPickerStyles {
    root: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: IFlowPickerSubComponentStyles;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IFlowPickerSubComponentStyles {}
